import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import fcose from 'cytoscape-fcose';

cytoscape.use( fcose );

export default function KnowledgeGraph() {
    const cytoscapeContainerRef = useRef(null);
    const cytoscapeInstanceRef = useRef(null);
  
    useEffect(() => {
        // Initialize Cytoscape.js instance and attach it to the container
        const cy = cytoscape({
            container: cytoscapeContainerRef.current,
            // Add your Cytoscape.js configuration options here
        });
        cytoscapeInstanceRef.current = cy;

        // Add any initial graph creation or manipulation logic here
        cy.add([{ group:'nodes', data:{ id: 'n0'}},
                    { group:'nodes', data:{ id: 'n1'}},
                    { group:'nodes', data:{ id: 'n2'}},
                    { group:'nodes', data:{ id: 'n3'}},
                    { group:'nodes', data:{ id: 'n4', parent: 'n37'}},
                    { group:'nodes', data:{ id: 'n5'}},
                    { group:'nodes', data:{ id: 'n6'}},
                    { group:'nodes', data:{ id: 'n7', parent: 'n37'}},
                    { group:'nodes', data:{ id: 'n8', parent: 'n37'}},
                    { group:'nodes', data:{ id: 'n9', parent: 'n37'}},
                    { group:'nodes', data:{ id: 'n10', parent: 'n38'}},
                    { group:'nodes', data:{ id: 'n12'}},
                    { group:'nodes', data:{ id: 'n13'}},
                    { group:'nodes', data:{ id: 'n14'}},
                    { group:'nodes', data:{ id: 'n15'}},
                    { group:'nodes', data:{ id: 'n16'}},
                    { group:'nodes', data:{ id: 'n17'}},
                    { group:'nodes', data:{ id: 'n18'}},
                    { group:'nodes', data:{ id: 'n19'}},
                    { group:'nodes', data:{ id: 'n20'}},
                    { group:'nodes', data:{ id: 'n21'}},
                    { group:'nodes', data:{ id: 'n22'}},
                    { group:'nodes', data:{ id: 'n23'}},
                    { group:'nodes', data:{ id: 'n24', parent: 'n39'}},
                    { group:'nodes', data:{ id: 'n25', parent: 'n39'}},
                    { group:'nodes', data:{ id: 'n26', parent: 'n42'}},
                    { group:'nodes', data:{ id: 'n27', parent: 'n42'}},
                    { group:'nodes', data:{ id: 'n28', parent: 'n42'}},
                    { group:'nodes', data:{ id: 'n29', parent: 'n40'}},
                    { group:'nodes', data:{ id: 'n31', parent: 'n41'}},
                    { group:'nodes', data:{ id: 'n32', parent: 'n41'}},
                    { group:'nodes', data:{ id: 'n33', parent: 'n41'}},
                    { group:'nodes', data:{ id: 'n34', parent: 'n41'}},
                    { group:'nodes', data:{ id: 'n35', parent: 'n41'}},
                    { group:'nodes', data:{ id: 'n36', parent: 'n41'}},
                    { group:'nodes', data:{ id: 'n37'}},
                    { group:'nodes', data:{ id: 'n38'}},
                    { group:'nodes', data:{ id: 'n39', parent: 'n43'}},
                    { group:'nodes', data:{ id: 'n40', parent: 'n42'}},
                    { group:'nodes', data:{ id: 'n41', parent: 'n42'}},
                    { group:'nodes', data:{ id: 'n42', parent: 'n43'}},
                    { group:'nodes', data:{ id: 'n43'}},
                    { group:'nodes', data:{ id: 'n44'}},
                    { group:'nodes', data:{ id: 'n45'}},
                    { group:'nodes', data:{ id: 'n46'}},
                    { group:'nodes', data:{ id: 'n47'}},
                    { group:'edges', data:{ id: 'e0', source: 'n0', target: 'n1'} },
                    { group:'edges', data:{ id: 'e1', source: 'n1', target: 'n2'} },
                    { group:'edges', data:{ id: 'e2', source: 'n2', target: 'n3'} },
                    { group:'edges', data:{ id: 'e3', source: 'n0', target: 'n3'} },
                    { group:'edges', data:{ id: 'e4', source: 'n1', target: 'n4'} },
                    { group:'edges', data:{ id: 'e5', source: 'n2', target: 'n4'} },
                    { group:'edges', data:{ id: 'e6', source: 'n4', target: 'n5'} },
                    { group:'edges', data:{ id: 'e7', source: 'n5', target: 'n6'} },
                    { group:'edges', data:{ id: 'e8', source: 'n4', target: 'n6'} },
                    { group:'edges', data:{ id: 'e9', source: 'n4', target: 'n7'} },
                    { group:'edges', data:{ id: 'e10', source: 'n7', target: 'n8'} },
                    { group:'edges', data:{ id: 'e11', source: 'n8', target: 'n9'} },
                    { group:'edges', data:{ id: 'e12', source: 'n7', target: 'n9'} },
                    { group:'edges', data:{ id: 'e13', source: 'n13', target: 'n14'} },
                    //{ group:'edges', data:{ id: 'e14', source: 'n12', target: 'n14'} },
                    { group:'edges', data:{ id: 'e15', source: 'n14', target: 'n15'} },
                    { group:'edges', data:{ id: 'e16', source: 'n14', target: 'n16'} },
                    { group:'edges', data:{ id: 'e17', source: 'n15', target: 'n17'} },
                    { group:'edges', data:{ id: 'e18', source: 'n17', target: 'n18'} },
                    { group:'edges', data:{ id: 'e19', source: 'n18', target: 'n19'} },
                    { group:'edges', data:{ id: 'e20', source: 'n17', target: 'n20'} },
                    { group:'edges', data:{ id: 'e21', source: 'n19', target: 'n20'} },
                    { group:'edges', data:{ id: 'e22', source: 'n16', target: 'n20'} },
                    { group:'edges', data:{ id: 'e23', source: 'n20', target: 'n21'} },
                    { group:'edges', data:{ id: 'e25', source: 'n23', target: 'n24'} },
                    { group:'edges', data:{ id: 'e26', source: 'n24', target: 'n25'} },
                    { group:'edges', data:{ id: 'e27', source: 'n26', target: 'n38'} },
                    { group:'edges', data:{ id: 'e29', source: 'n26', target: 'n39'} },
                    { group:'edges', data:{ id: 'e30', source: 'n26', target: 'n27'} },
                    { group:'edges', data:{ id: 'e31', source: 'n26', target: 'n28'} },
                    { group:'edges', data:{ id: 'e33', source: 'n21', target: 'n31'} },
                    { group:'edges', data:{ id: 'e35', source: 'n31', target: 'n33'} },
                    { group:'edges', data:{ id: 'e36', source: 'n31', target: 'n34'} },
                    { group:'edges', data:{ id: 'e37', source: 'n33', target: 'n34'} },
                    { group:'edges', data:{ id: 'e38', source: 'n32', target: 'n35'} },
                    { group:'edges', data:{ id: 'e39', source: 'n32', target: 'n36'} },
                    { group:'edges', data:{ id: 'e40', source: 'n16', target: 'n40'} },
                    { group:'edges', data:{ id: 'e41', source: 'n44', target: 'n45'} },
                    { group:'edges', data:{ id: 'e42', source: 'n44', target: 'n46'} },
                    { group:'edges', data:{ id: 'e43', source: 'n45', target: 'n46'} }                 
                   ])

        // Clean up the Cytoscape.js instance when the component unmounts
        return () => {
            cy.destroy();
        };
    }, []);
    
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
            <div ref={cytoscapeContainerRef} style={{width: '100%', height: '80vh', textAlign: 'left'}}/>
        </div>
    );
    
  }