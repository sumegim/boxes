import { showFloatingMessage } from './FloatingMessage.js';

export function setupUIManager({ scene, sprites, camera, engine, meshes }) {
    const manager = new BABYLON.GUI.GUI3DManager(scene);

    const pushButton1 = new BABYLON.GUI.MeshButton3D(sprites[0], "pushButton1");
    pushButton1.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
    pushButton1.onPointerClickObservable.add(() => {
        console.log('PushButton1 pushed!');
        showFloatingMessage("Hello World", scene, sprites[0].position, camera);
    });
    manager.addControl(pushButton1);

    const pushButton2 = new BABYLON.GUI.MeshButton3D(sprites[1], "pushButton2");
    pushButton2.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
    pushButton2.onPointerClickObservable.add(() => {
        console.log('PushButton2 pushed!');
        if (meshes.pawnMesh && meshes.kingMesh) {
            meshes.pawnMesh.isVisible = !meshes.pawnMesh.isVisible;
            meshes.kingMesh.isVisible = !meshes.kingMesh.isVisible;
        }
    });
    manager.addControl(pushButton2);

    scene.onBeforeRenderObservable.add(() => {
        sprites[0].material.setVector2("screenSize", new BABYLON.Vector2(engine.getRenderWidth(), engine.getRenderHeight()));
    });

    sprites.forEach((sprite) => {
        sprite.onBeforeRenderObservable.add(() => {
            let pos = sprite.position.clone();
            pos.multiplyInPlace(new BABYLON.Vector3(2, 2, 2));
            pos = pos.subtract(camera.position.clone());
            sprite.lookAt(pos);
            engine.setDepthFunction(BABYLON.Engine.ALWAYS);
        });

        sprite.onAfterRenderObservable.add(() => {
            engine.setDepthFunction(BABYLON.Engine.LEQUAL);
        });
    });
}