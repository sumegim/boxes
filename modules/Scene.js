import { setupCustomShaders } from './Shaders.js';
import { createBox } from './Box.js';
import { createSprite } from './Sprite.js';
import { setupUIManager } from './UIManager.js';
import { loadModels } from './Models.js';
import { World } from './World.js';
import { createChessboard } from './Chessboard.js';

export function createScene(engine, canvas) {
    const scene = new BABYLON.Scene(engine);

    // Add a hemispheric light
    const light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(15, 20, 0), scene);
    light.intensity = 2.0;

    // Add an arc rotate camera
    const camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 1.5, Math.PI / 3, 4, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    camera.wheelPrecision = 400;

    // Enable depth renderer
    const renderer = scene.enableDepthRenderer(camera, true);

    // Custom shaders
    setupCustomShaders();

    // Create the world object
    const world = new World(scene, camera, engine);

    // Add cameras to the world
    world.addCamera("mainCamera", camera);

    // Create chessboard
    createChessboard(scene, world);

    // Create sprites
    const sprite1 = createSprite(scene, renderer, "?", new BABYLON.Vector3(3, 0.5, 0));
    const sprite2 = createSprite(scene, renderer, "R", new BABYLON.Vector3(-3, 0.5, 0));
    world.addSprite(sprite1);
    world.addSprite(sprite2);

    // Load models
    const meshes = loadModels(scene);
    world.meshes = meshes;

    // Setup UI manager and buttons
    setupUIManager(world);

    // Add event listener to switch camera positions
    window.addEventListener('keydown', (event) => {
        switch (event.key) {
            case '1':
                // Main camera position
                camera.setPosition(new BABYLON.Vector3(4, 4, 4));
                camera.setTarget(BABYLON.Vector3.Zero());
                camera.attachControl(canvas, true);
                break;
            case '2':
                // Bird's eye view position
                camera.setPosition(new BABYLON.Vector3(0, 20, 0));
                camera.setTarget(BABYLON.Vector3.Zero());
                camera.detachControl(canvas); // Disable camera controls
                break;
        }
    });

    return scene;
}