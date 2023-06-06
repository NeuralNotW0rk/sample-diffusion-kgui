import os
import json
import enum
from pathlib import Path
from time import time
import networkx as nx
import torch
import torchaudio

# subdirectories
data_file = 'ddkg.json'
model_dir = 'models'
audio_dir = 'audio'
backups = 'backup'


def check_dir(dir):
    if not os.path.exists(dir): os.makedirs(dir, exist_ok=True)
    return dir


class DDKnowledgeGraph():

    def __init__(self, data_path, backend=None, relative=True) -> None:
        self.root = Path(data_path)
        self.backend = backend
        self.G = nx.DiGraph()
        self.load()

    # IO functions
    def load(self):
        check_dir(self.root)

        if os.path.exists(self.root / data_file):
            with open(self.root / data_file, 'r') as df:
                self.G = nx.cytoscape.cytoscape_graph(json.load(df))

    def save(self):
        os.system(f'cp {self.root / data_file} {check_dir(self.root / backups) / data_file}_{int(time())}')
        with open(self.root / data_file, 'w') as df:
            df.write(json.dumps(nx.cytoscape.cytoscape_data(self.G), indent=4))

    def to_json(self):
        return nx.cytoscape.cytoscape_data(self.G)
    
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
        
        if copy:
            path_new = check_dir(self.root / model_dir) / Path(path).name
            os.system(f'cp {path} {path_new}')
            path = path_new

        # Model already exists
        if name in nx.nodes(self.G): return False

        # Create model node
        self.G.add_node(
            name,
            type='model',
            path=str(path),
            chunk_size=chunk_size,
            sample_rate=sample_rate,
            steps=steps,
            created=int(time())
        )

        # Save on success
        self.save()
        return True

    # Basic inference
    def log_inference(
            self,
            mode: str,
            model_name: str,
            sample_rate: int,
            chunk_size: int,
            batch_size: int,
            seed: int,
            steps: int,
            sampler_type_name: str,
            scheduler_type_name: str,
            output: torch.Tensor,
            audio_source_name: str=None,
            noise_level: float=0.0,
            **kwargs
    ) -> bool:
        
        mode = mode.lower()
        current_time = int(time())

        # Create batch node and main edge
        sample_prefix = f'{model_name}_{seed}_{current_time}'
        batch_name = f'batch_{sample_prefix}'
        self.G.add_node(
            batch_name,
            alias=batch_name[-10:],
            type='batch',
            created=current_time
        )
        self.G.add_edge(
            model_name,
            batch_name,
            type=f'dd_{mode}',
            model_name=model_name,
            chunk_size=chunk_size,
            batch_size=batch_size,
            seed=seed,
            steps=steps,
            sampler=sampler_type_name,
            scheduler=scheduler_type_name,
            created=current_time
        )

        # Variation case
        if mode == 'variation':
            self.G.edges[model_name, batch_name]['noise_level'] = noise_level
            self.G.add_edge(
                audio_source_name,
                batch_name,
                type='audio_source'
            )
            
        # Create individual samples
        batch_dir = check_dir(self.root / audio_dir / mode / model_name)
        for i, sample in enumerate(output):
            # Save audio
            audio_name = f'sample_{sample_prefix}_{i + 1}'
            audio_path = batch_dir / f'{audio_name}.wav'
            open(str(audio_path), 'a').close()
            torchaudio.save(str(audio_path), sample.cpu(), sample_rate)

            # Create node
            self.G.add_node(
                audio_name,
                alias=audio_name[-12:],
                type='audio',
                path=str(audio_path),
                sample_rate=sample_rate,
                chunk_size=chunk_size,
                created=current_time,
                parent=batch_name
            )
            '''
            self.G.add_edge(
                audio_name,
                batch_name,
                type='batch_split',
                created=current_time
            )
            '''
        
        # Save on success
        self.save()
        return True

    # Simple element attribute update
    def update_node(
            self,
            name: str,
            attrs: dict
    ):
        nx.function.set_node_attributes(self.G, {name: attrs})
        self.save()
