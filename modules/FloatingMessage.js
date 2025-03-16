export function showFloatingMessage(message, scene, position, camera) {
    const tex = new BABYLON.DynamicTexture("messageTexture", { width: 512, height: 256 }, scene);
    const font = "bold 44px monospace";
    tex.drawText(message, null, 100, font, "black", "white", true, true);

    const messageMaterial = new BABYLON.StandardMaterial("messageMat", scene);
    messageMaterial.diffuseTexture = tex;
    messageMaterial.backFaceCulling = false;
    messageMaterial.alpha = 0.7;

    const messageSprite = new BABYLON.MeshBuilder.CreatePlane("messageSprite", { width: 1, height: 0.5, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
    messageSprite.material = messageMaterial;
    messageSprite.position = position.clone();
    messageSprite.position.y += 0.5;

    messageSprite.onBeforeRenderObservable.add(() => {
        messageSprite.lookAt(camera.position);
        messageSprite.rotate(BABYLON.Axis.Y, Math.PI, BABYLON.Space.LOCAL);
    });

    setTimeout(() => {
        messageSprite.dispose();
    }, 2000);
}