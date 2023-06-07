import './style.css'
import * as THREE from 'three'

/**
 * Scene
 */
const scene = new THREE.Scene()

/**
 * Cube
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshNormalMaterial()

const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

/**
 * render sizes
 */
const temp = {
	width: 1024,
	height: 720,
}
/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
	75,
	temp.width / temp.height,
	0.1,
	10
)

/**
 * renderer
 */
const renderer = new THREE.WebGLRenderer()
renderer.setSize(temp.width, temp.height)
document.body.appendChild(renderer.domElement)

/**
 * muovo indietro la camera
 */
camera.position.z = 4

/**
 * velocità di rotazione radianti al secondo
 */
// const vel = 0.5

/**
 * Three js Clock
 */
const clock = new THREE.Clock()

/**
 * frame loop
 */
function tic() {
	/**
	 * tempo trascorso dal frame precedente
	 */
	// const deltaTime = clock.getDelta()
	/**
	 * tempo totale trascorso dallínizio
	 */
	const time = clock.getElapsedTime()

	mesh.scale.setZ(Math.sin(time * 3) * 0.5 + 1)
	camera.position.y = Math.sin(time * 2) * 2
	camera.position.x = Math.cos(time * 2) * 3
	camera.lookAt(mesh.position)

	renderer.render(scene, camera)

	requestAnimationFrame(tic)
}

requestAnimationFrame(tic)
