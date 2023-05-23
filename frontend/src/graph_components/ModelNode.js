import React from 'react';

function ModelNode({ name, id, sample_rate }) {
    const nodeData = {
        name,
        id,
        sample_rate,
        type: 'model',
    };
  
    return (
        <div>
            {/* Render the node based on the nodeData */}
            <div>{nodeData.name}</div>
            <div>{nodeData.id}</div>
            <div>{nodeData.sample_rate}</div>
            {/* Additional rendering logic or UI elements */}
        </div>
    );
}

export default ModelNode;