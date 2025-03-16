import { setupCustomShaders } from './Shaders.js';
import { createBox } from './Box.js';
import { createSprite } from './Sprite.js';
import { setupUIManager } from './UIManager.js';
import { loadModels } from './Models.js';
import { World } from './World.js';
import { createChessboard } from './Chessboard.js';

export function createScene(engine, canvas) {
    const scene = new BABYLON.Scene(engine);

    // Add multiple directional lights with different colors
    const light1 = new BABYLON.DirectionalLight("DirectionalLight1", new BABYLON.Vector3(-1, -2, -1), scene);
    light1.intensity = 1;
    light1.diffuse = new BABYLON.Color3(1, 0.5, 0.5); // Red-ish light

    const light2 = new BABYLON.DirectionalLight("DirectionalLight2", new BABYLON.Vector3(1, -2, -1), scene);
    light2.intensity = 0.5;
    light2.diffuse = new BABYLON.Color3(1, 1, 1); // White light

    const light3 = new BABYLON.DirectionalLight("DirectionalLight3", new BABYLON.Vector3(-1, -2, 1), scene);
    light3.intensity = 0.5;
    light3.diffuse = new BABYLON.Color3(1, 1, 1); // White light

    const light4 = new BABYLON.DirectionalLight("DirectionalLight4", new BABYLON.Vector3(1, -2, 1), scene);
    light4.intensity = 0.5;
    light4.diffuse = new BABYLON.Color3(1, 1, 1); // White light

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