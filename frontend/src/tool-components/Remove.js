import React, { useContext, useEffect, useState } from "react";
import { Typography, TextField, Button, Stack, ButtonGroup } from '@mui/material';
import './Tools.css';

import { ToolContext } from "../App";

function Remove() {

    const { toolParams, setAwaitingResponse } = useContext(ToolContext);

    const [exportName, setExportName] = useState('');

    useEffect(() => {
        setExportName(toolParams.nodeData.alias || toolParams.nodeData.name);
    }, [toolParams]);

    function handleSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);

        formData.append('name', toolParams.nodeData.name);

        setAwaitingResponse(true);
        fetch('/remove', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                setAwaitingResponse(false);
                console.log(data.message); // Success message from the server
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
            alignItems="center"
        >
            <Typography variant="h6">Remove</Typography>
            <Typography variant="p1">Are you sure?</Typography>
            <ButtonGroup variant="contained" >
                <Button type="submit">Export</Button>
            </ButtonGroup>
        </Stack>
    );
};

export default Remove;