import os
import json
from pathlib import Path
from time import time
import networkx as nx

from .util import *
from .importer import Importer
from .exporter import Exporter
from .inference import Inference


class DDKnowledgeGraph(Importer, Exporter, Inference):
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
            with open(self.root / data_file, "r") as df:
                data = json.load(df)
                self.project_name = data["project_name"]
                self.export_target = Path(data["export_target"])
                self.G = nx.cytoscape.cytoscape_graph(data["graph"])

    def save(self):
        os.system(
            f'cp "{self.root / data_file}" "{check_dir(self.root / backups) / data_file}_{int(time())}"'
        )
        with open(self.root / data_file, "w") as df:
            data = {
                "project_name": self.project_name,
                "export_target": str(self.export_target),
                "graph": nx.cytoscape.cytoscape_data(self.G),
            }
            df.write(json.dumps(data, indent=4))

    def to_json(self):
        return nx.cytoscape.cytoscape_data(self.G)

    # Simple element attribute update
    def update_element(self, name: str, attrs: dict):
        nx.function.set_node_attributes(self.G, {name: attrs})
        self.save()

    # Slightly less simple batch attribute update
    def update_batch(self, name: str, attrs: dict):
        if "alias" in attrs:
            # Update batch alias
            nx.function.set_node_attributes(self.G, {name: {"alias": attrs["alias"]}})
            if attrs["apply_child_alias"]:
                # Update all children aliases
                for node, data in self.G.nodes(data=True):
                    if data.get("parent") == name:
                        new_alias = f'{attrs["alias"]}_{data["batch_index"]}'
                        self.G.nodes[node]["alias"] = new_alias

        if "tags" in attrs and attrs["tags"] != "":
            # Add tags to child tag lists
            for node, data in self.G.nodes(data=True):
                if data.get("parent") == name:
                    delim = ","
                    new_tags = delim.join(
                        set(data["tags"].split(delim)) | set(attrs["tags"].split(delim))
                    )
                    self.G.nodes[node]["tags"] = new_tags

        self.save()

    # Remove element (and children in the case of batches)
    def remove_element(self, name: str):
        to_remove = [name]
        for node, data in self.G.nodes(data=True):
            if data.get("parent") == name:
                to_remove.append(node)

        self.G.remove_nodes_from(to_remove)
        self.save()
