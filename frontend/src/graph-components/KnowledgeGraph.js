import React, { useContext, useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import layoutUtilities from 'cytoscape-layout-utilities';
import fcose from 'cytoscape-fcose';
import cxtmenu from 'cytoscape-cxtmenu';
import expandCollapse from 'cytoscape-expand-collapse';

import defaultStyle from './Style';
import defaultLayout from './Layout';
import defaultOptions from './Options';
import CustomTiling from './Tiling';

import { ToolContext } from "../App";

cytoscape.use(layoutUtilities);
cytoscape.use(fcose);
cytoscape.use(cxtmenu);
cytoscape.use(expandCollapse);

function KnowledgeGraph({ pendingRefresh }) {
    const { toolParams, setToolParams, setActiveTool, setPendingRefresh, setTypeNames, setProjectName, setModelNames, setTagList } = useContext(ToolContext);

    const cytoscapeContainerRef = useRef(null);
    const cytoscapeInstanceRef = useRef(null);

    const [graphData, setGraphData] = useState(null);

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

    const fetchProjectName = async () => {
        try {
            const response = await fetch('/project');
            const data = await response.json();
            setProjectName(data.project_name);
        } catch (error) {
            console.error('Error fetching project name:', error);
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

        cy.nodes().on('expandcollapse.beforecollapse', function () {
            var node = this;
            node.data('isExpanded', false);
        });
        cy.nodes().on('expandcollapse.beforeexpand', function () {
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
                    content: 'Import model',
                    select: function () {
                        setActiveTool('importModel');
                    }
                },
                {
                    content: 'Add external source',
                    select: function () {
                        setActiveTool('externalSource');
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
                },
                {
                    content: 'Label',
                    select: function (ele) {
                        setActiveTool('batchUpdateAttributes');

                        const nodeData = ele.json().data;
                        setToolParams({ nodeData });
                    }
                },
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
                    content: 'Label',
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
                {
                    content: 'Export',
                    select: function (ele) {
                        setActiveTool('exportSingle');

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

        // External source nodes
        cy.cxtmenu({
            selector: 'node[type="external"]',
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
                    content: 'Rescan',
                    select: function (ele) {
                        setActiveTool('rescanSource');

                        const nodeData = ele.json().data;
                        setToolParams({ nodeData });
                    }
                }
            ]
        });

        fetchTypeNames();
        fetchProjectName();

        return () => {
            cy.destroy();
        };
    }, []);

    // Initialize graph data
    useEffect(() => {
        if (pendingRefresh) {
            fetchGraphData();
            fetchProjectName();
            setPendingRefresh(false);
        }
    }, [pendingRefresh]);

    // Update graph
    useEffect(() => {
        if (graphData) {
            const cy = cytoscapeInstanceRef.current;

            // Replace elements and restore positions
            const positions = cy.nodes().map((ele) => {
                return { id: ele.id(), pos: ele.position() };
            });

            cy.remove('*');
            cy.add(graphData.elements);

            positions.forEach((ele) => {
                cy.$id(ele.id).position(ele.pos);
            });

            // Apply layout if number of nodes has changed
            cy.nodes().length === positions.length || applyFcose();


            // Expand and collapse setup
            cy.$('node[type="batch"]').data('isExpanded', true);

            // Retrieve model names
            setModelNames(cy.elements('node[type="model"]').map((ele) => {
                return ele.data('name');
            }));

            // Create a list of existing tags sorted by frequency
            var tagCounts = {};
            cy.elements().forEach((ele) => {
                if (ele.data('tags')) {
                    ele.data('tags').split(',').forEach((tag) => {
                        if (tagCounts[tag]) {
                            tagCounts[tag] += 1;
                        } else {
                            tagCounts[tag] = 1;
                        }
                    })
                }
            })
            var tagListTemp = Object.entries(tagCounts).map(([tag, count]) => ({
                tag,
                count
            }));
            tagListTemp.sort((a, b) => b.count - a.count);
            setTagList(tagListTemp);

            // Signal active tool to update
            if (toolParams) {
                const nodeData = cy.$id(toolParams.nodeData.id).json().data;
                setToolParams({ nodeData });
            };

        }
    }, [graphData]);

    // ------------------
    //  LAYOUT FUNCTIONS
    // ------------------

    function applyFcose(randomize = false) {
        const cy = cytoscapeInstanceRef.current;

        // Workaround tiling issues by temporarily removing audio source edges
        var audioSourceEdges = cy.edges('[type="audio_source"]').remove();

        // Create and run layout
        var layout = cy.layout({
            ...defaultLayout,
            randomize,
            tilingCompareBy: (nodeId1, nodeId2) => {
                if (cy.$id(nodeId1).data('type') === 'audio' && cy.$id(nodeId2).data('type') === 'audio') {
                    return cy.$id(nodeId1).data('batch_index') - cy.$id(nodeId2).data('batch_index');
                };
                return 0;
            },

        });
        layout.run();

        // Restore removed elements
        audioSourceEdges.restore();
    };

    // -----------
    //  RENDERING
    // -----------

    return (
            <div ref={cytoscapeContainerRef} style={{ width: '100%', height: '100%', textAlign: 'left' }} />
    );

};

export default KnowledgeGraph