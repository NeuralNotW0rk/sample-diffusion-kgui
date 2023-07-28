import React, { useContext } from 'react';
import { Typography, TextField, Button, Stack, ButtonGroup } from '@mui/material';

import { ToolContext } from '../App';

function ImportModel() {
    const { setAwaitingResponse, setPendingRefresh } = useContext(ToolContext);

    function handleSubmit(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();

        // Read the form data
        const form = e.target;
        const formData = new FormData(form);

        setAwaitingResponse(true);
        fetch('/import-model', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                setAwaitingResponse(false);
                setPendingRefresh(true)
                console.log(data.message); // Success message from the server
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
            alignItems='center'
        >
            <Typography variant='h6'>Import Model</Typography>
            <TextField
                name='model_name'
                label='Model name'
                required
            />
            <Button
                variant='contained'
                component='label'
            >
                Upload File
                <input
                    type='file'
                    hidden
                />
            </Button>
            <TextField
                name='model_path'
                label='Model path'
                required
            /*
            InputProps={{
                endAdornment: (
                    <InputAdornment position='end'>
                        <IconButton
                            edge='end'
                            component='label'
                        >
                            <Search />
                            <input
                                type='file'
                                hidden
                                onChange={(e) => {
                                    console.log(e);
                                }}
                            />
                        </IconButton>
                    </InputAdornment>
                )
            }}
            */
            />
            <TextField
                name='chunk_size'
                type='number'
                defaultValue='65536'
                label='Chunk size'
                inputProps={{ min: 1 }}
            />
            <TextField
                name='sample_rate'
                type='number'
                defaultValue='44100'
                label='Sample rate'
                inputProps={{ min: 1 }}
            />
            <TextField
                name='steps'
                type='number'
                defaultValue='0'
                label='Training steps'
                inputProps={{ min: 0 }}
            />
            <ButtonGroup variant='contained' >
                <Button type='reset'>Default</Button>
                <Button type='submit'>Import</Button>
            </ButtonGroup>
        </Stack>
    );
};

export default ImportModel;