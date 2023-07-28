import React, { useContext, useState } from 'react';
import {
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    ButtonGroup,
    InputAdornment,
    IconButton
} from '@mui/material';
import { Autorenew } from '@mui/icons-material';

import { ToolContext } from '../App';

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

    const [seed, setSeed] = useState(0);
    const [selectedSampler, setSelectedSampler] = useState(defaultSampler);
    const [selectedScheduler, setSelectedScheduler] = useState(defaultScheduler);

    function randomizeSeed() {
        setSeed(Math.floor(Math.random() * 4294967294));
    }

    function handleSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        formData.append('mode', 'Generation');
        formData.append('model_name', toolParams.nodeData.name)
        formData.append('seed', seed);
        formData.append('sampler_type_name', selectedSampler);
        formData.append('scheduler_type_name', selectedScheduler);

        setAwaitingResponse(true);
        setActiveTool('default');
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
        <Stack
            component='form'
            method='post'
            onSubmit={handleSubmit}
            spacing={2}
            alignItems='center'>
            <Typography variant='h6'>Generation</Typography>
            <TextField
                name='model_name'
                value={toolParams.nodeData.name}
                label='Model'
                disabled
            />
            <TextField
                name='chunk_size'
                type='number'
                defaultValue={toolParams.nodeData.chunk_size}
                label='Chunk size'
                inputProps={{ min: 32768, step: 32768 }}
            />
            <TextField
                name='batch_size'
                type='number'
                defaultValue='8'
                label='Batch size'
                inputProps={{ min: 1 }}
            />
            <TextField
                value={seed}
                onChange={(event) => setSeed(event.target.value)}
                type='number'
                label='Seed'
                inputProps={{ min: 0 }}
                InputProps={{
                    endAdornment: <InputAdornment posiion='end'>
                        <IconButton
                            aria-label='randomize'
                            onClick={randomizeSeed}
                            edge='end'
                        >
                            <Autorenew />
                        </IconButton>
                    </InputAdornment>
                }}
            />
            <TextField
                name='steps'
                type='number'
                defaultValue='200'
                label='Step count'
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
            <ButtonGroup variant='contained' >
                <Button type='reset'>Default</Button>
                <Button type='submit'>Generate</Button>
            </ButtonGroup>
        </Stack>
    );
}

export default Generation;