import React, { useContext } from 'react';
import { Typography, Button, Stack, ButtonGroup } from '@mui/material';

import { ToolContext } from '../App';

function RemoveElement() {

    const { toolParams, setActiveTool, setToolParams, setAwaitingResponse, setPendingRefresh } = useContext(ToolContext);

    function handleSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);

        formData.append('name', toolParams.nodeData.name);

        setAwaitingResponse(true);
        fetch('/remove-element', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                setActiveTool('default');
                setToolParams(null);
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
        <Stack
            component='form'
            method='post'
            onSubmit={handleSubmit}
            spacing={2}
            alignItems='center'
        >
            <Typography variant='h6'>Remove Element</Typography>
            <Typography variant='p1'>Are you sure?</Typography>
            <ButtonGroup variant='contained' >
                <Button type='submit'>Remove</Button>
            </ButtonGroup>
        </Stack>
    );
};

export default RemoveElement;