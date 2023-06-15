import React, { useContext, useEffect } from "react";
import { Stack, Typography, Button, ButtonGroup } from "@mui/material";
import './Tools.css';

import { ToolContext } from "../App";


function PlayAudio() {
    const { toolParams } = useContext(ToolContext);
    
    const audioContext = new AudioContext({ latencyHint: 'playback' })

    useEffect(() => {
        initSound();
    }, [toolParams])

    function initSound() {
        const url = `/audio?name=${toolParams.nodeData.name}`;
        fetch(url)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                playSound(audioBuffer)
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function playSound(audioBuffer) {
        const bufferSource = audioContext.createBufferSource();
        bufferSource.buffer = audioBuffer;
        bufferSource.connect(audioContext.destination);
        bufferSource.start(0);
    }

    return (
        <Stack
            spacing={2}
            alignItems="center"
        >
            <Typography variant="h6">Play Audio</Typography>
            <Typography variant="body1">{toolParams.nodeData.alias}</Typography>
            <ButtonGroup variant="contained" >
                <Button onClick={initSound}>Replay</Button>
            </ButtonGroup>
        </Stack>
    );
}

export default PlayAudio;