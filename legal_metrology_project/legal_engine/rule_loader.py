import json


class RuleLoader:
    """
    Loads legal rules from a JSON file.
    """

    def __init__(self, file_path: str):
        self.file_path = file_path

    def load(self) -> dict:
        with open(self.file_path, "r", encoding="utf-8") as file:
            return json.load(file)
