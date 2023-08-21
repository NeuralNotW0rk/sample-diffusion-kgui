import torch
import numpy as np
import librosa as lr
import networkx as nx

from sklearn.manifold import TSNE

from .util import *


def update_tsne(
    self, n_components=2, perplexity=40, n_iter=300, sample_rate=48000, sample_size=None
):
    if sample_size is None:
        sample_size = sample_rate

    # Gather audio samples
    print('Gathering audio samples for t-SNE calculation...')
    names = []
    samples = []
    for node, data in self.G.nodes(data=True):
        if data['type'] == 'audio':
            names.append(node)

            sample_raw = load_audio(
                'cpu', str(self.root / data['path']), sample_rate=sample_rate
            )
            sample = torch.zeros(sample_size)
            cropped_size = min(sample_size, sample_raw.size(1))
            sample[:cropped_size] += sample_raw[0, :cropped_size]
            samples.append(sample.numpy())

    samples = np.asarray(samples)

    # Handle if number of samples is smaller than perplexity
    perplexity = min(perplexity, len(samples) - 1)

    # Convert to spectrograms
    # TODO: Save spectrograms for reuse
    print('Extracting spectrograms...')
    specs = lr.stft(samples, n_fft=512)
    specs = np.abs(specs)
    specs = np.reshape(specs, newshape=(specs.shape[0], specs.shape[1] * specs.shape[2]))

    # Compute t-SNE
    tsne = TSNE(
        n_components=n_components, verbose=1, perplexity=perplexity, n_iter=n_iter, random_state=0
    )
    tsne_results = tsne.fit_transform(specs)

    # Update nodes
    attrs = {}
    for name, result in zip(names, tsne_results):
        attrs[name] = {f'tsne_{dim + 1}': float(result[dim]) for dim in range(n_components)}
    
    nx.set_node_attributes(self.G, attrs)