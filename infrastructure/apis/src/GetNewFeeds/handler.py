import os, sys, json, backoff
from typing import Any
from gremlin_python.driver.driver_remote_connection import DriverRemoteConnection
from gremlin_python.driver.protocol import GremlinServerError
from gremlin_python.driver import serializer
from gremlin_python.process.anonymous_traversal import traversal
from gremlin_python.process.graph_traversal import GraphTraversalSource, __
from gremlin_python.process.strategies import *
from gremlin_python.process.traversal import T, Order
from aiohttp.client_exceptions import ClientConnectorError
from botocore.auth import SigV4Auth
from botocore.awsrequest import AWSRequest
from botocore.exceptions import ClientError
from types import SimpleNamespace

import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)


reconnectable_err_msgs = [
    "ReadOnlyViolationException",
    "Server disconnected",
    "Connection refused",
    "Connection was already closed",
    "Connection was closed by server",
    "Failed to connect to server: HTTP Error code 403 - Forbidden",
]

retriable_err_msgs = ["ConcurrentModificationException"] + reconnectable_err_msgs

network_errors = [OSError, ClientConnectorError]

retriable_errors = [
    GremlinServerError,
    RuntimeError,
    Exception,
    ClientError,
] + network_errors


def prepare_iamdb_request(database_url) -> tuple[Any, list[tuple[str, str]]]:

    service = "neptune-db"
    method = "GET"

    access_key = os.environ["AWS_ACCESS_KEY_ID"]
    secret_key = os.environ["AWS_SECRET_ACCESS_KEY"]
    region = os.environ["AWS_REGION"]
    session_token = os.environ["AWS_SESSION_TOKEN"]

    creds = SimpleNamespace(
        access_key=access_key,
        secret_key=secret_key,
        token=session_token,
        region=region,
    )

    request = AWSRequest(method=method, url=database_url, data=None)
    SigV4Auth(creds, service, region).add_auth(request)

    return (database_url, request.headers.items())


def is_retriable_error(e) -> bool:

    is_retriable = False
    err_msg = str(e)

    if isinstance(e, tuple(network_errors)):
        is_retriable = True
    else:
        is_retriable = any(
            retriable_err_msg in err_msg for retriable_err_msg in retriable_err_msgs
        )

    logger.error("error: [{}] {}".format(type(e), err_msg))
    logger.info("is_retriable: {}".format(is_retriable))

    return is_retriable


def is_non_retriable_error(e) -> bool:
    return not is_retriable_error(e)


def reset_connection_if_connection_issue(params) -> None:

    is_reconnectable = False

    e = sys.exc_info()[1]
    err_msg = str(e)

    if isinstance(e, tuple(network_errors)):
        is_reconnectable = True
    else:
        is_reconnectable = any(
            reconnectable_err_msg in err_msg
            for reconnectable_err_msg in reconnectable_err_msgs
        )

    logger.info("is_reconnectable: {}".format(is_reconnectable))

    if is_reconnectable:
        global conn
        global g
        conn.close()
        conn = create_remote_connection()
        g = create_graph_traversal_source(conn)


def to_json(result) -> dict[str, Any]:
    _result = {}
    for k, v in result.items():
        key = str(k).split(".")[-1]
        if type(v) == dict:
            value = to_json(v)
        else:
            value = v
        _result[key] = value
    return _result


@backoff.on_exception(
    backoff.constant,
    tuple(retriable_errors),
    max_tries=5,
    jitter=None,
    giveup=is_non_retriable_error,
    on_backoff=reset_connection_if_connection_issue,
    interval=1,
)
def _handler(**kwargs) -> dict:
    userId = kwargs["userId"]
    num = int(kwargs["num"])

    contents = (
        g.V()
        .has_label("Content")
        .limit(num)
        .as_("content")
        .in_e("Create")
        .out_v()
        .has_label("User")
        .as_("creator")
        .project("content", "user", "liked", "followed", "likeCount")
        .by(__.select("content").element_map())
        .by(__.select("creator").element_map())
        .by(
            __.select("content")
            .in_e("Like")
            .out_v()
            .has_id(userId)
            .fold()
            .coalesce(__.unfold().constant(True), __.constant(False))
        )
        .by(
            __.select("creator")
            .in_e("Follow")
            .out_v()
            .has_id(userId)
            .fold()
            .coalesce(__.unfold().constant(True), __.constant(False))
        )
        .by(__.select("content").in_e("Like").count())
        .to_list()
    )

    result = [
        {
            "content": to_json(item["content"]),
            "user": to_json(item["user"]),
            "liked": item["liked"],
            "followed": item["followed"],
            "likeCount": item["likeCount"],
        }
        for item in contents
    ]
    return result


def handler(event, context) -> dict[str, Any]:
    result = _handler(**event["queryStringParameters"])
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "http://localhost:5173",
            "Access-Control-Allow-Methods": "OPTIONS,POST",
        },
        "body": json.dumps(result),
    }


def create_graph_traversal_source(conn) -> GraphTraversalSource:
    return traversal().withRemote(conn)


def create_remote_connection() -> DriverRemoteConnection:
    logger.info("Creating remote connection")

    (database_url, headers) = connection_info()

    return DriverRemoteConnection(
        database_url,
        "g",
        pool_size=1,
        # message_serializer=serializer.GraphSONSerializersV2d0(),
        headers=headers,
    )


def connection_info() -> tuple[str, list[tuple[str, str]]] | tuple[str, dict]:

    database_url = "wss://{}:{}/gremlin".format(
        os.environ["NEPTUNE_WRITE_ENDPOINT"], os.environ["NEPTUNE_PORT"]
    )

    if "USE_IAM" in os.environ and os.environ["USE_IAM"] == "true":
        return prepare_iamdb_request(database_url)
    else:
        return (database_url, {})


conn = create_remote_connection()
g = create_graph_traversal_source(conn)
