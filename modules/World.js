export class World {
    constructor(scene, camera, engine) {
        this.scene = scene;
        this.camera = camera;
        this.engine = engine;
        this.sprites = [];
        this.meshes = {};
        this.boxes = [];
        this.cameras = {};
    }

    addSprite(sprite) {
        this.sprites.push(sprite);
    }

    addMesh(name, mesh) {
        this.meshes[name] = mesh;
    }

    addBox(box) {
        this.boxes.push(box);
    }

    addCamera(name, camera) {
        this.cameras[name] = camera;
    }
}