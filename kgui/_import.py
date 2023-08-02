import os
from pathlib import Path
from time import time
import soundfile as sf

from .util import *


# Add model to graph
def import_model(
    self,
    name: str,
    path: str,
    chunk_size: int,
    sample_rate: int,
    steps: int,
    copy=False,
) -> bool:
    # Model already exists
    assert name != '', 'Name should not be empty'
    assert not self.G.has_node(name), f'Model with name {name} already exists'

    if copy:
        path_new = check_dir(self.root / model_dir) / Path(path).name
        os.system(f'cp "{path}" "{path_new}"')
        path = path_new

    # Create model node
    self.G.add_node(
        name,
        path=str(path.relative_to(self.root)),
        chunk_size=chunk_size,
        sample_rate=sample_rate,
        steps=steps,
        type='model',
        created=int(time()),
    )

    return True


# Create a node to represent an external source.
def add_external_source(
    self,
    source_name: str,
    source_root: str,
):
    self.G.add_node(source_name, path=source_root, type='external', created=int(time()))


# Scan external source
def scan_external_source(
    self,
    source_name: str,
):
    current_time = int(time())
    source_root = Path(self.G.nodes[source_name]['path'])

    # Add/update audio sets
    for audio_set_dir in source_root.iterdir():
        if audio_set_dir.is_dir():
            set_name = audio_set_dir.name
            if not self.G.has_node(audio_set_dir.name):
                self.G.add_node(
                    set_name, alias=set_name, type='set', created=current_time
                )
                self.G.add_edge(
                    source_name, set_name, type='import', created=current_time
                )

            # Add/update individual audio samples
            for idx, sample_path in enumerate(audio_set_dir.iterdir()):
                if not self.G.has_node(sample_path.name):
                    if sample_path.suffix in ['.wav', '.mp3']:
                        _, sample_rate = sf.read(str(sample_path))
                        self.G.add_node(
                            sample_path.stem,
                            alias=sample_path.stem,
                            set_index=idx,
                            type='audio',
                            path=str(sample_path),
                            sample_rate=sample_rate,
                            created=current_time,
                            parent=set_name,
                        )

    # TODO: Remove nodes for data that no longer exists


# Manually import an external audio dataset
def import_audio_set(
    self,
    set_dir: str,
    set_name: str,
    sample_rate: int,
    source_name: str = 'external',
    copy: bool = False,
    rename: bool = False,
):
    current_time = int(time())

    # Create set node and edge from source
    sample_prefix = f'{source_name}_{set_name}'
    self.G.add_node(set_name, alias=set_name, type='set', created=current_time)
    self.G.add_edge(source_name, set_name, type='import', created=current_time)

    # Iterate through samples
    set_dir_new = check_dir(self.root / audio_dir / source_name / set_name)
    for idx, sample_path in enumerate(set_dir.iterdir()):
        if sample_path.suffix == '.mp3':
            pass  # TODO: handle mp3 to wav conversion if necessary
        elif sample_path.suffix == '.wav':
            if copy:
                if rename:
                    sample_path_new = set_dir_new / sample_path.name
                else:
                    sample_path_new = set_dir_new / f'{sample_prefix}_{idx + 1}.wav'
                os.system(f'cp "{sample_path}" "{sample_path_new}"')
                sample_path = sample_path_new

            self.G.add_node(
                sample_path.stem,
                alias=sample_path.stem,
                set_index=idx,
                type='audio',
                path=str(sample_path),
                sample_rate=sample_rate,
                created=current_time,
                parent=set_name,
            )
