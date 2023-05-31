import os
import json
import enum
from pathlib import Path
from time import time
import networkx as nx
import torchaudio

# subdirectories
data_file = 'ddkg.json'
model_dir = 'models'
audio_dir = 'audio'
gen_dir = 'generate'

# TODO: Import from sample_diffusion maybe
class RequestType(str, enum.Enum):
    Generation = 'Generation'
    Variation = 'Variation'
    Interpolation = 'Interpolation'
    Inpainting = 'Inpainting'
    Extension = 'Extension'

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
        with open(self.root / data_file, 'w') as df:
            df.write(json.dumps(nx.cytoscape.cytoscape_data(self.G), indent=4))

    def to_json(self):
        return nx.cytoscape.cytoscape_data(self.G)
    
    # Add model to graph
    def import_model(
            self,
            name,
            path,
            chunk_size,
            sample_rate,
            steps,
            copy=False,
            **kwargs
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

    # Log generation
    def log_gen(
            self,
            model_name,
            sample_rate,
            chunk_size,
            batch_size,
            seed,
            steps,
            scheduler,
            sampler,
            output,
            **kwargs
    ) -> bool:
        
        # Create batch node and main edge
        current_time = int(time())
        sample_prefix = f'{model_name}_{seed}_{current_time}'
        batch_name = f'batch_{sample_prefix}'
        self.G.add_node(
            batch_name,
            type='batch',
            created=current_time
        )
        self.G.add_edge(
            model_name,
            batch_name,
            type='dd_generate',
            model_name=model_name,
            chunk_size=chunk_size,
            batch_size=batch_size,
            seed=seed,
            steps=steps,
            sampler=sampler,
            scheduler=scheduler,
            created=current_time
        )
        batch_dir = check_dir(self.root / audio_dir / gen_dir / model_name)

        # Create individual samples
        for i, sample in enumerate(output):
            # Save audio
            audio_name = f'sample_{sample_prefix}_{i + 1}'
            audio_path = batch_dir / f'{audio_name}.wav'
            open(str(audio_path), 'a').close()
            torchaudio.save(str(audio_path), sample.cpu(), sample_rate)

            # Create node
            self.G.add_node(
                audio_name,
                type='audio',
                path=str(audio_path),
                sample_rate=sample_rate,
                created=time()
            )
            self.G.add_edge(
                audio_name,
                batch_name,
                type='batch_split',
                created=time()
            )
        
        # Save on success
        self.save()
        return True
