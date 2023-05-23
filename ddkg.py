import os
import json
from pathlib import Path

# subdirectories
data_file = 'dd_log.json'
model_dir = 'models'

class DDKnowledgeGraph:

    def __init__(self, data_path, backend=None) -> None:
        self.root = Path(data_path)
        self.backend = backend
        self.copy_all = False
        self.data = {'models': {}}
        self.load()

    def load(self):
        # Check for directories
        if not os.path.exists(self.root): os.mkdir(self.root)
        if not os.path.exists(self.root / model_dir): os.mkdir(self.root / model_dir)

        # Load data json if it exists
        if os.path.exists(self.root / data_file):
            with open(self.root / data_file, 'r') as df:
                self.data = json.load(df)


    def save(self):
        with open(self.root / data_file, 'w') as df:
            df.write(json.dumps(self.data, indent=4))
    
    # Add model to graph
    def import_model(
            self,
            uuid,
            name,
            path,
            chunk_size,
            sample_rate,
            steps,
            copy=False,
            **kwargs
    ) -> bool:
        
        # Model already exists
        if name in self.data['models'].keys(): return False

        if copy:
            path_new = str(self.root / model_dir / Path(path).name)
            os.system(f'cp {path} {path_new}')
            path = path_new

        self.data['models'][uuid] = {
            'name': name,
            'path': path,
            'chunk_size': chunk_size,
            'sample_rate': sample_rate,
            'steps': steps,
            **kwargs
        }
        self.save()

        return True;




