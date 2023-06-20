import os
import json
from pathlib import Path
from time import time
import networkx as nx
import soundfile as sf
import torch
import torchaudio

# subdirectories
data_file = 'ddkg.json'
model_dir = 'models'
audio_dir = 'audio'
backups = 'backup'
export = 'export'


def check_dir(dir):
    if not os.path.exists(dir): os.makedirs(dir, exist_ok=True)
    return dir


class DDKnowledgeGraph():

    def __init__(self, data_path, backend=None, relative=True) -> None:
        self.root = Path(data_path)
        self.backend = backend
        self.G = nx.DiGraph()
        self.project_name = None
        self.load()

    # IO functions
    def load(self):
        check_dir(self.root)

        if os.path.exists(self.root / data_file):
            with open(self.root / data_file, 'r') as df:
                data = json.load(df)
                self.project_name = data['project_name']
                self.export_target = Path(data['export_target'])
                self.G = nx.cytoscape.cytoscape_graph(data['graph'])

    def save(self):
        os.system(f'cp {self.root / data_file} {check_dir(self.root / backups) / data_file}_{int(time())}')
        with open(self.root / data_file, 'w') as df:
            data = {
                'project_name': self.project_name,
                'export_target': str(self.export_target),
                'graph': nx.cytoscape.cytoscape_data(self.G)
            }
            df.write(json.dumps(data, indent=4))

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
        
        # Model already exists
        assert name != '', 'Name should not be empty'
        assert not self.G.has_node(name), f'Model with name {name} already exists'
        
        if copy:
            path_new = check_dir(self.root / model_dir) / Path(path).name
            os.system(f'cp {path} {path_new}')
            path = path_new

        # Create model node
        self.G.add_node(
            name,
            path=str(path.relative_to(self.root)),
            chunk_size=chunk_size,
            sample_rate=sample_rate,
            steps=steps,
            type='model',
            created=int(time())
        )

        # Save on success
        self.save()
        return True

    # Create a node to represent an external source.
    def add_external_source(
            self,
            source_name: str,
            source_root: str,
    ):
        self.G.add_node(
            source_name,
            path=source_root,
            type='external',
            created=int(time())
        )

        self.save()
    
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
                        set_name,
                        alias=set_name,
                        type='set',
                        created=current_time
                    )
                    self.G.add_edge(
                        source_name,
                        set_name,
                        type='import',
                        created=current_time
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
                                parent=set_name
                            )
            
        # TODO: Remove nodes for data that no longer exists
        
        self.save()

    # Manually import an external audio dataset
    def import_audio_set(
            self,
            set_dir: str,
            set_name: str,
            sample_rate: int,
            source_name: str='external',
            copy: bool=False,
            rename: bool=False
    ):
        current_time = int(time())


        # Create set node and edge from source
        sample_prefix = f'{source_name}_{set_name}'
        self.G.add_node(
            set_name,
            alias=set_name,
            type='set',
            created=current_time
        )
        self.G.add_edge(
            source_name,
            set_name,
            type='import',
            created=current_time
        )

        # Iterate through samples
        set_dir_new = check_dir(self.root / audio_dir / source_name / set_name)
        for idx, sample_path in enumerate(set_dir.iterdir()):
            if sample_path.suffix == '.mp3':
                pass # TODO: handle mp3 to wav conversion if necessary
            elif sample_path.suffix == '.wav':
                if copy:
                    if rename:
                        sample_path_new = set_dir_new / sample_path.name
                    else:
                        sample_path_new = set_dir_new / f'{sample_prefix}_{idx + 1}.wav'
                    os.system(f'cp {sample_path} {sample_path_new}')
                    sample_path = sample_path_new
                
                self.G.add_node(
                    sample_path.stem,
                    alias=sample_path.stem,
                    set_index=idx,
                    type='audio',
                    path=str(sample_path),
                    sample_rate=sample_rate,
                    created=current_time,
                    parent=set_name
                )


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

        # Create batch node and edge from model
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
            batch_idx = i + 1
            audio_name = f'sample_{sample_prefix}_{batch_idx}'
            audio_path = batch_dir / f'{audio_name}.wav'
            open(str(audio_path), 'a').close()
            torchaudio.save(str(audio_path), sample.cpu(), sample_rate)

            # Create node
            self.G.add_node(
                audio_name,
                alias=audio_name[-12:],
                batch_index=batch_idx,
                type='audio',
                path=str(audio_path.relative_to(self.root)),
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
    def update_element(
            self,
            name: str,
            attrs: dict
    ):
        nx.function.set_node_attributes(self.G, {name: attrs})
        self.save()

    # Export a single audio file
    def export_single(
            self,
            name: str,
            export_name: str,
    ):
        audio_path = self.root / self.G.nodes[name]['path']
        target_path = check_dir(self.root / export) / f'{export_name}{audio_path.suffix}'
        os.system(f'cp {audio_path} {target_path}')
