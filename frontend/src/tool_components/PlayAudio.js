import React, { useContext, useEffect, useState } from "react";

import { ToolContext } from "../graph_components/KnowledgeGraph";


function PlayAudio() {
    const { toolParams, setAwaitingResponse } = useContext(ToolContext);
    const audioContext = new AudioContext({ latencyHint: 'playback' })

    useEffect(() => {
        initSound(`http://localhost:5000/audio?name=${toolParams.nodeData.name}`);
    }, [toolParams])

    function initSound(url) {
        fetch(url)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                playSound(audioBuffer)
                //playbackButton.onclick = () => playSound(audioBuffer)
                //playbackButton.disabled = false
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
        </div>
    );
}

/*
function PlayAudio() {
    const { toolParams } = useContext(ToolContext);

    const [audio, setAudio] = useState(null);
    const [playing, setPlaying] = useState(false);

    const toggle = () => setPlaying(!playing);

    useEffect(() => {
        fetch(`http://localhost:5000/audio?path=${toolParams.nodeData.path}`)
            .then(response => response.json())
            .then(data => {
                setAudio(new Audio(data.url))
            })
            .catch(error => {
                console.error('Error fetching audio URL:', error);
            });
    }, [toolParams]);

    useEffect(() => {
        if (audio) {
            playing ? audio.play() : audio.pause();
        };
    }, [playing]);

    useEffect(() => {
        if (audio) {
            audio.addEventListener('ended', () => setPlaying(false));
            return () => {
                audio.removeEventListener('ended', () => setPlaying(false));
            };
        };
    }, []);


    return (
        <div>
            <h2>Play Audio</h2>
            <p>{toolParams.nodeData.path}</p>
            <button onClick={toggle}>{playing ? "Pause" : "Play"}</button>
        </div>
    );
}
*/

export default PlayAudio;