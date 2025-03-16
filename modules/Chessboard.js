export function createChessboard(scene, world) {
    const size = 1; // Size of each box
    const offset = size / 2; // Offset to center the chessboard
    const textures = [
        new BABYLON.PBRMaterial("blackMarble", scene),
        new BABYLON.PBRMaterial("defaultTexture", scene)
    ];

    textures[0].albedoTexture = new BABYLON.Texture("textures/black_marble.jpg", scene);
    textures[0].roughness = 0.2; // Adjust roughness as needed
    textures[0].metallic = 0.5; // Adjust metallic as needed

    textures[1].albedoTexture = new BABYLON.Texture("textures/crate.png", scene);
    textures[1].roughness = 0.5; // Adjust roughness as needed
    textures[1].metallic = 0.5; // Adjust metallic as needed

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const box = BABYLON.MeshBuilder.CreateBox(`box_${row}_${col}`, { size }, scene);
            box.position = new BABYLON.Vector3(col * size - 4.5 * size + offset, -1, row * size - 4.5 * size + offset);
            box.material = (Math.random() > 0.5) ? textures[0] : textures[1];
            world.addBox(box);
        }
    }
}