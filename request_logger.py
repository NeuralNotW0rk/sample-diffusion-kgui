from pathlib import Path

from ddkg import DDKnowledgeGraph

from dance_diffusion.api import Request, RequestType, ModelType
from diffusion_library.sampler import SamplerType
from diffusion_library.scheduler import SchedulerType

class RequestLogger(DDKnowledgeGraph):

    def __init__(self, data_path, backend=None, relative=True) -> None:
        super().__init__(data_path, backend, relative)

    def log_request(self, request: Request, outputs):
        if request.request_type == RequestType.Generation:
            self.log_gen(
                sample_dir=None,  # TODO
                sample_prefix=None,  # TODO
                copy=False,
                **(request.kwargs)
            )