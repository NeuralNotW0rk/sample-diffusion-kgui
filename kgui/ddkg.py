import os
import json

from pathlib import Path
from time import time

import networkx as nx

from .util import *

DEFAULT_SR = 48000

class DDKnowledgeGraph:
    def __init__(self, data_path, backend=None, relative=True) -> None:
        self.root = Path(data_path)
        self.export_target = export
        self.backend = backend
        self.G = nx.DiGraph()
        self.project_name = None
        self.load()

    # Split functions into different files for readability
    from ._import import (
        import_model,
        add_external_source,
        scan_dir,
        scan_external_source,
        import_audio_set,
    )
    from ._export import export_single, export_batch
    from ._inference import log_inference
    from ._cluster import update_tsne

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
        os.system(
            f'cp "{self.root / data_file}" "{check_dir(self.root / backups) / data_file}_{int(time())}"'
        )
        with open(self.root / data_file, 'w') as df:
            data = {
                'project_name': self.project_name,
                'export_target': str(self.export_target),
                'graph': nx.cytoscape.cytoscape_data(self.G),
            }
            df.write(json.dumps(data, indent=4))

    def to_json(self, mode='batch'):
        if mode == 'batch':
            return nx.cytoscape.cytoscape_data(self.G)
        elif mode == 'cluster':
            C = nx.DiGraph()
            for node, data in self.G.nodes(data=True):
                if data['type'] == 'audio':
                    C.add_node(node, **data)
                    C.nodes[node].pop('parent')
            return nx.cytoscape.cytoscape_data(C)

    # Simple element attribute update
    def update_element(self, name: str, attrs: dict):
        nx.function.set_node_attributes(self.G, {name: attrs})

    # Slightly less simple batch attribute update
    def update_batch(self, name: str, attrs: dict):
        if 'alias' in attrs:
            # Update batch alias
            nx.function.set_node_attributes(self.G, {name: {'alias': attrs['alias']}})
            if attrs['apply_child_alias']:
                # Update all children aliases
                for node, data in self.G.nodes(data=True):
                    if data.get('parent') == name:
                        new_alias = f'{attrs["alias"]}_{data["batch_index"]}'
                        self.G.nodes[node]['alias'] = new_alias

        if 'tags' in attrs and attrs['tags'] != '':
            # Add tags to child tag lists
            for node, data in self.G.nodes(data=True):
                if data.get('parent') == name:
                    delim = ','
                    new_tags = delim.join(
                        set(data['tags'].split(delim)) | set(attrs['tags'].split(delim))
                    )
                    self.G.nodes[node]['tags'] = new_tags

    # Remove element (and children in the case of batches)
    def remove_element(self, name: str):
        to_remove = [name]
        for node, data in self.G.nodes(data=True):
            if data.get('parent') == name:
                to_remove.append(node)

        self.G.remove_nodes_from(to_remove)