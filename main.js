import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'lil-gui'
import Snake from './src/Snake'
import Candy from './src/Candy'
import Rock from './src/Rock'
import Tree from './src/Tree'
import lights from './src/Ligths'
import { resolution } from './src/Params'
import gsap from 'gsap'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import fontSrc from 'three/examples/fonts/helvetiker_bold.typeface.json?url'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import Entity from './src/Entity'

const loader = new FontLoader()
let font

loader.load(fontSrc, function (loadedFont) {
	font = loadedFont

	printScore()
})

/**
 * Debug
 */
// const gui = new dat.GUI()

let score = 0

// const resolution = new THREE.Vector2(20, 20)
const gridHelper = new THREE.GridHelper(
	resolution.x,
	resolution.y,
	0xffffff,
	0xffffff
)
gridHelper.position.set(resolution.x / 2 - 0.5, -0.49, resolution.y / 2 - 0.5)
gridHelper.material.transparent = true
gridHelper.material.opacity = 0.3
/**
 * Scene
 */
const scene = new THREE.Scene()
scene.background = new THREE.Color('#d68a4c')

scene.fog = new THREE.Fog('#d68a4c', 25, 50)

scene.add(gridHelper)

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
camera.position.set(
	-8 + resolution.x / 2,
	resolution.x / 2 + 4,
	resolution.y + 6
)
// camera.lookAt(new THREE.Vector3(0, 2.5, 0))

/**
 * Show the axes of coordinates system
 */
const axesHelper = new THREE.AxesHelper(3)
// scene.add(axesHelper)

/**
 * renderer
 */
const renderer = new THREE.WebGLRenderer({
	antialias: window.devicePixelRatio < 2,
	logarithmicDepthBuffer: true,
})
document.body.appendChild(renderer.domElement)
handleResize()

renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.2
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.VSMShadowMap

/**
 * OrbitControls
 */
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.enableZoom = false
controls.enablePan = false
controls.enableRotate = false
controls.target.set(resolution.x / 2 - 2, 0, resolution.y / 2 + 2)

/**
 * Three js Clock
 */
// const clock = new THREE.Clock()

/**
 * Grid
 */

const planeGeometry = new THREE.PlaneGeometry(
	resolution.x * 50,
	resolution.y * 50
)
planeGeometry.rotateX(-Math.PI * 0.5)
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xff7438 })
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.position.x = resolution.x / 2 - 0.5
plane.position.z = resolution.y / 2 - 0.5
plane.position.y = -0.5
scene.add(plane)

plane.receiveShadow = true

// create snake
const snake = new Snake({ scene, resolution })
// console.log(snake)

snake.addEventListener('updated', function () {
	// constrolla le self collision

	if (snake.checkSelfCollision() || snake.checkEntitiesCollision(entities)) {
		snake.die()
		resetGame()
	}

	// controllo se mangia
	const headIndex = snake.indexes.at(-1)
	const candyIndex = candies.findIndex(
		(candy) => candy.getIndexByCoord() === headIndex
	)
	// console.log(headIndex, candyIndex)
	if (candyIndex >= 0) {
		const candy = candies[candyIndex]
		scene.remove(candy.mesh)
		candies.splice(candyIndex, 1)
		snake.body.head.data.candy = candy
		addCandy()
		score += candy.points
		// console.log(candies)
		printScore()
	}
})

let scoreEntity

function printScore() {
	if (!font) {
		return
	}

	if (!score) {
		score = 0
	}

	if (scoreEntity) {
		scene.remove(scoreEntity.mesh)
		scoreEntity.mesh.geometry.dispose()
		scoreEntity.mesh.material.dispose()
	}

	const geometry = new TextGeometry(`${score}`, {
		font: font,
		size: 3,
		height: 1,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 0.1,
		bevelSize: 0.1,
		bevelOffset: 0,
		bevelSegments: 5,
	})

	geometry.center()

	const mesh = new THREE.Mesh(
		geometry,
		snake.body.head.data.mesh.material.clone()
	)

	mesh.position.x = resolution.x / 2 - 0.5
	mesh.position.z = -4
	mesh.position.y = 1.8

	mesh.castShadow = true

	scoreEntity = new Entity(mesh, resolution, { size: 0.8, number: 0.3 })

	console.log('font mesh:', mesh)

	scoreEntity.in()
	scene.add(scoreEntity.mesh)
}

// window.addEventListener('click', function () {
// 	!isRunning ? startGame() : stopGame()
// 	// console.log(isRunning)
// })

// keyboard
window.addEventListener('keyup', function (e) {
	// console.log(e.code)
	const keyCode = e.code

	snake.setDirection(keyCode)

	if (keyCode === 'Space') {
		!isRunning ? startGame() : stopGame()
	} else if (!isRunning) {
		startGame()
	}
})

let isRunning

function startGame() {
	if (!isRunning) {
		isRunning = setInterval(() => {
			snake.update()
		}, 240)
	}
}

// startGame()

function stopGame() {
	clearInterval(isRunning)
	isRunning = null
}

function resetGame() {
	stopGame()
	score = 0

	let candy = candies.pop()
	while (candy) {
		scene.remove(candy.mesh)
		candy = candies.pop()
	}

	let entity = entities.pop()
	while (entity) {
		scene.remove(entity.mesh)
		entity = entities.pop()
	}

	addCandy()
	generateEntities()
}

const candies = []
const entities = []

function addCandy() {
	const candy = new Candy(resolution)

	let index = getFreeIndex()

	candy.mesh.position.x = index % resolution.x
	candy.mesh.position.z = Math.floor(index / resolution.x)

	candies.push(candy)

	// console.log(index, candy.getIndexByCoord())
	candy.in()

	scene.add(candy.mesh)
}

