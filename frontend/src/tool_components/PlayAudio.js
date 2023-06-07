import React, { useContext, useEffect, useState } from "react";
import './Tools.css';

import { ToolContext } from "../graph_components/KnowledgeGraph";


function PlayAudio() {
    const { toolParams, setAwaitingResponse } = useContext(ToolContext);
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
        <div>
            <h2>Play Audio</h2>
            <p>{toolParams.nodeData.alias}</p>
            <p>{toolParams.nodeData.name}.wav</p>
            <button onClick={initSound}>Replay</button>
        </div>
    );
}

export default PlayAudio;