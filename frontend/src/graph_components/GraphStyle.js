const defaultStyle = [
    // General style configuration
    {
        selector: 'node',
        style: {
            'color': 'white',
            'text-valign': 'center',
            'text-halign': 'center'
        }
    },

    // Element-specific style configuration
    {
        selector: 'node[type="model"]',
        style: {
            'label': 'data(name)',
            'background-color': '#627',
            'width': 60,
            'height': 60,
        }
    },
    {
        selector: 'node[type="batch"]',
        style: {
            'width': 15,
            'height': 15,
        }
    },
    {
        selector: 'node[type="audio"]',
        style: {
            'label': 'data(name)',
            'background-color': '#267',
            'width': 30,
            'height': 30,
        }
    },
]

export default defaultStyle