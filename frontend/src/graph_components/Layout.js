const defaultFcose = {
    name: 'fcose',
    animate: true,
    animationEasing: 'ease-out',
    fit: true,
    uniformNodeDimensions: false,
    packComponents: true, // Pack to window
    tile: true, // Tile disconnected nodes
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
};

export default defaultFcose;