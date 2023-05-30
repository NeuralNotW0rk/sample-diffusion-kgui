const defaultStyle = [
    // General style configuration
    {
        selector: 'node',
        style: {
            'color': 'white',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': 3
        }
    },

    // Element-specific style configuration
    {
        selector: 'node[type="model"]',
        style: {
            'label': 'data(name)',
            'background-color': '#f60',
        },
    },
]

export default defaultStyle