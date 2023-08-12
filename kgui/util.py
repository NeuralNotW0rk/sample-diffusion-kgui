import os
import torchaudio

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

def load_audio(device, audio_path: str, sample_rate):
    
    if not os.path.exists(audio_path):
        raise RuntimeError(f"Audio file not found: {audio_path}")

    audio, file_sample_rate = torchaudio.load(audio_path)

    if file_sample_rate != sample_rate:
        resample = torchaudio.transforms.Resample(file_sample_rate, sample_rate)
        audio = resample(audio)

    return audio.to(device)