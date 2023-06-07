import React, { useContext, useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable"
import './Tools.css';

import { ToolContext } from "../graph_components/KnowledgeGraph";

function UpdateAttributes() {

    const { toolParams, setAwaitingResponse } = useContext(ToolContext);

    const [alias, setAlias] = useState('');
    const [caption, setCaption] = useState('');
    const [selectedTags, setSelectedTags] = useState(null);
    const [tagOptions, setTagOptions] = useState([]);

    useEffect(() => {
        setAlias(toolParams.nodeData.alias || '');
        setCaption(toolParams.nodeData.caption || '');
        setSelectedTags([]);
        toolParams.nodeData.tags && setSelectedTags(toolParams.nodeData.tags.split(',').map((value) => ({
            value,
            label: value
        })));
    }, [toolParams]);

    function handleSubmit(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();

        // Read the form data
        const form = e.target;
        const formData = new FormData(form);
        formData.append('name', toolParams.nodeData.name);
        
        const tagLabels = selectedTags.map((element) => element.label)
        tagLabels && formData.append('tags', tagLabels);

        formData.get('alias') === '' && formData.delete('alias');
        formData.get('caption') === '' && formData.delete('caption');

        setAwaitingResponse(true);
        fetch('/update-element', {
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
                    <input
                        name="alias"
                        value={alias}
                        onChange={(e) => setAlias(e.target.value)}
                    />
                </label>
                <hr />
                <label>
                    Tags:
                    <CreatableSelect
                        value={selectedTags}
                        onChange={setSelectedTags}
                        isMulti={true}
                        isClearable={false}
                        className="custom-select"
                    />
                </label>
                <hr />
                <label>
                    Caption:
                    <input
                        name="caption"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                    />
                </label>
                <hr />
                <button type="reset">Clear</button>
                <button type="submit">Apply</button>
            </form>
        </div>
    );
};

export default UpdateAttributes;