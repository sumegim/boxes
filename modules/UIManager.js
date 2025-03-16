import { showFloatingMessage } from './FloatingMessage.js';
import { handlePlayerMovement } from './PlayerMovement.js';
import { setupEventHandlers } from './EventHandlers.js';

export function setupUIManager(world) {
    const { scene, camera, engine, sprites, meshes } = world;
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

    // Create a 2D GUI
    const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    // Function to move the meshes based on camera orientation
    const moveMesh = (direction) => {
        handlePlayerMovement(direction, camera, meshes);
    };

    // Add buttons for movement
    const createMoveButton = (name, text, callback) => {
        const button = BABYLON.GUI.Button.CreateSimpleButton(name, text);
        button.width = "50px";
        button.height = "50px";
        button.color = "white";
        button.background = "blue";
        button.onPointerClickObservable.add(callback);
        return button;
    };

    const moveUpButton = createMoveButton("moveUpButton", "↑", () => moveMesh('up'));
    moveUpButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    moveUpButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    moveUpButton.left = "60px";
    moveUpButton.top = "-60px";
    advancedTexture.addControl(moveUpButton);

    const moveDownButton = createMoveButton("moveDownButton", "↓", () => moveMesh('down'));
    moveDownButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    moveDownButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    moveDownButton.left = "60px";
    moveDownButton.top = "-10px";
    advancedTexture.addControl(moveDownButton);

    const moveLeftButton = createMoveButton("moveLeftButton", "←", () => moveMesh('left'));
    moveLeftButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    moveLeftButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    moveLeftButton.left = "10px";
    moveLeftButton.top = "-35px";
    advancedTexture.addControl(moveLeftButton);

    const moveRightButton = createMoveButton("moveRightButton", "→", () => moveMesh('right'));
    moveRightButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    moveRightButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    moveRightButton.left = "110px";
    moveRightButton.top = "-35px";
    advancedTexture.addControl(moveRightButton);

    // Add the green button back
    const greenButton = BABYLON.GUI.Button.CreateSimpleButton("greenButton", "Green Button");
    greenButton.width = "150px";
    greenButton.height = "40px";
    greenButton.color = "white";
    greenButton.background = "green";
    greenButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    greenButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    greenButton.paddingRight = "10px";
    greenButton.paddingBottom = "10px";
    greenButton.onPointerClickObservable.add(() => {
        console.log('GreenButton pushed!');
        // Add your green button functionality here
    });
    advancedTexture.addControl(greenButton);

    // Setup event handlers for keyboard inputs
    setupEventHandlers(moveMesh);

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