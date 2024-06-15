import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Box3, Vector3 } from 'three';
import model from "./assets/scenes/pirates/scene.glb";

export default class Map {
    constructor(scene, manager, gui) {
        this.scene = scene;
        this.manager = manager;
        this.model = null;
        this.gui = gui;
    }

    load() {
        return new Promise((resolve, reject) => {
            new GLTFLoader(this.manager).load(
                model,
                (gltf) => {
                    console.log('Map loaded successfully.');
                    
                    const box = new Box3().setFromObject(gltf.scene);
                    const size = new Vector3();
                    box.getSize(size);
                    
                    const desiredHeight = 50;
                    const scaleFactor = desiredHeight / size.y;

                    gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);

                    gltf.scene.position.y = 0;
                    gltf.scene.position.z = -2.5;

                    this.scene.add(gltf.scene);
                    this.model = gltf;

                    if (this.gui) {
                        const folderName = 'Model Controls';

                        if (this.gui.__folders[folderName]) {
                            const folder = this.gui.__folders[folderName];
                            folder.close();
                            this.gui.removeFolder(folder);
                        }

                        const folder = this.gui.addFolder(folderName);
                        folder.add(gltf.scene.rotation, 'x', 0, Math.PI * 2).name('Rotate X');
                        folder.add(gltf.scene.rotation, 'y', 0, Math.PI * 2).name('Rotate Y');
                        folder.add(gltf.scene.rotation, 'z', 0, Math.PI * 2).name('Rotate Z');
                        folder.add(gltf.scene.scale, 'x', 0, 10).name('Scale X');
                        folder.add(gltf.scene.scale, 'y', 0, 10).name('Scale Y');
                        folder.add(gltf.scene.scale, 'z', 0, 10).name('Scale Z');
                        folder.add(gltf.scene.position, 'x', -100, 100).name('Position X');
                        folder.add(gltf.scene.position, 'y', -100, 100).name('Position Y');
                        folder.add(gltf.scene.position, 'z', -100, 100).name('Position Z');
                        folder.open();
                    }

                    resolve();
                },
                undefined,
                (error) => {
                    console.error('Error loading map:', error);
                    reject(error);
                }
            );
        });
    }

    animationData() {
        return this.model;
    }
}
