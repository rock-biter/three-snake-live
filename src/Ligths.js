import { AmbientLight, DirectionalLight } from 'three'
import { resolution } from './Params'

const ambLight = new AmbientLight(0xffffff, 0.6)
const dirLight = new DirectionalLight(0xffffff, 0.7)

dirLight.position.set(20, 20, 18)
dirLight.target.position.set(resolution.x / 2, 0, resolution.y / 2)
dirLight.shadow.mapSize.set(1024, 1024)
dirLight.shadow.radius = 7
dirLight.shadow.blurSamples = 20
dirLight.shadow.camera.top = 30
dirLight.shadow.camera.bottom = -30
dirLight.shadow.camera.left = -30
dirLight.shadow.camera.right = 30

dirLight.castShadow = true

const lights = [dirLight, ambLight]

export default lights
