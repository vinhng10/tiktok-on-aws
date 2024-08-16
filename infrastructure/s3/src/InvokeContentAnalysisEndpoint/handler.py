# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import os
import boto3
import json
from urllib.parse import unquote_plus
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):
    try:
        s3 = boto3.client("s3")
        sagemaker = boto3.client("sagemaker-runtime", region_name="us-east-1")
        bucket = event["Records"][0]["s3"]["bucket"]["name"]
        key = unquote_plus(event["Records"][0]["s3"]["object"]["key"], encoding="utf-8")

        input_key = f'content-analysis/inputs/{key.replace("mp4", "json")}'
        s3.put_object(
            Bucket="tiktok-clone-sagemaker",
            Key=input_key,
            Body=json.dumps({"bucket": bucket, "key": key}),
            ContentType="application/json",
        )
        response = sagemaker.invoke_endpoint_async(
            EndpointName="content-analysis",
            InputLocation=f"s3://tiktok-clone-sagemaker/{key}",
            InvocationTimeoutSeconds=3
        )
        return response
    except Exception as e:
        logger.error(f"An error occurred: {e}")
