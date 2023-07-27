import os

# subdirectories
data_file = "ddkg.json"
model_dir = "models"
audio_dir = "audio"
backups = "backup"
export = "export"


def check_dir(dir):
    if not os.path.exists(dir):
        os.makedirs(dir, exist_ok=True)
    return dir