addCandy()

function getFreeIndex() {
	let index
	let candyIndexes = candies.map((candy) => candy.getIndexByCoord())
	let entityIndexes = entities.map((entity) => entity.getIndexByCoord())

	do {
		index = Math.floor(Math.random() * resolution.x * resolution.y)
	} while (
		snake.indexes.includes(index) ||
		candyIndexes.includes(index) ||
		entityIndexes.includes(index)
	)

	return index
}

function addEntity() {
	const entity =
		Math.random() > 0.5 ? new Rock(resolution) : new Tree(resolution)

	let index = getFreeIndex()

	entity.mesh.position.x = index % resolution.x
	entity.mesh.position.z = Math.floor(index / resolution.x)

	entities.push(entity)

	// console.log(index, entity.getIndexByCoord())

	scene.add(entity.mesh)
}

function generateEntities() {
	for (let i = 0; i < 20; i++) {
		addEntity()
	}

	entities.sort((a, b) => {
		const c = new THREE.Vector3(
			resolution.x / 2 - 0.5,
			0,
			resolution.y / 2 - 0.5
		)

		const distanceA = a.position.clone().sub(c).length()
		const distanceB = b.position.clone().sub(c).length()

		return distanceA - distanceB
	})

	gsap.from(
		entities.map((entity) => entity.mesh.scale),
		{
			x: 0,
			y: 0,
			z: 0,
			duration: 1,
			ease: 'elastic.out(1.5, 0.5)',
			stagger: {
				grid: [20, 20],
				amount: 0.7,
			},
		}
	)
}

generateEntities()

scene.add(...lights)

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

// add entities out of the grid
const treeData = [
	new THREE.Vector4(-5, 0, 10, 1),
	new THREE.Vector4(-6, 0, 15, 1.2),
	new THREE.Vector4(-5, 0, 16, 0.8),
	new THREE.Vector4(-10, 0, 4, 1.3),
	new THREE.Vector4(-5, 0, -3, 2),
	new THREE.Vector4(-4, 0, -4, 1.5),
	new THREE.Vector4(-2, 0, -15, 1),
	new THREE.Vector4(5, 0, -20, 1.2),
	new THREE.Vector4(24, 0, -12, 1.2),
	new THREE.Vector4(2, 0, -6, 1.2),
	new THREE.Vector4(3, 0, -7, 1.8),
	new THREE.Vector4(1, 0, -9, 1.0),
	new THREE.Vector4(15, 0, -8, 1.8),
	new THREE.Vector4(17, 0, -9, 1.1),
	new THREE.Vector4(18, 0, -7, 1.3),
	new THREE.Vector4(24, 0, -1, 1.3),
	new THREE.Vector4(26, 0, 0, 1.8),
	new THREE.Vector4(32, 0, 0, 1),
	new THREE.Vector4(28, 0, 6, 1.7),
	new THREE.Vector4(24, 0, 15, 1.1),
	new THREE.Vector4(16, 0, 23, 1.1),
	new THREE.Vector4(12, 0, 24, 0.9),
	new THREE.Vector4(-13, 0, -13, 0.7),
	new THREE.Vector4(35, 0, 10, 0.7),
]
const tree = new Tree(resolution)

treeData.forEach(({ x, y, z, w }) => {
	let clone = tree.mesh.clone()
	clone.position.set(x, y, z)
	clone.scale.setScalar(w)
	scene.add(clone)
})

const rock = new Rock(resolution)

const rockData = [
	[new THREE.Vector3(-7, -0.5, 2), new THREE.Vector4(2, 8, 3, 2.8)],
	[new THREE.Vector3(-3, -0.5, -10), new THREE.Vector4(3, 2, 2.5, 1.5)],
	[new THREE.Vector3(-5, -0.5, 3), new THREE.Vector4(1, 1.5, 2, 0.8)],
	[new THREE.Vector3(25, -0.5, 3), new THREE.Vector4(4, 1, 3, 1)],
	[new THREE.Vector3(24, -0.5, 2), new THREE.Vector4(2, 2, 1, 1)],
	[new THREE.Vector3(28, -0.5, 16), new THREE.Vector4(6, 2, 4, 4)],
	[new THREE.Vector3(26, -0.5, 13), new THREE.Vector4(3, 2, 2.5, 3.2)],
	[new THREE.Vector3(25, -0.5, -8), new THREE.Vector4(1, 1, 1, 0)],
	[new THREE.Vector3(26, -0.5, -7), new THREE.Vector4(2, 4, 1.5, 0.5)],
	[new THREE.Vector3(-5, -0.5, 14), new THREE.Vector4(1, 3, 2, 0)],
	[new THREE.Vector3(-4, -0.5, 15), new THREE.Vector4(0.8, 0.6, 0.7, 0)],
	[new THREE.Vector3(15, -0.5, 25), new THREE.Vector4(2.5, 0.8, 4, 2)],
	[new THREE.Vector3(19, -0.5, 22), new THREE.Vector4(1.2, 2, 1.2, 1)],
	[new THREE.Vector3(18, -0.5, 21.5), new THREE.Vector4(0.8, 1, 0.8, 2)],
	// [new THREE.Vector3(0, -0.5, 0), new THREE.Vector4(1, 1, 1, 0)],
]

rockData.forEach(([position, { x, y, z, w }]) => {
	let clone = new Rock(resolution).mesh
	clone.position.copy(position)
	clone.scale.set(x, y, z)
	clone.rotation.y = w
	scene.add(clone)
})
