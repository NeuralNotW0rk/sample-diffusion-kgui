from flask import Flask, request, jsonify, send_file
from flask_cors import CORS

import torch
import os
from pathlib import Path
import networkx as nx

from util.util import load_audio, crop_audio
from util.platform import get_torch_device_type
from dance_diffusion.api import RequestHandler, Request, RequestType, ModelType
from diffusion_library.sampler import SamplerType
from diffusion_library.scheduler import SchedulerType

from request_logger import RequestLogger

DEFAULT_PATH = './data'
DEFAULT_SD_REPO = '../sample-diffusion'

ARG_TYPES = {
    # Model params
    'model_sample_rate': int,
    'model_chunk_size': int,
    'created': int,
    
    # General inference
    'chunk_size': int,
    'batch_size': int,
    'steps': int,
    'seed': int,
}

app = Flask(__name__)
CORS(app)

# Init
device_type_accelerator = get_torch_device_type()
device_accelerator = torch.device(device_type_accelerator)
use_autocast = True  # TODO: Make configurable

request_handler = RequestHandler(device_accelerator, optimize_memory_use=False, use_autocast=True)
ddkg = RequestLogger(DEFAULT_PATH)


# ---------------
#  Data requests
# ---------------

# Sends lists of type names for samplers and schedulers
@app.route('/sd-types', methods=['GET'])
def get_type_names():
    return jsonify({
        'samplers': [e.value for e in SamplerType],
        'schedulers': [e.value for e in SchedulerType]
    })


# Sends the current graph state
@app.route('/graph', methods=['GET'])
def get_graph():
    return jsonify(ddkg.to_json())


@app.route('/audio', methods=['GET'])
def get_audio():
    path = Path(ddkg.G.nodes[request.args.get('name')]['path']).resolve()
    return send_file(str(path))

# -----------------------
#  External data sources
# -----------------------


# Copies a model to the ddkg dir
@app.route('/import-model', methods=['POST'])
def import_model():
    if ddkg.import_model(
        name=request.form['model_name'],
        path=request.form['model_path'],
        chunk_size=request.form['chunk_size'],
        sample_rate=request.form['sample_rate'],
        steps=request.form['steps'],
        copy=True
    ):
        message = 'Model imported successfully'
    else:
        message = f'Model import failed: model id {request.form["name"]} already exists'
    
    return jsonify({'message': message})


# -----------------
#  Model Inference
# -----------------


# Handles basic sample-diffusion requests with minimal interference
@app.route('/sd-request', methods=['POST'])
def handle_sd_request():
    load_input = lambda source: load_audio(device_accelerator, request.form[source], request.form['model']) if source in request.form.keys() else None

    sd_request = Request(
        request_type=RequestType[request.form['mode']],
        model_type=ModelType.DD,

        sampler_type=SamplerType[request.form['sampler_type_name']],
        sampler_args={'use_tqdm': True},

        scheduler_type=SchedulerType[request.form['scheduler_type_name']],
        scheduler_args={
            'sigma_min': 0.1,  # TODO: make configurable
            'sigma_max': 50.0,  # TODO: make configurable
            'rho': 1.0  # TODO: make configurable
        },

        audio_source=load_input('audio_source_path'),
        audio_target=load_input('audio_target_path'),

        **{k : ARG_TYPES[k](v) if k in ARG_TYPES else v for k, v in request.form.items()}
    )

    response = request_handler.process_request(sd_request)
    ddkg.log_request(sd_request, response)
  
    return jsonify({'message': 'success'})


# --------------------
#  Graph Modification
# --------------------


@app.route('/update-element', methods=['POST'])
def update_element():
    ddkg.update_element(
        request.form['name'],
        dict(request.form)
    )
    return jsonify({'message': 'success'})