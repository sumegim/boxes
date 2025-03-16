export function loadModels(scene) {
    const assetsManager = new BABYLON.AssetsManager(scene);
    const meshes = {};

    const pawnTask = assetsManager.addMeshTask("pawn task", "", "objects/", "pawn.obj");
    pawnTask.onSuccess = function (task) {
        const pawnMesh = task.loadedMeshes[0];
        pawnMesh.scaling = new BABYLON.Vector3(0.2, 0.2, 0.2);
        pawnMesh.position = new BABYLON.Vector3(0, -0.55, 0);
        pawnMesh.rotation = new BABYLON.Vector3(0, Math.PI, 0);

        const pbr = new BABYLON.PBRMaterial("pawnMat", scene);
        pbr.metallic = 1.0;
        pbr.roughness = 0.45;
        pbr.albedoColor = new BABYLON.Color3(1, 0.6, 0.7);
        pbr.reflectivityColor = new BABYLON.Color3(1, 1, 1);
        pawnMesh.material = pbr;

        meshes.pawnMesh = pawnMesh;
    };

    const kingTask = assetsManager.addMeshTask("king task", "", "objects/", "king.obj");
    kingTask.onSuccess = function (task) {
        const kingMesh = task.loadedMeshes[0];
        kingMesh.scaling = new BABYLON.Vector3(0.2, 0.2, 0.2);
        kingMesh.position = new BABYLON.Vector3(0, -0.55, 0);
        kingMesh.rotation = new BABYLON.Vector3(0, Math.PI, 0);
        kingMesh.isVisible = false;

        const pbr = new BABYLON.PBRMaterial("kingMat", scene);
        pbr.metallic = 1.0;
        pbr.roughness = 0.45;
        pbr.albedoColor = new BABYLON.Color3(1, 0.6, 0.7);
        pbr.reflectivityColor = new BABYLON.Color3(1, 1, 1);
        kingMesh.material = pbr;

        meshes.kingMesh = kingMesh;
    };

    assetsManager.load();

    return meshes;
}