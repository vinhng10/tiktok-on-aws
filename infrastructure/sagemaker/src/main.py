# https://sagemaker-examples.readthedocs.io/en/latest/frameworks/pytorch/get_started_mnist_deploy.html

import json
import tarfile
import boto3
import sagemaker
from sagemaker.pytorch.model import PyTorchModel
from sagemaker.async_inference import AsyncInferenceConfig
from sagemaker.serializers import JSONSerializer
from sagemaker.deserializers import JSONDeserializer


# Create S3 SageMaker bucket:
try:
    sagemaker.Session(default_bucket="tiktok-clone-sagemaker").default_bucket()
except Exception as e:
    print(f"An error occurred: {e}")


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

    # Attach managed policies
    iam.attach_role_policy(
        RoleName=role_name,
        PolicyArn="arn:aws:iam::aws:policy/AmazonSageMakerFullAccess",
    )

    # Create inline policies:
    sagemaker_s3_access_policy = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": [
                    "s3:PutObject",
                    "s3:GetObject",
                    "s3:AbortMultipartUpload",
                    "s3:ListBucket",
                ],
                "Resource": "arn:aws:s3:::tiktok-clone-sagemaker/*",
            }
        ],
    }
    sagemaker_sns_access_policy = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "sns:Publish",
                "Resource": "arn:aws:sns:us-east-1:751439179750:content-analysis",
            }
        ],
    }
    s3_content_storage_get_objects_policy = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": "s3:GetObject",
                "Resource": "arn:aws:s3:::tiktok-clone-storage/*",
            }
        ],
    }
    iam.put_role_policy(
        RoleName=role_name,
        PolicyName="SageMakerS3Access",
        PolicyDocument=json.dumps(sagemaker_s3_access_policy),
    )
    iam.put_role_policy(
        RoleName=role_name,
        PolicyName="SageMakerSNSAccess",
        PolicyDocument=json.dumps(sagemaker_sns_access_policy),
    )
    iam.put_role_policy(
        RoleName=role_name,
        PolicyName="S3ContentStorageGetObjects",
        PolicyDocument=json.dumps(s3_content_storage_get_objects_policy),
    )
except iam.exceptions.EntityAlreadyExistsException:
    print(f"Role {role_name} already exists")
    role = iam.get_role(RoleName=role_name)["Role"]["Arn"]
except Exception as e:
    raise e

# Upload model to S3:
with tarfile.open("model.tar.gz", "w:gz") as tar:
    tar.add("code")
    tar.add("model.pth")
model_url = sagemaker.Session(default_bucket="tiktok-clone-sagemaker").upload_data(
    path="model.tar.gz",
    bucket="tiktok-clone-sagemaker",
    key_prefix="content-analysis/model",
)

# Create SageMaker model:
async_config = AsyncInferenceConfig(
    output_path="s3://tiktok-clone-sagemaker/content-analysis/outputs",
    failure_path="s3://tiktok-clone-sagemaker/content-analysis/failures",
    notification_config={
        "SuccessTopic": "arn:aws:sns:us-east-1:751439179750:content-analysis",
        "ErrorTopic": "arn:aws:sns:us-east-1:751439179750:content-analysis",
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
)
predictor = model.deploy(
    endpoint_name="content-analysis",
    initial_instance_count=1,
    instance_type="ml.t2.medium",
    # async_inference_config=async_config,
    serializer=JSONSerializer(),
    deserializer=JSONDeserializer(),
)

print(predictor)
