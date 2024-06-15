import { WebGLRenderer } from 'three';

export default class Renderer extends WebGLRenderer {
    constructor(scene, container) {

        super({ antialias: true })

        this.scene = scene;
        this.container = container;
        this.container.appendChild(this.domElement);
        this.updateSize();

        document.addEventListener('DOMContentLoaded', () => this.updateSize(), false);
        window.addEventListener('resize', () => {
            this.updateSize()
        }, false);
    }

    updateSize() {
        this.setSize(window.innerWidth, window.innerHeight);
    }

    render(scene, camera) {
        this.threeRenderer.render(scene, camera);
    }
}