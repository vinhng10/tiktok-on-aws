# This is the script that will be used in the inference container
import json
import torch
from train import DummyModel

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


def model_fn(model_dir):
    model = DummyModel()
    model.load_state_dict(torch.load(f"{model_dir}/model.pth"))
    model.to(device).eval()
    return model


def predict_fn(input_data, model):
    url = input_data.pop("contentUrl")
    predictions = model()
    return predictions


def input_fn(request_body, request_content_type):
    assert request_content_type == "application/json"
    return json.loads(request_body)


def output_fn(prediction, accept):
    assert accept == "application/json"
    return json.dumps({"prediction": "Test results"})


model = model_fn("infrastructure/sagemaker/src/export")
input = input_fn('{"contentUrl": "s3://data-path"}', "application/json")
prediction = predict_fn(input, model)
output = output_fn(prediction, "application/json")
print(output)
