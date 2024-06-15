import { AnimationMixer } from 'three';

export default class Animation {
    constructor(gltf) {
        this.gltf = gltf
        this.mixer = new AnimationMixer(this.gltf.scene)
    }

    playAnim(animation) {
        this.animation = animation
        this.mixer.clipAction(this.animation).play()
    }

    update(delta) {
        if (this.mixer) {
            this.mixer.update(delta)
        }
    }
}