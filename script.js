// Get the canvas element
var canvas = document.getElementById("renderCanvas");

// Function to start the render loop
var startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}

// Initialize engine and scene variables
var engine = null;
var scene = null;
var sceneToRender = null;

// Function to create the default engine
var createDefaultEngine = function() { 
    return new BABYLON.Engine(canvas, true, { 
        preserveDrawingBuffer: true, 
        stencil: true,  
        disableWebGL2Support: false
    }); 
};

// Function to create the scene
var createScene = function() {
    var scene = new BABYLON.Scene(engine);

    // Add a hemispheric light
    var light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 2, 0), scene);
    light.intensity = 2.0; // Adjust the light intensity if needed

    // Add an arc rotate camera
    var camera = new BABYLON.ArcRotateCamera("Camera", - Math.PI / 1.5, Math.PI / 3, 4, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    // Set smoother zoom with mouse scrolling
    camera.wheelPrecision = 400; // Increase this value for smoother zoom

    // Enable depth renderer
    var renderer = scene.enableDepthRenderer(camera, true);    

    // Custom shaders
    setupCustomShaders();

    // Create boxes
    createBox(scene, "box", "textures/crate.png", new BABYLON.Vector3(0, -1, 0));
    // createBox(scene, "box2", "textures/crate.png", new BABYLON.Vector3(-1.5, 0, -2));

    // Create sprites
    var sprite1 = createSprite(scene, renderer, "1", new BABYLON.Vector3(0, -0.6, -0.8));
    var sprite2 = createSprite(scene, renderer, "56", new BABYLON.Vector3(-0.5, 0.2, -0.2));

    // Setup UI manager and buttons
    setupUIManager(scene, sprite1, sprite2, camera);

    // Load fish models
    // loadFishModels(scene);

    // Load HDRI environment texture
    // var hdrTexture = new BABYLON.HDRCubeTexture("textures/hdri/studio_country_hall_4k.hdr", scene, 512, false, true, BABYLON.Texture.BILINEAR_SAMPLINGMODE, function() {
    //     console.log("HDRI texture loaded successfully");
    // }, function(message) {
    //     console.error("Failed to load HDRI texture: " + message);
    // });
    // hdrTexture.level = 1.0; // Adjust the intensity of the HDRI texture
    // scene.environmentTexture = hdrTexture;

    // // Create a skybox to visualize the HDRI texture
    // var skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene);
    // var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    // skyboxMaterial.backFaceCulling = false;
    // skyboxMaterial.reflectionTexture = hdrTexture.clone();
    // skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    // skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    // skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    // skybox.material = skyboxMaterial;

    BABYLON.SceneLoader.ImportMesh(
        "",
        "objects/",
        "pawn.obj",
        scene,
        function (meshes) {
            // The meshes array contains all the loaded meshes
            console.log("Meshes loaded:", meshes);
            meshes.forEach(function (mesh) {
                mesh.scaling = new BABYLON.Vector3(0.2, 0.2, 0.2); // Scale to 20%
                mesh.position = new BABYLON.Vector3(0, -0.55, 0);
                mesh.rotation = new BABYLON.Vector3(0, Math.PI, 0);

                // Create a PBR material for the mesh
                var pbr = new BABYLON.PBRMaterial("pawnMat", scene);
                pbr.metallic = 1.0; // Fully metallic
                pbr.roughness = 0.45; // Adjust roughness as needed
                pbr.albedoColor = new BABYLON.Color3(1, 0.6, 0.7);
                pbr.reflectivityColor = new BABYLON.Color3(1, 1, 1); // Reflectivity color

                mesh.material = pbr;
            });
        },
        null,
        function (scene, message, exception) {
            console.error("An error occurred while loading the object file:", message, exception);
        }
    );

    return scene;
}

// Function to setup custom shaders
function setupCustomShaders() {
    BABYLON.Effect.ShadersStore["customVertexShader"] = `   
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 worldViewProjection;
        varying vec2 vUV;
        void main(void) {
            gl_Position = worldViewProjection * vec4(position, 1.0);
            vUV = uv;
        }`;

    BABYLON.Effect.ShadersStore["customFragmentShader"] = `
        precision highp float;
        varying vec2 vUV;
        uniform vec2 screenSize;
        uniform sampler2D textureSampler;
        uniform highp sampler2D depth;
        void main(void) {
            vec2 coords = gl_FragCoord.xy / screenSize;
            float distanceToCenter = length(vUV - vec2(0.5,0.5));
            float d = texture2D(depth, coords).x;
            float z = gl_FragCoord.z;
            float a = z > d ? 0.3 : 1.0;
            a = distanceToCenter < 0.5 ? a : 0.0;
            float plop = distanceToCenter < 0.45 ? 1.0 : .8;
            gl_FragColor = vec4(texture2D(textureSampler, vUV).xyz * plop, a);
        }`;
}

