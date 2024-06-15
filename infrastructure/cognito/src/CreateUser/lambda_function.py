import boto3
import logging
from botocore.exceptions import ClientError

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def lambda_handler(event, context):
    # Initialize a session using Amazon DynamoDB
    client = boto3.client("dynamodb")

    try:
        # Put the item into the DynamoDB table
        response = client.put_item(
            TableName="Vertex",
            Item={
                "Id": {"S": event["request"]["userAttributes"]["sub"]},
            },
        )
        logger.info(response)
        return event
    except ClientError as e:
        logger.error(e.response["Error"]["Message"])
