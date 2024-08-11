import torch
import torch.nn as nn


class DummyModel(nn.Module):
    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)
        self.layer = nn.Linear(2, 1)

    def forward(self, x) -> torch.Tensor:
        return self.layer(x)


if __name__ == "__main__":
    model_dir = ".."
    model = DummyModel()
    torch.save(model.state_dict(), f"{model_dir}/model.pth")
