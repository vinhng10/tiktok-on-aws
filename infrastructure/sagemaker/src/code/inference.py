# This is the script that will be used in the inference container
import json
import torch
from train import DummyModel


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


def model_fn(model_dir, context):
    model = DummyModel()
    model.load_state_dict(torch.load(f"{model_dir}/model.pth"))
    model.to(device).eval()
    return model


def input_fn(request_body, request_content_type, context):
    assert request_content_type == "application/json"
    data = json.loads(request_body)["inputs"]
    data = torch.tensor(data, dtype=torch.float32, device=device)
    return data


def predict_fn(input_object, model, context):
    with torch.no_grad():
        prediction = model(input_object)
    return prediction


def output_fn(prediction, response_content_type, context):
    assert response_content_type == "application/json"
    response = prediction.cpu().numpy().tolist()
    return json.dumps(response)
