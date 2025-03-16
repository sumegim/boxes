export function createChessboard(scene, world) {
    const size = 1; // Size of each box
    const offset = size / 2; // Offset to center the chessboard
    const textures = [
        new BABYLON.StandardMaterial("blackMarble", scene),
        new BABYLON.StandardMaterial("defaultTexture", scene)
    ];

    textures[0].diffuseTexture = new BABYLON.Texture("textures/black_marble.jpg", scene);
    textures[1].diffuseTexture = new BABYLON.Texture("textures/crate.png", scene);

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const box = BABYLON.MeshBuilder.CreateBox(`box_${row}_${col}`, { size }, scene);
            box.position = new BABYLON.Vector3(col * size - 4 * size + offset, -1, row * size - 4 * size + offset);
            box.material = (row + col) % 2 === 0 ? textures[0] : textures[1];
            world.addBox(box);
        }
    }
}