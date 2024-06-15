import { BoxGeometry, MeshBasicMaterial, Mesh, LoadingManager, TextureLoader } from "three"
import texture from "./textures/transparent.png"

export default class Wall extends Mesh {

    constructor() {
        const loadingManager = new LoadingManager()
        const textureLoader = new TextureLoader(loadingManager)
        const colorTexture = textureLoader.load(texture)
        super(new BoxGeometry(5, 200, 0.5), new MeshBasicMaterial({ transparent: true, alphaMap: colorTexture }))
    }
    setWall(x) {
        this.rotation.y = Math.PI / 2
        this.rotation.z = Math.PI / 2
        this.position.x = x
        this.position.z = 90
    }
    backWall(z) {
        this.rotation.z = Math.PI / 2
        this.position.x = 0
        this.position.z = z
    }
}
