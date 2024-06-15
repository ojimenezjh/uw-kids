import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import pirateModel from "../assets/enemies/pirate/scene.glb";
import pirateBossModel from "../assets/enemies/pirateBoss/scene.glb";
import skeletonModel from "../assets/enemies/skeleton/scene.glb";
import krakenModel from "../assets/enemies/kraken/scene.glb";

const ENEMY_CONFIG = {
    pirate: {
        modelPath: pirateModel,
        scale: { x: 0.12, y: 0.12, z: 0.12 },
        initialRotation: Math.PI / 1,
        initialPosition: { x: 0, y: 0 }
    },
    pirateBoss: {
        modelPath: pirateBossModel,
        scale: { x: 0.01, y: 0.01, z: 0.01 },
        initialRotation: Math.PI / 1,
        intialPosition: { x: 0, y: 1 }
    },
    skeleton: {
        modelPath: skeletonModel,
        scale: { x: 0.010, y: 0.010, z: 0.10 },
        initialRotation: Math.PI / 1,
        initialPosition: { x: 0, y: 0 }
    },
    kraken: {
        modelPath: krakenModel,
        scale: { x: 0.2, y: 0.2, z: 0.2 },
        initialRotation: Math.PI / 1,
        initialPosition: { x: 0, y: 0.2 }
    }
};

export default class Enemy {
    constructor(scene, manager, type, x, y, z) {
        this.scene = scene;
        this.manager = manager;
        this.type = type;
        this.x = x;
        this.y = y;
        this.z = z;
        this.model = null;
        this.config = ENEMY_CONFIG[type];
    }

    load() {
        if (!this.config) {
            console.error(`Configuration for type ${this.type} not found`);
            return;
        }

        const { modelPath, scale, initialRotation, initialPosition } = this.config;

        new GLTFLoader(this.manager).load(
            modelPath,
            (gltf) => {
                gltf.scene.scale.set(scale.x, scale.y, scale.z);
                gltf.scene.rotation.y = initialRotation;

                const position = initialPosition || { x: this.x, y: this.y };
                gltf.scene.position.set(position.x, position.y, this.z);
                
                this.scene.add(gltf.scene);
                this.model = gltf;
            },
            (progress) => {
                console.log('Loading enemy model...');
            },
            (error) => {
                console.error('Error loading enemy model', error);
            }
        );
    }

    animationData() {
        return this.model;
    }

    update() {
        if (this.model) {
            this.model.scene.rotation.y += 0.1;
        }
    }

    isDefeated() {
        return this.defeated;
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
}