// Function to create a box
function createBox(scene, name, texturePath, position) {
    var boxMaterial = new BABYLON.StandardMaterial(name, scene);
    boxMaterial.diffuseTexture = new BABYLON.Texture(texturePath, scene);

    var box = BABYLON.MeshBuilder.CreateBox(name, {}, scene);
    box.material = boxMaterial;
    box.position = position;
}

// Function to create a sprite
function createSprite(scene, renderer, text, position) {
    var tex = new BABYLON.DynamicTexture("name", {width: 256, height: 256}, scene);
    var font = "bold 124px monospace";
    tex.drawText(text, null, null, font, "black", "white", true, true);

    var spriteMaterial = new BABYLON.ShaderMaterial("mat", scene, {
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

    var sprite = new BABYLON.MeshBuilder.CreatePlane("sprite", { size: 0.3, sideOrientation: BABYLON.Mesh.BACKSIDE }, scene);
    sprite.material = spriteMaterial;
    sprite.position = position;

    return sprite;
}

// Function to setup UI manager and buttons
function setupUIManager(scene, sprite1, sprite2, camera) {
    var manager = new BABYLON.GUI.GUI3DManager(scene);

    var pushButton1 = new BABYLON.GUI.MeshButton3D(sprite1, "pushButton1");
    pushButton1.onPointerClickObservable.add(() => {
        console.log('PushButton1 pushed!');
        showFloatingMessage("Hello World", scene, sprite1.position, camera);
    });
    pushButton1.onPointerEnterObservable.add(() => {
        sprite1.material.setTexture("textureSampler", createDynamicTexture(scene, "1", "red"));
    });
    pushButton1.onPointerOutObservable.add(() => {
        sprite1.material.setTexture("textureSampler", createDynamicTexture(scene, "1", "white"));
    });
    manager.addControl(pushButton1);

    var pushButton2 = new BABYLON.GUI.MeshButton3D(sprite2, "pushButton2");
    pushButton2.onPointerClickObservable.add(() => {
        console.log('PushButton2 pushed!');
    });
    manager.addControl(pushButton2);

    scene.onBeforeRenderObservable.add(() => {
        sprite1.material.setVector2("screenSize", new BABYLON.Vector2(engine.getRenderWidth(), engine.getRenderHeight()));
    });

    [sprite1, sprite2].forEach((sprite) => {
        sprite.onBeforeRenderObservable.add(() => {
            var pos = sprite.position.clone();
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

// Function to create a dynamic texture
function createDynamicTexture(scene, text, color) {
    var tex = new BABYLON.DynamicTexture("dynamicTexture", {width: 256, height: 256}, scene);
    var font = "bold 124px monospace";
    tex.drawText(text, null, null, font, "black", color, true, true);
    return tex;
}

// Function to show a floating message
function showFloatingMessage(message, scene, position, camera) {
    var tex = new BABYLON.DynamicTexture("messageTexture", {width: 512, height: 256}, scene);
    var font = "bold 44px monospace";
    tex.drawText(message, null, 200, font, "black", "white", true, true);

    var messageMaterial = new BABYLON.StandardMaterial("messageMat", scene);
    messageMaterial.diffuseTexture = tex;
    messageMaterial.backFaceCulling = false;

    var messageSprite = new BABYLON.MeshBuilder.CreatePlane("messageSprite", { width: 1, height: 0.5 }, scene);
    messageSprite.material = messageMaterial;
    messageSprite.position = position.clone();
    messageSprite.position.y += 0.5;

    messageSprite.onBeforeRenderObservable.add(() => {
        messageSprite.lookAt(camera.position);
    });

    setTimeout(() => {
        messageSprite.dispose();
    }, 2000);
}

// Function to load fish models
function loadFishModels(scene) {
    var assetsManager = new BABYLON.AssetsManager(scene);

    var fishTask = assetsManager.addMeshTask("fish task", "", "https://assets.babylonjs.com/meshes/", "fish.glb");
    fishTask.onSuccess = function (task) {
        task.loadedMeshes.forEach(function (mesh) {
            mesh.position = new BABYLON.Vector3(-2, -2, -2);
            mesh.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
        });
    };

    assetsManager.load();
}

// Initialize the engine and create the scene
window.initFunction = async function() {
    var asyncEngineCreation = async function() {
        try {
            return createDefaultEngine();
        } catch(e) {
            console.log("The available createEngine function failed. Creating the default engine instead");
            return createDefaultEngine();
        }
    }

    window.engine = await asyncEngineCreation();

    if (!engine) throw 'Engine should not be null.';
    startRenderLoop(engine, canvas);
    window.scene = createScene();
};

// Start the initialization
initFunction().then(() => { sceneToRender = scene; });

// Resize the engine on window resize
window.addEventListener("resize", function () {
    engine.resize();
});