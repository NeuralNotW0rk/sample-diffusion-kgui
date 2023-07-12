import React, { useContext } from "react";
import { Stack, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import './Tools.css';

import { ToolContext } from "../App";

function ViewDetails() {
    const { toolParams } = useContext(ToolContext);

    return (
        <Stack
            spacing={2}
            alignItems="center"
        >
            <Typography variant="h6">Details</Typography>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableBody>
                        {Object.entries(toolParams.nodeData).map(([key, value]) => (
                            <TableRow
                                key={key}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {key}
                                </TableCell>
                                <TableCell align="left">{String(value)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>

    );
}

export default ViewDetails;