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
const vel = 0.5

// let time = Date.now()
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
	// const currentTime = Date.now()
	/**
	 * tempo trascorso dal frame precedente
	 */
	// const deltaTime = (currentTime - time) / 1000
	const deltaTime = clock.getDelta()
	/**
	 * tempo totale trascorso dallínizio
	 */
	const time = clock.getElapsedTime()

	// time = currentTime
	// console.log(time)

	camera.position.y = Math.sin(time * 2)
	camera.lookAt(mesh.position)

	// console.log(deltaTime)
	// mesh.rotation.x += vel * deltaTime
	// mesh.rotation.y += vel * deltaTime

	renderer.render(scene, camera)

	requestAnimationFrame(tic)
}

requestAnimationFrame(tic)

/**
 * animazione in ingresso del cubo
 */
function pop() {
	gsap.to(mesh.scale, { duration: 2, x: 1, y: 1, z: 1 })
	gsap.to(mesh.rotation, { duration: 1, x: 3.14, y: 3.14 })
}

pop()

/**
 * invoca la funzione pop al click sulla viewport
 */
// window.addEventListener('click', pop)
