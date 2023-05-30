import os
import json
import enum
from pathlib import Path
from time import time
import networkx as nx

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
            path=path,
            chunk_size=chunk_size,
            sample_rate=sample_rate,
            steps=steps,
            created=time()
        )

        # Save on success
        self.save()
        return True

    # Log generation
    def log_gen(
            self,
            sample_dir,
            sample_prefix,
            model_name,
            chunk_size,
            batch_size,
            seed,
            steps,
            scheduler,
            sampler,
            copy=False,
            **kwargs
    ) -> bool:
        
        # Create batch node and main edge
        batch_name = f'batch_{sample_prefix}'
        self.G.add_node(
            batch_name,
            type='batch',
            created=time()
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
            created=time()
        )

        # Create individual audio nodes
        for i in range(batch_size):
            audio_file = f'{sample_prefix}_{i + 1}.wav'
            audio_path = Path(sample_dir) / audio_file
            if copy:
                audio_path_new = check_dir(self.root / audio_dir / gen_dir / model_name) / audio_file
                os.system(f'cp {audio_path} {audio_path_new}')
                audio_path = audio_path_new

            self.G.add_node(
                audio_path.stem,
                type='audio',
                path=audio_path,
                created=time()
            )
            self.G.add_edge(
                audio_path.stem,
                batch_name,
                type='batch_split',
                created=time()
            )
        
        # Save on success
        self.save()
        return True
