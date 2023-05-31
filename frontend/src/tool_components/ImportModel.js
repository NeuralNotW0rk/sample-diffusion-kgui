import React, { useContext } from "react";

import { ToolContext } from "../graph_components/KnowledgeGraph";

function ImportModel() {

    const { setAwaitingResponse } = useContext(ToolContext);

    function handleSubmit(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();

        // Read the form data
        const form = e.target;
        const formData = new FormData(form);

        setAwaitingResponse(true);
        fetch('http://localhost:5000/import-model', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                console.log(data.message); // Success message from the server
                setAwaitingResponse(false);
            })
            .catch(error => {
                console.error('Error:', error);
                setAwaitingResponse(false);
            });

    };

    return (
        <div>
            <h2> Import Model </h2>
            <form method="post" onSubmit={handleSubmit}>
                <label>
                    Model name:
                    <input name="model_name" defaultValue="" />
                </label>
                <hr />
                <label>
                    Model path:
                    <input name="model_path" defaultValue="" />
                </label>
                <hr />
                <label>
                    Chunk size:
                    <input name="chunk_size" type="number" defaultValue="65536" />
                </label>
                <hr />
                <label>
                    Sample rate:
                    <input name="sample_rate" type="number" defaultValue="44100" />
                </label>
                <hr />
                <label>
                    Training steps:
                    <input name="steps" type="number" defaultValue="0" />
                </label>
                <hr />
                <button type="reset">Reset form</button>
                <button type="submit">Submit form</button>
            </form>
        </div>
      );
};

export default ImportModel;