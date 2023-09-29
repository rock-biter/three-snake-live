import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'lil-gui'
import Snake from './src/Snake'
import Candy from './src/Candy'

/**
 * Debug
 */
// const gui = new dat.GUI()

const resolution = new THREE.Vector2(10, 10)

/**
 * Scene
 */
const scene = new THREE.Scene()

/**
 * Cube
 */
// const material = new THREE.MeshNormalMaterial()
// const geometry = new THREE.BoxGeometry(1, 1, 1)

// const mesh = new THREE.Mesh(geometry, material)
// scene.add(mesh)

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
const fov = 60
const camera = new THREE.PerspectiveCamera(fov, sizes.width / sizes.height, 0.1)
camera.position.set(resolution.x / 2, 8, resolution.y / 2 + 6)
camera.lookAt(new THREE.Vector3(0, 2.5, 0))

/**
 * Show the axes of coordinates system
 */
const axesHelper = new THREE.AxesHelper(3)
scene.add(axesHelper)

/**
 * renderer
 */
const renderer = new THREE.WebGLRenderer({
	antialias: window.devicePixelRatio < 2,
	logarithmicDepthBuffer: true,
})
document.body.appendChild(renderer.domElement)
handleResize()

/**
 * OrbitControls
 */
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.target.set(resolution.x / 2, 0, resolution.y / 2)

/**
 * Three js Clock
 */
// const clock = new THREE.Clock()

/**
 * Grid
 */

const planeGeometry = new THREE.PlaneGeometry(
	resolution.x,
	resolution.y,
	resolution.x,
	resolution.y
)
planeGeometry.rotateX(-Math.PI * 0.5)
const planeMaterial = new THREE.MeshNormalMaterial({ wireframe: true })
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.position.x = resolution.x / 2 - 0.5
plane.position.z = resolution.y / 2 - 0.5
scene.add(plane)

// create snake
const snake = new Snake({ scene, resolution })
console.log(snake)

// window.addEventListener('click', function () {
// 	!isRunning ? startGame() : stopGame()
// 	// console.log(isRunning)
// })

// keyboard
window.addEventListener('keyup', function (e) {
	console.log(e.code)
	const keyCode = e.code

	if (keyCode === 'Space') {
		!isRunning ? startGame() : stopGame()
	}

	snake.setDirection(keyCode)
})

let isRunning

function startGame() {
	if (!isRunning) {
		isRunning = setInterval(() => {
			snake.update()
		}, 250)
	}
}

startGame()

function stopGame() {
	clearInterval(isRunning)
	isRunning = null
}

function resetGame() {}

const candies = []

function addCandy() {
	const candy = new Candy(resolution)

	let index
	do {
		index = Math.floor(Math.random() * resolution.x * resolution.y)
	} while (snake.indexes.includes(index))

	candy.mesh.position.x = index % resolution.x
	candy.mesh.position.z = Math.floor(index / resolution.x)

	candies.push(candy)

	console.log(index, candy.getIndexByCoord())

	scene.add(candy.mesh)
}

addCandy()

// snake.addTailNode()

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

	controls.update()

	renderer.render(scene, camera)

	requestAnimationFrame(tic)
}

requestAnimationFrame(tic)

window.addEventListener('resize', handleResize)

function handleResize() {
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()

	renderer.setSize(sizes.width, sizes.height)

	const pixelRatio = Math.min(window.devicePixelRatio, 2)
	renderer.setPixelRatio(pixelRatio)
}
