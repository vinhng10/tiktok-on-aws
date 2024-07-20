import torch
import torch.nn as nn


class DummyModel(nn.Module):
    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)

    def forward(self) -> torch.Tensor:
        return torch.zeros(1)


if __name__ == "__main__":
    model_dir = ".."
    model = DummyModel()
    torch.save(model.state_dict(), f"{model_dir}/model.pth")
