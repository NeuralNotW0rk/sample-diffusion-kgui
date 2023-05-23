import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import fcose from 'cytoscape-fcose';
import cxtmenu from 'cytoscape-cxtmenu'
import ModelNode from './ModelNode';

cytoscape.use( fcose );
cytoscape.use( cxtmenu );

function KnowledgeGraph() {
    const cytoscapeContainerRef = useRef(null);
    const cytoscapeInstanceRef = useRef(null);

    const [graphData, setGraphData] = useState(null);

    useEffect(() => {
        const fetchGraphData = async () => {
            try {
                const response = await fetch('http://localhost:5000/graph');
                const data = await response.json();
                setGraphData(data);
            } catch (error) {
                console.error('Error fetching graph data:', error);
            }
        };

        fetchGraphData();
    }, []);
  
    useEffect(() => {
        if (graphData) {
            // Initialize Cytoscape.js instance and attach it to the container'
            const cy = cytoscape({
                container: cytoscapeContainerRef.current,
                style: [
                    // Define styles for different types of nodes
                    {
                    selector: 'node[type="model"]',
                    style: {
                        'content': 'data(name)',
                        'background-color': 'orange',
                    },
                    },
                ],
                elements: graphData.elements
            });
            cytoscapeInstanceRef.current = cy;

            // Add any initial graph creation or manipulation logic here

            cy.cxtmenu({
                selector: 'node[type="model"]',

                commands: [
                    {
                        content: 'bg1',
                        select: function(){
                            console.log( 'bg1' );
                        }
                    },

                    {
                        content: 'bg2',
                        select: function(){
                            console.log( 'bg2' );
                        }
                    }
                ]
            });
            

            // Clean up the Cytoscape.js instance when the component unmounts
            return () => {
                cy.destroy();
            };
        }
    }, [graphData]);

    const addNode = (nodeComponent) => {
        const cy = cytoscapeInstanceRef.current;
    
        // Add the new node to the graph
        cy.add({
          data: nodeComponent.nodeData,
        });
    
        // Apply layout or other graph manipulations if necessary
    
        // Update the state or trigger re-rendering if needed
      };

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
        var layout = cy.layout({
            name: 'fcose',
            animate: true,
            animationEasing: 'ease-out',
            fit: true,
            uniformNodeDimensions: false,
            packComponents: true, // Pack to window
            tile: true, // Tile disconnected
            nodeRepulsion: 4500,
            idealEdgeLength: 50,
            edgeElasticity: 0.45,
            nestingFactor: 0.1,
            gravity: 0.25,
            gravityRange: 3.8,
            gravityCompound: 1,
            gravityRangeCompound: 1.5,
            numIter: 2500,
            tilingPaddingVertical: 10,
            tilingPaddingHorizontal: 10,
            initialEnergyOnIncremental: 3,
            step:"all"
        });
          
        layout.run();        
    };
  
    return (
        <div>
            <h1>Graph Title</h1>
            <button onClick={randomizeGraph}>Randomize Graph</button>
            <button onClick={applyFcose}>fCoSE</button>
            <div ref={cytoscapeContainerRef} style={{width: '100%', height: '80vh', textAlign: 'left'}}>

            </div>
        </div>
    );
    
  }

  export default KnowledgeGraph