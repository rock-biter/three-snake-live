import './style.css'
import * as THREE from 'three'
import { ArcballControls } from 'three/examples/jsm/controls/ArcballControls'

/**
 * Scene
 */
const scene = new THREE.Scene()

/**
 * Manhattan
 */
const material = new THREE.MeshNormalMaterial()

const size = 6

for (let i = 0; i < size; i++) {
	for (let j = 0; j < size; j++) {
		const height = Math.random() * 4 + 1

		const geometry = new THREE.BoxGeometry(1, height, 1)

		const mesh = new THREE.Mesh(geometry, material)
		mesh.position.set(-size + i * 2, height / 2, -size + j * 2)
		scene.add(mesh)
	}
}

/**
 * render sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
}
/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	50
)

camera.position.set(8, 8, 8)
camera.lookAt(new THREE.Vector3())

/**
 * renderer
 */
const renderer = new THREE.WebGLRenderer({
	antialias: window.devicePixelRatio < 2,
})
renderer.setSize(sizes.width, sizes.height)

const pixelRatio = Math.min(window.devicePixelRatio, 2)
renderer.setPixelRatio(pixelRatio)
document.body.appendChild(renderer.domElement)

/**
 * muovo indietro la camera
 */
// camera.position.z = 4

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
	 * tempo totale trascorso dall'inizio
	 */
	// const time = clock.getElapsedTime()

	renderer.render(scene, camera)

	requestAnimationFrame(tic)
}

requestAnimationFrame(tic)

window.addEventListener('resize', onResize)

function onResize() {
	console.log('resize')
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()

	renderer.setSize(sizes.width, sizes.height)

	const pixelRatio = Math.min(window.devicePixelRatio, 2)
	renderer.setPixelRatio(pixelRatio)
}

// console.log(window.devicePixelRatio)
