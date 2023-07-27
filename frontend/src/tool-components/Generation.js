import React, { useContext, useState } from "react";
import { Typography, TextField, Button, FormControl, InputLabel, MenuItem, Select, Stack, ButtonGroup } from '@mui/material';
import './Tools.css';

import { ToolContext } from "../App";

function Generation() {
    const defaultSampler = 'V_IPLMS';
    const defaultScheduler = 'V_CRASH';

    const {
        typeNames,
        toolParams,
        setActiveTool,
        setAwaitingResponse,
        setPendingRefresh
    } = useContext(ToolContext);

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
                setActiveTool('default');
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
        <Stack
            component="form"
            method="post"
            onSubmit={handleSubmit}
            spacing={2}
            alignItems="center">
            <Typography variant="h6">Generation</Typography>
            <TextField
                name="model_name"
                value={toolParams.nodeData.name}
                label="Model"
                disabled
            />
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
                <Button type="reset">Default</Button>
                <Button type="submit">Generate</Button>
            </ButtonGroup>
        </Stack>
    );
}

export default Generation;