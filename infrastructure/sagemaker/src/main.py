# https://sagemaker-examples.readthedocs.io/en/latest/frameworks/pytorch/get_started_mnist_deploy.html

import json
import tarfile
import boto3
import sagemaker
import numpy as np
from sagemaker.pytorch.model import PyTorchModel
from sagemaker.async_inference import AsyncInferenceConfig
from sagemaker.predictor_async import AsyncPredictor
from sagemaker.predictor import Predictor
from sagemaker.serializers import JSONSerializer
from sagemaker.deserializers import JSONDeserializer


# # Create S3 SageMaker bucket:
try:
    sagemaker.Session(default_bucket="tiktok-clone-sagemaker").default_bucket()
except Exception as e:
    print(f"An error occurred: {e}")

# Create IAM SageMaker execution role
try:
    # Create SageMaker execution role:
    iam = boto3.client("iam")

    role_name = "SageMakerExecutionRole"
    assume_role_policy_document = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {"Service": "sagemaker.amazonaws.com"},
                "Action": "sts:AssumeRole",
            }
        ],
    }
    response = iam.create_role(
        RoleName=role_name,
        AssumeRolePolicyDocument=json.dumps(assume_role_policy_document),
    )
    role = response["Role"]["Arn"]
    print(f"Created role: {role}")

    # Attach necessary policies
    iam.attach_role_policy(
        RoleName=role_name,
        PolicyArn="arn:aws:iam::aws:policy/AmazonSageMakerFullAccess",
    )
except iam.exceptions.EntityAlreadyExistsException:
    print(f"Role {role_name} already exists")
    role = iam.get_role(RoleName=role_name)["Role"]["Arn"]

# Upload model to S3:
with tarfile.open("model.tar.gz", "w:gz") as tar:
    tar.add("code")
    tar.add("model.pth")
model_url = sagemaker.Session(default_bucket="tiktok-clone-sagemaker").upload_data(
    path="model.tar.gz",
    bucket="tiktok-clone-sagemaker",
    key_prefix="content-analysis/models",
)

# Create SageMaker model:
async_config = AsyncInferenceConfig(
    output_path="s3://tiktok-clone-sagemaker/content-analysis/outputs",
    failure_path="s3://tiktok-clone-sagemaker/content-analysis/failures",
    notification_config={
        "SuccessTopic": "arn:aws:sns:us-east-1:751439179750:content-analysis-sagemaker",
        "ErrorTopic": "arn:aws:sns:us-east-1:751439179750:content-analysis-sagemaker",
    },
)
model = PyTorchModel(
    name="content-analysis",
    model_data=model_url,
    role=role,
    source_dir="code",
    entry_point="inference.py",
    framework_version="2.3",
    py_version="py311",
    sagemaker_session=sagemaker.Session(default_bucket="tiktok-clone-sagemaker"),
)
predictor = model.deploy(
    endpoint_name="content-analysis",
    initial_instance_count=1,
    instance_type="ml.t2.medium",
    async_inference_config=async_config,
    serializer=JSONSerializer(),
    deserializer=JSONDeserializer(),
)

# sagemaker_runtime = boto3.client("sagemaker-runtime", region_name="us-east-1")
# data = {"inputs": np.random.rand(2, 2).tolist()}
# response = predictor.predict_async(data)

# response = sagemaker_runtime.invoke_endpoint(
#     EndpointName="content-analysis",
#     ContentType="application/json",
#     Body=bytes(json.dumps(data), encoding="utf-8"),
# )
# response["Body"].read().decode("utf-8")


# response = sagemaker_runtime.invoke_endpoint_async(
#     EndpointName="content-analysis-async",
#     InputLocation="s3://tiktok-clone-sagemaker/input.json",
# )
