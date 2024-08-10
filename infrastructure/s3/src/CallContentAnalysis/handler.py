# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import os
import boto3
import json
from urllib.parse import unquote_plus
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

sqs = boto3.client("sqs")


def handler(event, context):
    try:
        # Send the message to SQS queue
        bucket = event["Records"][0]["s3"]["bucket"]["name"]
        key = unquote_plus(event["Records"][0]["s3"]["object"]["key"], encoding="utf-8")
        response = sqs.send_message(
            QueueUrl=os.environ.get("CONTENTANALYSIS_QUEUE_URL"),
            MessageBody=json.dumps({"contentUrl": f"s3://{bucket}/{key}"}),
        )
        return response
    except Exception as e:
        logger.error(f"An error occurred: {e}")
