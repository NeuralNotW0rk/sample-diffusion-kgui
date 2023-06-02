import React, { createContext, useEffect, useRef, useState } from 'react';
import cytoscape, { use } from 'cytoscape';
import fcose from 'cytoscape-fcose';
import cxtmenu from 'cytoscape-cxtmenu'

import ToolBox from '../tool_components/ToolBox';
import defaultStyle from './GraphStyle';
import defaultLayout from './Layout';

cytoscape.use(fcose);
cytoscape.use(cxtmenu);

const ToolContext = createContext();

function KnowledgeGraph() {
    const cytoscapeContainerRef = useRef(null);
    const cytoscapeInstanceRef = useRef(null);

    const [graphData, setGraphData] = useState(null);
    const [typeNames, setTypeNames] = useState(null);

    const [activeTool, setActiveTool] = useState('default')
    const [toolParams, setToolParams] = useState(null);
    const [awaitingResponse, setAwaitingResponse] = useState(false);

    // -----------------
    //  COMPONENT SETUP
    // -----------------

    // Load graph from server
    const fetchGraphData = async () => {
        try {
            const response = await fetch('http://localhost:5000/graph');
            const data = await response.json();
            setGraphData(data);
        } catch (error) {
            console.error('Error fetching graph data:', error);
        }
    };

    const fetchTypeNames = async () => {
        try {
            const response = await fetch('http://localhost:5000/sd-types');
            const data = await response.json();
            setTypeNames(data);
        } catch (error) {
            console.error('Error fetching type names:', error);
        }
    };

    // Initialize graph data and type names
    useEffect(() => {
        setAwaitingResponse(true);
        fetchGraphData();
        fetchTypeNames();
        setAwaitingResponse(false);
    }, []);

    // Initialize graph on data retreival
    useEffect(() => {
        if (graphData) {
            // Initialize Cytoscape.js instance and attach it to the container
            const cy = cytoscape({
                container: cytoscapeContainerRef.current,
                elements: graphData.elements,
                style: defaultStyle,
                layout: defaultLayout
            });
            cytoscapeInstanceRef.current = cy;

            // Context menu configuration

            // Core component
            cy.cxtmenu({
                selector: 'core',
                commands: [
                    {
                        content: 'Recenter view',
                        select: function () {
                            applyFcose();
                        }
                    },

                    {
                        content: 'Import Model',
                        select: function () {
                            setActiveTool('importModel');
                        }
                    },
                ]
            });

            // Model nodes
            cy.cxtmenu({
                selector: 'node[type="model"]',
                commands: [
                    {
                        content: 'Generate',
                        select: function (ele) {
                            setActiveTool('generate');

                            const nodeData = ele.json().data;
                            setToolParams({ nodeData });
                        }
                    },

                    {
                        content: 'Details',
                        select: function (ele) {
                            setActiveTool('details');

                            const nodeData = ele.json().data;
                            setToolParams({ nodeData });
                        }
                    }
                ]
            });

            // Audio nodes
            cy.cxtmenu({
                selector: 'node[type="audio"]',
                commands: [
                    {
                        content: 'Details',
                        select: function (ele) {
                            setActiveTool('details');

                            const nodeData = ele.json().data;
                            setToolParams({ nodeData });
                        }
                    },

                    {
                        content: 'Play',
                        select: function (ele) {
                            setActiveTool('playAudio');

                            const nodeData = ele.json().data;
                            setToolParams({ nodeData });
                        }
                    },


                    {
                        content: 'Edit',
                        select: function (ele) {
                            setActiveTool('updateAttributes');

                            const nodeData = ele.json().data;
                            setToolParams({ nodeData });
                        }
                    }
                ]
            });

            applyFcose();

            return () => {
                cy.destroy();
            };
        }
    }, [graphData]);

    // ------------------
    //  LAYOUT FUNCTIONS
    // ------------------

    const randomizeGraph = () => {
        const cy = cytoscapeInstanceRef.current;
        // Update the graph to randomize it
        var layout = cy.layout({
            name: 'random',
            animate: true,
            animationDuration: 1000
        });

        layout.run();
    };

    const applyFcose = () => {
        const cy = cytoscapeInstanceRef.current;
        var layout = cy.layout(defaultLayout);

        layout.run();
    };

    // -----------
    //  RENDERING
    // -----------

    return (
        <ToolContext.Provider value={{ typeNames, activeTool, setActiveTool, toolParams, setAwaitingResponse }}>
            <div className="main-content">
                <div className="toolbar">
                    <h1>Test Graph</h1>
                    <button onClick={fetchGraphData}>Refresh</button>
                    {awaitingResponse ? (
                        <div>
                            <h2>Waiting for response...</h2>
                        </div>
                    ) : (
                        <ToolBox />
                    )}
                </div>
                <div ref={cytoscapeContainerRef} style={{ width: '80%', height: '100%', textAlign: 'left' }} />

            </div>
        </ToolContext.Provider>
    );

};

export default KnowledgeGraph
export { ToolContext };