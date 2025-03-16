export function createBox(scene, name, texturePath, position) {
    const boxMaterial = new BABYLON.StandardMaterial(name, scene);
    boxMaterial.diffuseTexture = new BABYLON.Texture(texturePath, scene);

    const box = BABYLON.MeshBuilder.CreateBox(name, {}, scene);
    box.material = boxMaterial;
    box.position = position;

    return box;
}