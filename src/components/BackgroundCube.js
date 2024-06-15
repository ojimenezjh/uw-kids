import {
    BoxGeometry,
    MeshBasicMaterial,
    Mesh,
    LoadingManager,
    TextureLoader,
    NearestFilter,
    DoubleSide
} from "three"
import textTwo from "./textures/barren_dn.jpg"
import textOne from "./textures/barren_up.jpg"
import textThree from "./textures/barren_rt.jpg"
import textTop from "./textures/barren_ft.jpg"
import textBot from "./textures/barren_bk.jpg"
import textFour from "./textures/barren_lf.jpg"

export default class BackgroundCube extends Mesh {
    constructor() {
        const cubeTextures = []
        const loadingManager = new LoadingManager()
        const textureLoader = new TextureLoader(loadingManager)
        const twoTexture = textureLoader.load(textTwo)
        const oneTexture = textureLoader.load(textOne)
        const threeTexture = textureLoader.load(textThree)
        const topTexture = textureLoader.load(textTop)
        const botTexture = textureLoader.load(textBot)
        const fourTexture = textureLoader.load(textFour)
        topTexture.magFilter = NearestFilter
        cubeTextures.push(new MeshBasicMaterial({ map: topTexture, side: DoubleSide }))
        cubeTextures.push(new MeshBasicMaterial({ map: botTexture, side: DoubleSide }))
        cubeTextures.push(new MeshBasicMaterial({ map: oneTexture, side: DoubleSide }))
        cubeTextures.push(new MeshBasicMaterial({ map: twoTexture, side: DoubleSide }))
        cubeTextures.push(new MeshBasicMaterial({ map: threeTexture, side: DoubleSide }))
        cubeTextures.push(new MeshBasicMaterial({ map: fourTexture, side: DoubleSide }))
        super(new BoxGeometry(1000, 1000, 1000), cubeTextures)
    }
}