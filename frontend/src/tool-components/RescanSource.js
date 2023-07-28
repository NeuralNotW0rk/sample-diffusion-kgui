import React, { useContext } from 'react';
import { Typography, Button, Stack, ButtonGroup } from '@mui/material';

import { ToolContext } from '../App';

function RescanSource() {

    const { toolParams, setAwaitingResponse, setPendingRefresh } = useContext(ToolContext);

    function rescan() {
        setAwaitingResponse(true);
        fetch(`/rescan-source?name=${toolParams.nodeData.name}`, {
            method: 'POST'
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
        <Stack
            spacing={2}
            alignItems='center'
        >
            <Typography variant='h6'>Rescan External Source</Typography>
            <Typography variant='p1'>
                This will rescan the file structure of the specified external source.
                Any new audio files will be added to existing sets, and any new subdirectories will be added as new sets.
            </Typography>
            <ButtonGroup variant='contained' >
                <Button onClick={rescan}>Rescan</Button>
            </ButtonGroup>
        </Stack>
    );
};

export default RescanSource;