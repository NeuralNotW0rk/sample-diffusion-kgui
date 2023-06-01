import React, { useContext } from "react";

import { ToolContext } from "../graph_components/KnowledgeGraph";

function UpdateAttributes() {
    const { toolParams, setAwaitingResponse } = useContext(ToolContext);

    function handleSubmit(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();

        // Read the form data
        const form = e.target;
        const formData = new FormData(form);
        formData.append('name', toolParams.nodeData.name);

        setAwaitingResponse(true);
        fetch('http://localhost:5000/update-element', {
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
            <h2>Update Attributes</h2>
            <form method="post" onSubmit={handleSubmit}>
                Name: {toolParams.nodeData.name}
                <hr />
                <label>
                    Alias:
                    <input name="alias" defaultValue={toolParams.nodeData.alias || ""} />
                </label>
                <hr />
                <label>
                    Tags (comma separated):
                    <input name="tags" defaultValue={toolParams.nodeData.tags || ""} />
                </label>
                <hr />
                <label>
                    Caption:
                    <input name="caption" defaultValue={toolParams.nodeData.caption || ""} />
                </label>
                <hr />
                <button type="reset">Clear</button>
                <button type="submit">Apply</button>
            </form>
        </div>
    );
};

export default UpdateAttributes;