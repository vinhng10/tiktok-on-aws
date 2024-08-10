import boto3
import os
import sys
import uuid
from urllib.parse import unquote_plus
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

s3 = boto3.client("s3")


def handler(event, context):
    for record in event["Records"]:
        try:
            bucket = record["s3"]["bucket"]["name"]
            key = unquote_plus(record["s3"]["object"]["key"])
            
            s3.download_file(bucket, key, f"/tmp/{key.split("/")[-1]}")
            s3.upload_file(
                upload_path, "{}-resized".format(bucket), "resized-{}".format(key)
            )
        except Exception as e:
            logger.error(e)
