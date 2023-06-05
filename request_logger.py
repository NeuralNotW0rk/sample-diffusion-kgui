from pathlib import Path

from ddkg import DDKnowledgeGraph

from dance_diffusion.api import Request, RequestType, Response
from diffusion_library.sampler import SamplerType
from diffusion_library.scheduler import SchedulerType

class RequestLogger(DDKnowledgeGraph):

    def __init__(self, data_path, backend=None, relative=True) -> None:
        super().__init__(data_path, backend, relative)

    def log_request(self, request: Request, response: Response):
        if request.request_type == RequestType.Generation:
            self.log_generation(
                model_name=request.kwargs['model_name'],
                sample_rate=request.model_sample_rate,
                chunk_size=request.model_chunk_size,
                batch_size=request.kwargs['batch_size'],
                seed=request.kwargs['seed'],
                steps=request.kwargs['steps'],
                scheduler=request.kwargs['scheduler_type_name'],
                sampler=request.kwargs['sampler_type_name'],
                output=response.result
            )