

function CustomTiling({ cy }) {
    // Get all compound nodes
    const parents = cy.nodes('[type = "batch"], [type = "set"]');

    // Create a list of grouped children 
    const groups = parents.map((parent) => {
        return cy.nodes(`[parent = "${parent.data('id')}"]`);
    })

    // Tile the children based on batch_index
    const alignment = [];
    groups.forEach((group) => {
        group.sort((a, b) => {
            return a.data('batch_index') - b.data('batch_index');
        });
        var prev = null;
        group.forEach((child) => {
            if (prev) {
                alignment.push({
                    top: prev.data('id'),
                    bottom: child.data('id'),
                    gap: 60,
                })
            }
            prev = child;
        });
    });

    console.log(alignment);
    return alignment;
};

export default CustomTiling;