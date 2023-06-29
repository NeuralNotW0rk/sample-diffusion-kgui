import React, { useContext } from "react";
import { Typography, TextField, Button, Stack, ButtonGroup } from '@mui/material';
import { ToolContext } from "../App";

function LoadProject() {
    const { setAwaitingResponse, setPendingRefresh, setProjectName, setActiveTool } = useContext(ToolContext);

    function handleSubmit(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();

        // Read the form data
        const form = e.target;
        const formData = new FormData(form);

        setAwaitingResponse(true);
        fetch('/load', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                setAwaitingResponse(false);
                setPendingRefresh(true);
                setProjectName(data.project);
                setActiveTool('default');
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
            <Typography variant="h6">Load/Create Project</Typography>
            <TextField
                name="project_name"
                label="Project name"
                required
            />
            <ButtonGroup variant="contained" >
                <Button type="submit">Load</Button>
            </ButtonGroup>
        </Stack>
    );
};

export default LoadProject;