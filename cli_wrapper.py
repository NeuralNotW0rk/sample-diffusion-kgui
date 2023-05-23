import os
import subprocess

class SampleDiffusionCLI():

    def __init__(self, conda_env) -> None:
        self.conda_env = conda_env
    
    