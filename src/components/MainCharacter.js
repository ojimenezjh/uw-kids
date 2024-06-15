import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import model from "./assets/players/nya/scene.glb";

export default class MainCharacter {
    constructor(scene, manager, x, y, z) {
        this.scene = scene;
        this.manager = manager;
        this.model = null;
        this.x = x;
        this.y = y;
        this.z = z;
    }

    load() {
        return new Promise((resolve, reject) => {
            new GLTFLoader(this.manager).load(
                model,
                (gltf) => {
                    console.log('success');
                    gltf.scene.scale.set(0.6, 0.6, 0.2);
                    gltf.scene.position.set(this.x, this.y, this.z);
                    this.scene.add(gltf.scene);
                    this.model = gltf;
                    resolve();
                },
                undefined,
                (error) => {
                    console.log('Error loading model:', error);
                    reject(error);
                }
            );
        });
    }

    unload() {
        if (this.model) {
            this.scene.remove(this.model.scene);
            this.model.scene.traverse((child) => {
                if (child.isMesh) {
                    child.geometry.dispose();
                    child.material.dispose();
                }
            });
            this.model = null;
        }
    }


    animationData() {
        return this.model;
    }
}
