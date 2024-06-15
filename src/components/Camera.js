import { PerspectiveCamera } from 'three';
   
export default class Camera extends PerspectiveCamera {
    constructor(fov, width, height) {
        super(fov, width / height, 0.1, 10000)

        this.width = width
        this.height = height
        this.updateSize();
        window.addEventListener('resize', () => this.updateSize(), false);
    }

    updateSize() {
        // Aspect ratio of camera
        this.aspect = window.innerWidth / window.innerHeight;
        this.updateProjectionMatrix();
    }


}