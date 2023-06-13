import React, { useContext, useEffect, useState } from "react";
import { Typography, TextField, Button, Stack, ButtonGroup, Autocomplete, Chip } from '@mui/material';
import './Tools.css';

import { ToolContext } from "../App";

function UpdateAttributes() {

    const { toolParams, tagList, setAwaitingResponse, setPendingRefresh } = useContext(ToolContext);

    const [alias, setAlias] = useState('');
    const [caption, setCaption] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [tagOptions, setTagOptions] = useState([]);

    useEffect(() => {
        setAlias(toolParams.nodeData.alias || '');
        setCaption(toolParams.nodeData.caption || '');
        setSelectedTags([]);
        toolParams.nodeData.tags && setSelectedTags(toolParams.nodeData.tags.split(','));
        setTagOptions(tagList.map((option) => {
            return option.tag;
        }));
    }, [toolParams]);

    function handleSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);

        formData.append('name', toolParams.nodeData.name)
        formData.append('tags', selectedTags);

        formData.get('alias') === '' && formData.delete('alias');
        formData.get('caption') === '' && formData.delete('caption');
        
        setAwaitingResponse(true);
        fetch('/update-element', {
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
        <Stack
            component="form"
            method="post"
            onSubmit={handleSubmit}
            spacing={2}
            alignItems="center"
        >
            <Typography variant="h6">Update Attributes</Typography>
            <TextField
                name="name"
                value={toolParams.nodeData.name}
                label="Sample name"
                disabled
            />
            <TextField
                name="alias"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                label="Alias"
            />
            <Autocomplete
                fullWidth
                multiple
                freeSolo
                options={tagOptions}
                value={selectedTags}
                onChange={(e, value) => {
                    setSelectedTags(value);
                }}
                renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                    ))
                }
                renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tags"
                    />
                  )}

            />
            <TextField
                name="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                label="Caption"
            />
            <ButtonGroup variant="contained" >
                <Button type="reset">Default</Button>
                <Button type="submit">Update</Button>
            </ButtonGroup>
        </Stack>
    );
};

export default UpdateAttributes;