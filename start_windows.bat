set SAMPLE_DIFFUSION_ENV="dd"

:: Activate conda environment and start up backend server
start cmd /c "call activate %SAMPLE_DIFFUSION_ENV% && flask run"

:: Start the frontend server
start cmd /c "cd frontend && npm run start"