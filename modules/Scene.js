import { setupCustomShaders } from './Shaders.js';
import { createBox } from './Box.js';
import { createSprite } from './Sprite.js';
import { setupUIManager } from './UIManager.js';
import { loadModels } from './Models.js';
import { World } from './World.js';

export function createScene(engine, canvas) {
    const scene = new BABYLON.Scene(engine);

    // Add a hemispheric light
    const light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 2, 0), scene);
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

    // Create boxes
    const box1 = createBox(scene, "box1", "textures/crate.png", new BABYLON.Vector3(0, -1, 0));
    const box2 = createBox(scene, "box2", "textures/crate.png", new BABYLON.Vector3(2, -1, 0));
    world.addBox(box1);
    world.addBox(box2);

    // Create sprites
    const sprite1 = createSprite(scene, renderer, "?", new BABYLON.Vector3(0, -0.6, -0.8));
    const sprite2 = createSprite(scene, renderer, "R", new BABYLON.Vector3(-0.5, 0.2, -0.2));
    world.addSprite(sprite1);
    world.addSprite(sprite2);

    // Load models
    const meshes = loadModels(scene);
    world.meshes = meshes;

    // Setup UI manager and buttons
    setupUIManager(world);

    return scene;
}