import React, { useContext, useState } from "react";
import { Typography, TextField, Button, FormControl, InputLabel, MenuItem, Select, Stack, Box, ButtonGroup } from '@mui/material';
import './Tools.css';

import { ToolContext } from "../graph_components/KnowledgeGraph";

function Generation() {
    const defaultSampler = 'V_IPLMS';
    const defaultScheduler = 'V_CRASH';

    const { typeNames, toolParams, setAwaitingResponse, setPendingRefresh } = useContext(ToolContext);

    const [selectedSampler, setSelectedSampler] = useState(defaultSampler);
    const [selectedScheduler, setSelectedScheduler] = useState(defaultScheduler);

    function handleSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        formData.append('mode', 'Generation');
        formData.append('model_name', toolParams.nodeData.name)
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
                console.log(data.message);
            })
            .catch(error => {
                setAwaitingResponse(false);
                console.error('Error:', error);
            });
    };

    return (
        <Box>
            <Typography variant="h3">Generation</Typography>
            <Stack
            component="form"
            method="post"
            onSubmit={handleSubmit}
            spacing={2}
            alignItems="center">
                <Typography variant="body1">Model: {toolParams.nodeData.name}</Typography>
                <TextField
                    name="chunk_size"
                    type="number"
                    defaultValue={toolParams.nodeData.chunk_size}
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

export default Generation;