import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'

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
	10
)

/**
 * renderer
 */
const renderer = new THREE.WebGLRenderer()
renderer.setSize(sizes.width, sizes.height)
document.body.appendChild(renderer.domElement)

/**
 * muovo indietro la camera
 */
camera.position.z = 4

/**
 * velocità di rotazione radianti al secondo
 */
const vel = 0.5

/**
 * Three js Clock
 */
const clock = new THREE.Clock()

/**
 * scala iniziale del cubo per l;animazione in ingresso
 */
mesh.scale.multiplyScalar(0)

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

/**
 * animazione in ingresso del cubo
 */
function pop() {
	mesh.scale.set(0, 0)
	gsap.to(mesh.scale, { duration: 1, x: 1, y: 1 })
	gsap.to(mesh.rotation, { duration: 1, x: 3.14, y: 3.14 })
}

pop()

/**
 * invoca la funzione pop al click sulla viewport
 */
window.addEventListener('click', pop)

window.addEventListener('resize', () => {
	// update sizes
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	// update camera
	camera.aspect = sizes.width / sizes.height
	// update projection matrix
	camera.updateProjectionMatrix()

	// update renderer
	renderer.setSize(sizes.width, sizes.height)
})

const pixelRatio = Math.min(window.devicePixelRatio, 2)
renderer.setPixelRatio(pixelRatio)
