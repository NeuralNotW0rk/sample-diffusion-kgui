from flask import Flask, request, jsonify
from ddkg import DDKnowledgeGraph
from cli_wrapper import SampleDiffusionCLI

DEFAULT_PATH = './data'
DEFAULT_ENV = 'dd'

api = Flask(__name__)

ddkg = DDKnowledgeGraph(DEFAULT_PATH)
backend = SampleDiffusionCLI(DEFAULT_ENV)

@api.route('/import-model', methods=['POST'])
def import_model():
    if ddkg.import_model(
        uuid=request.form['modelName'],  # just using name as uuid for now
        name=request.form['modelName'],
        path=request.form['modelPath'],
        chunk_size=request.form['chunkSize'],
        sample_rate=request.form['sampleRate'],
        steps=request.form['steps'],
        copy=True
    ):
        message = 'Model imported successfully'
    else:
        message = f'Model import failed: model id {request.form["name"]} already exists'
    
    return jsonify({'message': message})
