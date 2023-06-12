import React, { useContext, useState } from "react";
import { Typography, TextField, Button, FormControl, InputLabel, MenuItem, Select, Stack, Box, ButtonGroup } from '@mui/material';
import './Tools.css';

import { ToolContext } from "../graph_components/KnowledgeGraph";

function Variation() {
    const defaultSampler = 'V_IPLMS';
    const defaultScheduler = 'V_CRASH';

    const {
        typeNames,
        modelNames,
        toolParams,
        setAwaitingResponse,
        setPendingRefresh
    } = useContext(ToolContext);
    const [chunkSize, setChunkSize] = useState(toolParams.nodeData.chunk_size || '65536');

    const [selectedModel, setSelectedModel] = useState(modelNames[0]);
    const [selectedSampler, setSelectedSampler] = useState(defaultSampler);
    const [selectedScheduler, setSelectedScheduler] = useState(defaultScheduler);

    function handleSubmit(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();

        // Read the form data
        const form = e.target;
        const formData = new FormData(form);
        formData.append('mode', 'Variation');
        formData.append('audio_source_name', toolParams.nodeData.name)
        formData.append('model_name', selectedModel);
        formData.append('sampler_type_name', selectedSampler);
        formData.append('scheduler_type_name', selectedScheduler);

        setAwaitingResponse(true);
        fetch('/sd-request', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                setAwaitingResponse(false);
                setPendingRefresh(true);
                console.log(data.message); // Success message from the server
            })
            .catch(error => {
                setAwaitingResponse(false);
                console.error('Error:', error);
            });
    };


    return (
        <Box>
            <Typography variant="h3">Variation</Typography>
            <Stack
                component="form"
                method="post"
                onSubmit={handleSubmit}
                spacing={2}
                alignItems="center"
            >
                <Typography variant="body1">Audio Source: {toolParams.nodeData.name}</Typography>
                <Typography variant="body1">Sample rate: {toolParams.nodeData.sample_rate}</Typography>
                <FormControl>
                    <InputLabel>Model</InputLabel>
                    <Select
                        value={selectedModel}
                        onChange={event => setSelectedModel(event.target.value)}
                    >
                        {modelNames.map(option => (
                            <MenuItem value={option}>{option}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    name="chunk_size"
                    type="number"
                    value={chunkSize}
                    onChange={(e) => setChunkSize(e.target.value)}
                    label="Chunk size"
                    inputProps={{ min: 32768, step: 32768 }}
                />
                <TextField
                    name="batch_size"
                    type="number"
                    defaultValue="1"
                    label="Batch size"
                    inputProps={{ min: 1 }}
                />
                <TextField
                    name="seed"
                    type="number"
                    defaultValue="0"
                    label="Seed"
                    inputProps={{ min: 0 }}
                />
                <TextField
                    name="steps"
                    type="number"
                    defaultValue="50"
                    label="Step count"
                    inputProps={{ min: 1 }}
                />
                <TextField
                    name="noise_level"
                    type="number"
                    defaultValue="0.7"
                    label="Noise level"
                    inputProps={{ min: 0.0, max: 1.0, step: 0.1 }}
                />
                <FormControl>
                    <InputLabel>Sampler</InputLabel>
                    <Select
                        value={selectedSampler}
                        onChange={event => setSelectedSampler(event.target.value)}
                    >
                        {typeNames.samplers.map(option => (
                            <MenuItem value={option}>{option}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl>
                    <InputLabel>Scheduler</InputLabel>
                    <Select
                        value={selectedScheduler}
                        onChange={event => setSelectedScheduler(event.target.value)}
                    >
                        {typeNames.schedulers.map(option => (
                            <MenuItem value={option}>{option}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <ButtonGroup variant="contained" >
                    <Button type="reset" variant="contained">Clear</Button>
                    <Button type="submit" variant="contained">Generate</Button>
                </ButtonGroup>
            </Stack>
        </Box>
    );
}

export default Variation;