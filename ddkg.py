import os
import json
from pathlib import Path
from datetime import datetime
from time import time
import networkx as nx

# subdirectories
data_file = 'ddkg.json'
model_dir = 'models'


class DDKnowledgeGraph():

    def __init__(self, data_path, backend=None) -> None:
        self.root = Path(data_path)
        self.backend = backend
        self.G = nx.DiGraph()
        self.load()

    def load(self):
        # Check for directories
        if not os.path.exists(self.root): os.mkdir(self.root)
        if not os.path.exists(self.root / model_dir): os.mkdir(self.root / model_dir)

        # Load data json if it exists
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
            path_new = str(self.root / model_dir / Path(path).name)
            os.system(f'cp {path} {path_new}')
            path = path_new

        # Model already exists
        if name in nx.nodes(self.G): return False

        self.G.add_node(
            name,
            type='model',
            path=path,
            chunk_size=chunk_size,
            sample_rate=sample_rate,
            steps=steps
        )
        self.save()

        return True;




