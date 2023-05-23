import React, { useState } from "react";

function ImportModel() {

    const [responseMessage, setResponseMessage] = useState('');

    function handleSubmit(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();

        // Read the form data
        const form = e.target;
        const formData = new FormData(form);

        fetch('http://localhost:5000/import-model', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                console.log(data.message); // Success message from the server
                setResponseMessage(data.message);
            })
            .catch(error => {
                console.error('Error:', error);
                setResponseMessage(error.message)
            });
    };

    return (
        <form method="post" onSubmit={handleSubmit}>
            <label>
                Model name: <input name="modelName" defaultValue="" />
            </label>
            <hr />
            <label>
                Model path: <input name="modelPath" defaultValue="" />
            </label>
            <hr />
            <label>
                Chunk size: <input name="chunkSize" type="number" defaultValue="65536" />
            </label>
            <hr />
            <label>
                Sample rate: <input name="sampleRate" type="number" defaultValue="44100" />
            </label>
            <hr />
            <label>
                Training steps: <input name="steps" type="number" defaultValue="0" />
            </label>
            <hr />
            <button type="reset">Reset form</button>
            <button type="submit">Submit form</button>
            <p>{responseMessage}</p>
        </form>
      );
};

export default ImportModel;