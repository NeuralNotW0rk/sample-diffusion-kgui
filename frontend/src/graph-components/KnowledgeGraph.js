import React, { useContext, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import cytoscape from 'cytoscape';
import layoutUtilities from 'cytoscape-layout-utilities';
import fcose from 'cytoscape-fcose';
import cxtmenu from 'cytoscape-cxtmenu';
import expandCollapse from 'cytoscape-expand-collapse';
import popper from 'cytoscape-popper';

import defaultStyle from './Style';
import defaultLayout from './Layout';
import defaultOptions from './Options';

import { ToolContext } from '../App';
import { Button, Divider, Stack, Typography } from '@mui/material';

cytoscape.use(layoutUtilities);
cytoscape.use(fcose);
cytoscape.use(cxtmenu);
cytoscape.use(expandCollapse);
//cytoscape.use(popper);

const ReactButton = () => {
    return <Button type='button'>React Button</Button>;
};

const createContentFromComponent = (component) => {
    const dummyDomEle = document.createElement('div');
    ReactDOM.render(component, dummyDomEle);
    document.body.appendChild(dummyDomEle);
    return dummyDomEle;
};

function KnowledgeGraph({ pendingRefresh }) {
    const {
        viewMode,
        toolParams,
        setToolParams,
        setActiveTool,
        setPendingRefresh,
        setTypeNames,
        setNodeNames,
        setProjectName,
        setTagList
    } = useContext(ToolContext);

    const cytoscapeContainerRef = useRef(null);
    const cytoscapeInstanceRef = useRef(null);
    //const cytoscapePopperRef = useRef(null);

    const [graphData, setGraphData] = useState(null);

    const [currentSample, setCurrentSample] = useState(null);
    const audioRef = useRef(null);

    // -----------------
    //  COMPONENT SETUP
    // -----------------

    // Load graph from server
    const fetchGraphData = async () => {
        try {
            var response = null;
            if (viewMode === 'cluster') {
                response = await fetch('/graph-tsne')
            } else {
                response = await fetch('/graph');
            }
            const data = await response.json();
            if (data.message === 'success') {
                setGraphData(data.graph_data);
            }
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
            if (data.message === 'success') {
                setProjectName(data.project_name);
            }
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
        var expCol = cy.expandCollapse('get');

        // ----------------------------
        //  Context menu configuration 
        // ----------------------------

        // Core component
        cy.cxtmenu({
            selector: 'core',
            commands: [
                {
                    content: 'Tidy',
                    select: function () {
                        applyFcose(false);
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
        const elementCommands = [
            /*
            {
                content: 'Details',
                select: function (ele) {
                    setActiveTool('details');

                    const nodeData = ele.json().data;
                    console.log(nodeData);
                    setToolParams({ nodeData });
                }
            },
            */
            {
                content: 'Remove',
                select: function (ele) {
                    setActiveTool('removeElement');

                    const nodeData = ele.json().data;
                    console.log(nodeData);
                    setToolParams({ nodeData });
                }
            }
        ];

        // Model nodes
        cy.cxtmenu({
            selector: 'node[type="model"]',
            commands: [
                ...elementCommands,
                {
                    content: 'Generate',
                    select: function (ele) {
                        setActiveTool('generation');

                        const nodeData = ele.json().data;
                        setToolParams({ nodeData });
                    }
                }
            ]
        });

        // Batch nodes
        const batchCommands = [
            {
                content: 'Label',
                select: function (ele) {
                    setActiveTool('batchUpdateAttributes');

                    const nodeData = ele.json().data;
                    setToolParams({ nodeData });
                }
            },
            {
                content: 'Export',
                select: function (ele) {
                    setActiveTool('exportBatch');

                    const nodeData = ele.json().data;
                    setToolParams({ nodeData });
                }
            },
        ]
        cy.cxtmenu({
            selector: 'node[type="batch"][?isExpanded]',
            commands: [
                ...elementCommands,
                ...batchCommands,
                {
                    content: 'Collapse',
                    select: function (ele) {
                        expCol.collapse(ele);
                        ele.data('isExpanded', false);
                    }
                }
            ]
        });
        cy.cxtmenu({
            selector: 'node[type="batch"][!isExpanded]',
            commands: [
                ...elementCommands,
                ...batchCommands,
                {
                    content: 'Expand',
                    select: function (ele) {
                        expCol.expand(ele);
                        ele.data('isExpanded', true);
                    }
                }
            ]
        });


        // Audio nodes
        cy.cxtmenu({
            selector: 'node[type="audio"]',
            commands: [
                ...elementCommands,
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
                ...elementCommands,
            ]
        });

        // Model nodes
        cy.cxtmenu({
            selector: 'node[type="model"]',
            commands: [
                ...elementCommands,
                {
                    content: 'Generate',
                    select: function (ele) {
                        setActiveTool('generation');

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
                ...elementCommands,
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

        // -----------------------
        //  Fetch additional data
        // -----------------------

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

            // Play audio on select
            cy.$('node[type="audio"]').on('select', (event) => {
                setCurrentSample(event.target.data());
            });

            // Display element details on select
            cy.$('*').on('select', (event) => {
                setActiveTool('details');

                const nodeData = event.target.data();
                console.log(nodeData);
                setToolParams({ nodeData });
            });

            // Retrieve node names (keyed by node type)
            var nodeMap = {}
            cy.nodes().forEach((ele) => {
                if (!nodeMap.hasOwnProperty(ele.data('type'))) {
                    nodeMap[ele.data('type')] = [];
                }
                nodeMap[ele.data('type')].push(ele.data('name'));
            });
            setNodeNames(nodeMap);

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
            if (toolParams && toolParams.nodeData) {
                const nodeData = cy.$id(toolParams.nodeData.id).json().data;
                setToolParams({ nodeData });
            };

            /*
            cy.nodes().on('mouseover', (event) => {
                cytoscapePopperRef.current = event.target.popper({
                    content: createContentFromComponent(<ReactButton />),
                    popper: {
                        placement: 'right',
                        removeOnDestroy: true,
                    },
                });
            });

            cy.nodes().on('mouseout', () => {
                if (cytoscapePopperRef) {
                    cytoscapePopperRef.current.destroy();
                }
            });
            */

        }
    }, [graphData]);

    // ------------------
    //  LAYOUT FUNCTIONS
    // ------------------

    function applyFcose(randomize = false) {
        const cy = cytoscapeInstanceRef.current;
        const scale = 500;

        var fixedNodeConstraint = [];
        if (viewMode === 'cluster') {
            fixedNodeConstraint = cy.$('node[type="audio"]').map((ele) => {
                return { 'nodeId': ele.data('id'), 'position': { 'x': ele.data('tsne_1') * scale, 'y': ele.data('tsne_2') * scale } };
            });
        };

        // Workaround tiling issues by temporarily removing audio source edges
        var audioSourceEdges = cy.edges('[type="audio_source"]').remove();

        // Create and run layout
        var layout = cy.layout({
            ...defaultLayout,
            randomize,
            fixedNodeConstraint,
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
        console.log('fCoSE applied');
    };

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.src = `/audio?name=${currentSample.name}`;
            audioRef.current.load();
            audioRef.current.play();
        }
    }, [currentSample]);

    // -----------
    //  RENDERING
    // -----------

    return (
        <div style={{ height: '95%', display: 'flex', flexDirection: 'column' }}>
            <div
                ref={cytoscapeContainerRef}
                style={{ height: '90%' }}
            />
            <Divider />
            <Stack
                direction='row'
                spacing={2}
                alignItems='center'
                justifyContent='center'
                padding={1}
            >
                <Typography variant='h6'>
                    {currentSample ? (
                        currentSample.alias
                    ) : (
                        'Click an audio node to listen'
                    )}
                </Typography>
                {currentSample &&
                    <audio ref={audioRef} controls />
                }
            </Stack>
        </div>
    );
};

export default KnowledgeGraph