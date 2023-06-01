import React, { useContext, useEffect, useState } from "react";

import { ToolContext } from "../graph_components/KnowledgeGraph";


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

export default PlayAudio;