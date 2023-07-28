const gradientColor1 = '#002254'
const gradientColor2 = '#004294'
const gradientColor3 = '#5b3285'
const gradientColor4 = '#7e1b6a'
const gradientColor5 = '#8f004a'

const audioColor = '#278' // Pale cyan
const batchColor = '#000' // Black
const selectedColor = '#888' // Light gray
const modelColor = gradientColor3
const externalColor = gradientColor2

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
            'color': 'white',
            'edge-text-rotation': 'autorotate',
            'curve-style': 'straight',
            'target-arrow-shape': 'triangle',
            'z-compound-depth': 'bottom',
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
    {
        selector: 'node[type="audio"][rating="1"]',
        style: {
            'border-color': gradientColor1,
            'border-width': 2,
        }
    },
    {
        selector: 'node[type="audio"][rating="2"]',
        style: {
            'border-color': gradientColor2,
            'border-width': 2,
        }
    },
    {
        selector: 'node[type="audio"][rating="3"]',
        style: {
            'border-color': gradientColor3,
            'border-width': 2,
        }
    },
    {
        selector: 'node[type="audio"][rating="4"]',
        style: {
            'border-color': gradientColor4,
            'border-width': 2,
        }
    },
    {
        selector: 'node[type="audio"][rating="5"]',
        style: {
            'border-color': gradientColor5,
            'border-width': 2,
        }
    },

    // Edge-specific style configuration
    {
        selector: 'edge[type="dd_generation"]',
        style: {
            'label': 'data(seed)',
            'line-color': modelColor,
            'target-arrow-color': modelColor,
        }
    },
    {
        selector: 'edge[type="dd_variation"]',
        style: {
            'label': 'data(seed)',
            'line-color': modelColor,
            'target-arrow-color': modelColor,
            'line-style': 'dashed',
        }
    },
    {
        selector: 'edge[type="audio_source"]',
        style: {
            'label': 'data(strength)',
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
export { gradientColor1, gradientColor2, gradientColor3, gradientColor4, gradientColor5 }