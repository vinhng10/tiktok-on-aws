# This is the script that will be used in the inference container
import json
import boto3
import torch
import tempfile
from torchvision.io import read_video
from train import DummyModel


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


def model_fn(model_dir, context):
    model = DummyModel()
    model.load_state_dict(torch.load(f"{model_dir}/model.pth"))
    model.to(device).eval()
    return model


def input_fn(request_body, request_content_type, context):
    assert request_content_type == "application/json"
    s3 = boto3.client("s3")
    data = json.loads(request_body)
    data = s3.get_object(Bucket=data["bucket"], Key=data["key"])
    with tempfile.NamedTemporaryFile(delete=False) as tmp_file:
        tmp_file.write(data["Body"].read())
        tmp_file.seek(0)
        data, _, _ = read_video(tmp_file.name, pts_unit="sec", output_format="TCHW")
        data = data.permute(1, 0, 2, 3) / 255.0
        data = data.to(device)
    return data


def predict_fn(input_object, model, context):
    with torch.no_grad():
        prediction = model(input_object).mean()
    return prediction


def output_fn(prediction, response_content_type, context):
    assert response_content_type == "application/json"
    response = prediction.cpu().numpy().tolist()
    return json.dumps(response)
