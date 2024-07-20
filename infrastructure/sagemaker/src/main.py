import json
import tarfile
import boto3
import sagemaker
from sagemaker.pytorch.model import PyTorchModel
from sagemaker.async_inference import AsyncInferenceConfig
from sagemaker.predictor_async import AsyncPredictor
from sagemaker.predictor import Predictor


# Create S3 SageMaker bucket:
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
model_dir = "export"
with tarfile.open("model.tar.gz", "w:gz") as tar:
    tar.add(model_dir)
model_url = sagemaker.Session(default_bucket="tiktok-clone-sagemaker").upload_data(
    path="model.tar.gz",
    bucket="tiktok-clone-sagemaker",
    key_prefix="content-analysis/models",
)
# model_url = "s3://tiktok-clone-sagemaker/content-analysis/models/model.tar.gz"

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
    framework_version="2.3",
    py_version="py311",
    sagemaker_session=sagemaker.Session(default_bucket="tiktok-clone-sagemaker"),
)
predictor = model.deploy(
    endpoint_name="content-analysis",
    initial_instance_count=1,
    instance_type="ml.m5.xlarge",
    async_inference_config=async_config,
)

print(
    predictor.predict_async(
        data=json.dumps({"contentUrl": "s3://tiktok-clone-storage"}),
        initial_args={"InvocationTimeoutSeconds": 300},
    )
)
