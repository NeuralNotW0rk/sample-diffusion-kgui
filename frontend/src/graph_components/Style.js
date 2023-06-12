const audioColor = '#278' // Pale cyan
const modelColor = '#527' // Purple
const batchColor = '#000' // Black
const externalColor = '#14a' // Blue
const selectedColor = '#888' // Light gray
const unassignedColor1 = '#914' // Maroon?

const defaultStyle = [
    // General style configuration
    {
        selector: 'node',
        style: {
            'color': 'white',
            'text-valign': 'center',
            'text-halign': 'center'
        },
    },
    {
        selector: 'edge',
        style: {
            'curve-style': 'straight',
            'target-arrow-shape': 'triangle'
        },
    },

    // Node-specific style configuration
    {
        selector: 'node[type="model"]',
        style: {
            'label': 'data(name)',
            'background-color': modelColor,
            'width': 60,
            'height': 60,
        }
    },
    {
        selector: 'node[type="external"]',
        style: {
            'label': 'data(name)',
            'background-color': externalColor,
            'width': 60,
            'height': 60,
        }
    },
    {
        selector: 'node[type="batch"], node[type="set"]',
        style: {
            'label': 'data(alias)',
            'text-valign': 'top',
            'background-color': batchColor,
            'background-opacity': 0.50,
            'border-color': audioColor,
            'border-width': 2,
        }
    },
    {
        selector: 'node[type="audio"]',
        style: {
            'label': 'data(alias)',
            'background-color': audioColor,
            'width': 30,
            'height': 30,
        }
    },

    // Edge-specific style configuration
    {
        selector: 'edge[type="dd_generation"]',
        style: {
            'line-color': modelColor,
            'target-arrow-color': modelColor,
        }
    },
    {
        selector: 'edge[type="dd_variation"]',
        style: {
            'line-color': modelColor,
            'target-arrow-color': modelColor,
            'line-style': 'dashed',
        }
    },
    {
        selector: 'edge[type="audio_source"]',
        style: {
            'line-color': audioColor,
            'target-arrow-color': audioColor,
            'line-style': 'dashed',
        }
    },
    {
        selector: 'edge[type="import"]',
        style: {
            'line-color': externalColor,
            'target-arrow-color': externalColor,
        }
    },

    // Overrides
    {
        selector: ':selected',
        style: {
            'border-color': selectedColor,
            'border-width': 4,
            'line-color': selectedColor,
            'target-arrow-color': selectedColor,
        },
    },
]

export default defaultStyle