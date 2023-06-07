import React, { createContext, useEffect, useRef, useState } from 'react';
import cytoscape, { use } from 'cytoscape';
import fcose from 'cytoscape-fcose';
import cxtmenu from 'cytoscape-cxtmenu';
import expandCollapse from 'cytoscape-expand-collapse';

import ToolBox from '../tool_components/ToolBox';
import defaultStyle from './Style';
import defaultLayout from './Layout';
import defaultOptions from './Options';

cytoscape.use(fcose);
cytoscape.use(cxtmenu);
cytoscape.use(expandCollapse);

const ToolContext = createContext();

function KnowledgeGraph() {
    const cytoscapeContainerRef = useRef(null);
    const cytoscapeInstanceRef = useRef(null);

    const [graphData, setGraphData] = useState(null);
    const [typeNames, setTypeNames] = useState(null);
    const [modelNames, setModelNames] = useState(null);

    const [activeTool, setActiveTool] = useState('default')
    const [toolParams, setToolParams] = useState(null);
    const [awaitingResponse, setAwaitingResponse] = useState(false);
    const [pendingRefresh, setPendingRefresh] = useState(true);

    // -----------------
    //  COMPONENT SETUP
    // -----------------

    // Load graph from server
    const fetchGraphData = async () => {
        try {
            const response = await fetch('/graph');
            const data = await response.json();
            setGraphData(data);
        } catch (error) {
            console.error('Error fetching graph data:', error);
        }
    };

    const fetchTypeNames = async () => {
        try {
            const response = await fetch('/sd-types');
            const data = await response.json();
            setTypeNames(data);
        } catch (error) {
            console.error('Error fetching type names:', error);
        }
    };

    // Initialize graph
    useEffect(() => {
        // Initialize Cytoscape.js instance and attach it to the container
        const cy = cytoscape({
            container: cytoscapeContainerRef.current,
            style: defaultStyle,
        });
        cytoscapeInstanceRef.current = cy;

        cy.expandCollapse(defaultOptions);

        cy.nodes().on('expandcollapse.beforecollapse', function() {
            var node = this;
            node.data('isExpanded', false);
        });
        cy.nodes().on('expandcollapse.beforeexpand', function() {
            var node = this;
            node.data('isExpanded', true);
        });


        // Core component
        cy.cxtmenu({
            selector: 'core',
            commands: [
                {
                    content: 'Shuffle',
                    select: function () {
                        applyFcose(true);
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
                        setActiveTool('generation');

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

        // Batch nodes
        cy.cxtmenu({
            selector: 'node[type="batch"][?isExpanded]',
            commands: [
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
                },

                {
                    content: 'Variation',
                    select: function (ele) {
                        setActiveTool('variation');

                        const nodeData = ele.json().data;
                        setToolParams({ nodeData });
                    }
                },
            ]
        });

        // Edges
        cy.cxtmenu({
            selector: 'edge',
            commands: [
                {
                    content: 'Details',
                    select: function (ele) {
                        setActiveTool('details');

                        const nodeData = ele.json().data;
                        setToolParams({ nodeData });
                    }
                },
            ]
        });

        fetchTypeNames();

        return () => {
            cy.destroy();
        };
    }, []);

    // Initialize graph data
    useEffect(() => {
        if (pendingRefresh) {
            fetchGraphData();
            setPendingRefresh(false);
        }
    }, [pendingRefresh]);

    // Update graph
    useEffect(() => {
        if (graphData) {
            const cy = cytoscapeInstanceRef.current;
            cy.add(graphData.elements);

            // Expand and collapse setup
            cy.$('node[type="batch"]').data('isExpanded', true);

            // Retrieve useful data
            setModelNames(cy.elements('node[type="model"]').map((ele) => {
                return ele.data('name');
            }));

            applyFcose();
        }
    }, [graphData]);

    // ------------------
    //  LAYOUT FUNCTIONS
    // ------------------

    function applyFcose(randomize = false) {
        const cy = cytoscapeInstanceRef.current;
        var layout = cy.layout({...defaultLayout, randomize});

        layout.run();
    };

    // -----------
    //  RENDERING
    // -----------

    return (
        <ToolContext.Provider value={{
            typeNames,
            modelNames,
            toolParams,
            setActiveTool,
            setAwaitingResponse,
            setPendingRefresh
        }}>
            <div className="main-content">
                <div className="toolbar">
                    <h1>Test Graph</h1>
                    <button onClick={fetchGraphData}>Refresh</button>
                    {awaitingResponse ? (
                        <div>
                            <h2>Waiting for response...</h2>
                        </div>
                    ) : (
                        <ToolBox activeTool={activeTool}/>
                    )}
                </div>
                <div ref={cytoscapeContainerRef} style={{ width: '80%', height: '100%', textAlign: 'left' }} />

            </div>
        </ToolContext.Provider>
    );

};

export default KnowledgeGraph
export { ToolContext };