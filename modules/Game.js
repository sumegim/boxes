import { createScene } from './Scene.js';

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.engine = null;
        this.scene = null;
        this.sceneToRender = null;
    }

    async start() {
        this.engine = await this.createDefaultEngine();
        if (!this.engine) throw 'Engine should not be null.';
        this.startRenderLoop();
        this.scene = createScene(this.engine, this.canvas);
        this.sceneToRender = this.scene;
    }

    createDefaultEngine() {
        return new BABYLON.Engine(this.canvas, true, {
            preserveDrawingBuffer: true,
            stencil: true,
            disableWebGL2Support: false
        });
    }

    startRenderLoop() {
        this.engine.runRenderLoop(() => {
            if (this.sceneToRender && this.sceneToRender.activeCamera) {
                this.sceneToRender.render();
            }
        });

        window.addEventListener('resize', () => {
            this.engine.resize();
        });
    }
}