import os
import json

class DDLog:

    def __init__(self, data_path) -> None:
        self.data_path = data_path

        self.data = {}
        if os.path.exists(f'{data_path}/dd_log.json'):
            with open(f'{data_path}/dd_log.json') as file:
                self.data = json.load(file)