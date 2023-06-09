import './style.css'
import * as THREE from 'three'
import { ArcballControls } from 'three/examples/jsm/controls/ArcballControls'
import { MathUtils } from 'three'

/**
 * Scene
 */
const scene = new THREE.Scene()

/**
 * Manhattan
 */
const material = new THREE.MeshPhysicalMaterial({ color: 0x7744cb })

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

const mouse = new THREE.Vector2(0, 0)
let factor = 0

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
const fov = 90
const camera = new THREE.PerspectiveCamera(fov, sizes.width / sizes.height, 0.1)

camera.position.set(10, 10, 10)
camera.lookAt(new THREE.Vector3(0, 2.5, 0))

/**
 * renderer
 */
const renderer = new THREE.WebGLRenderer({
	antialias: window.devicePixelRatio < 2,
	logarithmicDepthBuffer: true,
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
 * ArcballControls
 */

// const controls = new ArcballControls(camera, renderer.domElement, scene)
// controls.enableAnimations = true
// controls.dampingFactor = 3
// // controls.focusAnimationTime = 3
// console.log(controls.scaleFactor)
// controls.scaleFactor = 1.05

/**
 * velocità di rotazione radianti al secondo
 */
// const vel = 0.5

/**
 * Three js Clock
 */
const clock = new THREE.Clock()

const light = new THREE.PointLight(0xffffff, 2.5)
light.position.set(size * 1.5, size * 4, size * 1.5)
scene.add(light)

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
	const time = clock.getElapsedTime()
	// let factor = Math.abs(Math.sin(time))
	factor = MathUtils.lerp(factor, mouse.x * 0.99 - 0.01 / 2, 0.1)
	let fov1 = camera.fov
	let fov2 = (1 - factor) * fov
	camera.fov = fov2

	const d = camera.position
		.clone()
		.multiplyScalar(
			Math.sin(MathUtils.degToRad(fov1 / 2)) /
				Math.sin(MathUtils.degToRad(fov2 / 2))
		)

	// // console.log(d)

	camera.position.copy(d)
	// // // console.log(factor)
	camera.lookAt(new THREE.Vector3(0, 2.5, 0))
	camera.updateProjectionMatrix()

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

window.addEventListener('mousemove', function (e) {
	mouse.x = e.pageX / window.innerWidth
	mouse.y = e.pageY / window.innerHeight
})
