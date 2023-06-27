import React, { useContext, useEffect, useState } from "react";
import { Typography, TextField, Button, Stack, ButtonGroup, Autocomplete, Chip, Rating, Box, styled, Checkbox, FormControlLabel } from '@mui/material';
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import './Tools.css';

import { ToolContext } from "../App";


const StyledRating = styled(Rating)(({ theme }) => ({
    '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
        color: theme.palette.action.disabled,
    },
}));

const customIcons = {
    1: {
        icon: <Favorite style={{ color: '#002254' }} />,
        label: 'Unuseable',
    },
    2: {
        icon: <Favorite style={{ color: '#004294' }} />,
        label: 'Barely useable',
    },
    3: {
        icon: <Favorite style={{ color: '#5b3285' }} />,
        label: 'Works',
    },
    4: {
        icon: <Favorite style={{ color: '#7e1b6a' }} />,
        label: 'Works well',
    },
    5: {
        icon: <Favorite style={{ color: '#8f004a' }} />,
        label: 'Favorite',
    },
};

function IconContainer(props) {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value].icon}</span>;
}


function BatchUpdateAttributes() {

    const { toolParams, tagList, setAwaitingResponse, setPendingRefresh } = useContext(ToolContext);

    const [rating, setRating] = useState(2);
    const [hoverRating, setHoverRating] = useState(-1);

    const [alias, setAlias] = useState('');
    const [applyChildAlias, setApplyChildAlias] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);
    const [tagOptions, setTagOptions] = useState([]);

    useEffect(() => {
        setAlias(toolParams.nodeData.alias || '');
        setApplyChildAlias(false);
        setRating(toolParams.nodeData.rating || null);
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

        formData.append('name', toolParams.nodeData.name);
        formData.append('apply_child_alias', applyChildAlias);
        formData.append('tags', selectedTags);
        formData.append('rating', rating);
        
        formData.get('alias') === '' && formData.delete('alias');
        formData.get('caption') === '' && formData.delete('caption');

        setAwaitingResponse(true);
        fetch('/update-batch', {
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
            <Typography variant="h6">Update Batch Attributes</Typography>
            <TextField
                name="name"
                value={toolParams.nodeData.name}
                label="Batch name"
                disabled
            />
            <TextField
                name="alias"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                label="Alias"
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={applyChildAlias}
                        onChange={(e) => setApplyChildAlias(e.target.checked)}
                        defaultChecked={false}
                    />
                }
                label="Apply alias to children"
            />
            <Box sx={{ ml: 2 }}>{customIcons[hoverRating !== -1 ? hoverRating : rating] ? customIcons[hoverRating !== -1 ? hoverRating : rating].label : null}</Box>
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
            <ButtonGroup variant="contained" >
                <Button type="reset">Default</Button>
                <Button type="submit">Update</Button>
            </ButtonGroup>
        </Stack>
    );
};

export default BatchUpdateAttributes;