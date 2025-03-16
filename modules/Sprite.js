export function createSprite(scene, renderer, text, position) {
    const tex = new BABYLON.DynamicTexture("name", { width: 256, height: 256 }, scene);
    const font = "bold 124px monospace";
    tex.drawText(text, null, null, font, "black", "white", true, true);

    const spriteMaterial = new BABYLON.ShaderMaterial("mat", scene, {
        vertex: "custom",
        fragment: "custom",
    }, {
        attributes: ["position", "uv"],
        uniforms: ["worldViewProjection", "screenSize"],
        needAlphaBlending: true
    });

    spriteMaterial.setTexture("depth", renderer.getDepthMap());
    spriteMaterial.setTexture("textureSampler", tex);
    spriteMaterial.backFaceCulling = false;
    spriteMaterial.disableDepthWrite = true;
    spriteMaterial.alphaMode = BABYLON.Engine.ALPHA_COMBINE;

    const sprite = new BABYLON.MeshBuilder.CreatePlane("sprite", { size: 0.3, sideOrientation: BABYLON.Mesh.BACKSIDE }, scene);
    sprite.material = spriteMaterial;
    sprite.position = position;

    return sprite;
}