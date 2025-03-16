export function loadModels(scene) {
    const assetsManager = new BABYLON.AssetsManager(scene);

    const pawnTask = assetsManager.addMeshTask("pawn task", "", "objects/", "pawn.obj");
    pawnTask.onSuccess = function (task) {
        window.pawnMesh = task.loadedMeshes[0];
        window.pawnMesh.scaling = new BABYLON.Vector3(0.2, 0.2, 0.2);
        window.pawnMesh.position = new BABYLON.Vector3(0, -0.55, 0);
        window.pawnMesh.rotation = new BABYLON.Vector3(0, Math.PI, 0);

        const pbr = new BABYLON.PBRMaterial("pawnMat", scene);
        pbr.metallic = 1.0;
        pbr.roughness = 0.45;
        pbr.albedoColor = new BABYLON.Color3(1, 0.6, 0.7);
        pbr.reflectivityColor = new BABYLON.Color3(1, 1, 1);
        window.pawnMesh.material = pbr;
    };

    const kingTask = assetsManager.addMeshTask("king task", "", "objects/", "king.obj");
    kingTask.onSuccess = function (task) {
        window.kingMesh = task.loadedMeshes[0];
        window.kingMesh.scaling = new BABYLON.Vector3(0.2, 0.2, 0.2);
        window.kingMesh.position = new BABYLON.Vector3(0, -0.55, 0);
        window.kingMesh.rotation = new BABYLON.Vector3(0, Math.PI, 0);
        window.kingMesh.isVisible = false;

        const pbr = new BABYLON.PBRMaterial("kingMat", scene);
        pbr.metallic = 1.0;
        pbr.roughness = 0.45;
        pbr.albedoColor = new BABYLON.Color3(1, 0.6, 0.7);
        pbr.reflectivityColor = new BABYLON.Color3(1, 1, 1);
        window.kingMesh.material = pbr;
    };

    assetsManager.load();
}