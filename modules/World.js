export class World {
    constructor(scene, camera, engine) {
        this.scene = scene;
        this.camera = camera;
        this.engine = engine;
        this.sprites = [];
        this.meshes = {};
        this.box = null;
    }

    addSprite(sprite) {
        this.sprites.push(sprite);
    }

    addMesh(name, mesh) {
        this.meshes[name] = mesh;
    }

    setBox(box) {
        this.box = box;
    }
}