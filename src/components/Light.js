import { HemisphereLight, DirectionalLight } from "three"

export default class Light {

    constructor(scene) {
        this.scene = scene

        this.light = new HemisphereLight(0xeedddd, 0x331111, 1.5);
        // this.light = new HemisphereLight(0xbb9988, 0x554422, 2);
        this.light.position.y = 20

        this.dirLight = new DirectionalLight(0xbb9988, 0.5);
        this.dirLight.position.y = 10
        this.dirLight.position.z = 20
        // this.dirLight.castShadow = true

        this.init()

    }

    init() {
        this.scene.add(this.light)
        this.scene.add(this.dirLight)
    }

}
