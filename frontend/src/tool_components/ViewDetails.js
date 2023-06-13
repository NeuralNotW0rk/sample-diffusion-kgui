import React, { useContext } from "react";
import './Tools.css';

import { ToolContext } from "../App";

function ViewDetails() {
    const { toolParams } = useContext(ToolContext);

    return (
        <div>
            <h2>Details</h2>
            <ul className="attribute-list">
                {Object.entries(toolParams.nodeData).map(([key, value]) => (
                    <li key={key}>
                        <strong>{key}:</strong> {value}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ViewDetails;