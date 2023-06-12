import React, { useContext } from "react";
import './Tools.css';

import { ToolContext } from "../graph_components/KnowledgeGraph";

function ExternalSource() {

    const { setAwaitingResponse, setPendingRefresh } = useContext(ToolContext);

    function handleSubmit(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();

        // Read the form data
        const form = e.target;
        const formData = new FormData(form);

        setAwaitingResponse(true);
        fetch('/add-external-source', {
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
        <div>
            <h2> External Source </h2>
            <form method="post" onSubmit={handleSubmit}>
                <label>
                    Source name:
                    <input name="source_name" defaultValue="" />
                </label>
                <hr />
                <label>
                    Source path:
                    <input name="source_root" defaultValue="" />
                </label>
                <hr />
                <button type="reset">Reset form</button>
                <button type="submit">Submit form</button>
            </form>
        </div>
      );
};

export default ExternalSource;