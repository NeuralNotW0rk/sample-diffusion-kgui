import React, { useContext } from "react";
import { Typography, TextField, Stack, Autocomplete } from '@mui/material';
import { Search } from '@mui/icons-material';
import './Tools.css';

import { ToolContext } from "../App";

function SearchAndFilter() {
    const { nodeNames } = useContext(ToolContext);

    return (
        <Stack
            spacing={2}
            alignItems="center"
        >
            <Typography variant="h6">Search / Filter</Typography>
            <Autocomplete
              freeSolo
              disableClearable
              fullWidth
              options={nodeNames ? nodeNames.audio : []}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label='Search audio'
                  InputProps={{
                    ...params.InputProps,
                    type: 'search',
                  }}
                />
              )}
            />
        </Stack>
    );
};

export default SearchAndFilter;