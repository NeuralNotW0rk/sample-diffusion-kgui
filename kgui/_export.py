import torchaudio

from .util import *


# Export a single audio file
def export_single(
    self,
    name: str,
    export_name: str,
):
    audio_path = self.root / self.G.nodes[name]['path']
    target_path = (
        check_dir(self.root / export) / f'{export_name}{audio_path.suffix}'
    )
    os.system(f'cp "{audio_path}" "{target_path}"')

# Export all audio in a batch (or set)
def export_batch(
    self,
    name: str,
    export_name: str,
    chunk: bool = False,
    chunk_size: int = 65536,
    resample: bool = False,
    sample_rate: int = 44100,
    channels: int = 2,
):
    index = 1
    target_dir = check_dir(self.root / export / f'{export_name}')
    for _, data in self.G.nodes(data=True):
        if data.get('parent') == name:
            audio_path = self.root / data['path']
            if chunk:
                audio, file_sample_rate = torchaudio.load(str(audio_path))
                target_sample_rate = file_sample_rate
                if resample and file_sample_rate != sample_rate:
                    resampler = torchaudio.transforms.Resample(
                        file_sample_rate, sample_rate
                    )
                    audio = resampler(audio)
                    target_sample_rate = sample_rate
                if audio.size(0) < channels:
                    audio = audio.repeat(channels, 1)
                chunks = list(audio.split(chunk_size, 1))
                for audio_chunk in chunks:
                    target_path = target_dir / f'{export_name}_{index}.wav'
                    torchaudio.save(
                        str(target_path), audio_chunk.cpu(), target_sample_rate
                    )
                    index += 1
            else:
                target_path = target_dir / f'{export_name}_{index}.wav'
                os.system(f'cp "{audio_path}" "{target_path}"')
                index += 1
