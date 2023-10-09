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

const isMobile = window.innerWidth <= 768
const loader = new FontLoader()
let font

loader.load(fontSrc, function (loadedFont) {
	font = loadedFont

	printScore()
})

/**
 * Debug
 */
let gui //= new dat.GUI()

const palettes = {
	green: {
		groundColor: 0x56f854,
		fogColor: 0x39c09f,
		rockColor: 0xebebeb, //0x7a95ff,
		treeColor: 0x639541, //0x1d5846,
		candyColor: 0x1d5846, //0x614bdd,
		snakeColor: 0x1d5846, //0xff470a,
		mouthColor: 0x39c09f,
	},
	orange: {
		groundColor: 0xd68a4c,
		fogColor: 0xffac38,
		rockColor: 0xacacac,
		treeColor: 0xa2d109,
		candyColor: 0x614bdd,
		snakeColor: 0xff470a,
		mouthColor: 0x614bdd,
	},
	lilac: {
		groundColor: 0xd199ff,
		fogColor: 0xb04ce6,
		rockColor: 0xebebeb,
		treeColor: 0x53d0c1,
		candyColor: 0x9900ff,
		snakeColor: 0xff2ed2,
		mouthColor: 0x614bdd,
	},
}

let paletteName = localStorage.getItem('paletteName') || 'green'
let selectedPalette = palettes[paletteName]

const params = {
	...selectedPalette,
}

function applyPalette(paletteName) {
	const palette = palettes[paletteName]
	localStorage.setItem('paletteName', paletteName)

	selectedPalette = palette

	if (!palette) return

	const {
		groundColor,
		fogColor,
		rockColor,
		treeColor,
		candyColor,
		snakeColor,
		mouthColor,
	} = palette

	planeMaterial.color.set(groundColor)
	scene.fog.color.set(fogColor)
	scene.background.set(fogColor)

	entities
		.find((entity) => entity instanceof Rock)
		?.mesh.material.color.set(rockColor)
	entities
		.find((entity) => entity instanceof Tree)
		?.mesh.material.color.set(treeColor)
	candies[0].mesh.material.color.set(candyColor)
	snake.body.head.data.mesh.material.color.set(snakeColor)

	snake.body.head.data.mesh.material.color.set(snakeColor)
	snake.mouthColor = mouthColor
	snake.mouth.material.color.set(mouthColor)

	btnPlayImg.src = `/btn-play-bg-${paletteName}.png`
}

if (gui) {
	gui
		.addColor(params, 'groundColor')
		.name('Ground color')
		.onChange((val) => planeMaterial.color.set(val))

	gui
		.addColor(params, 'fogColor')
		.name('Fog color')
		.onChange((val) => {
			scene.fog.color.set(val)
			scene.background.color.set(val)
		})

	gui
		.addColor(params, 'rockColor')
		.name('Rock color')
		.onChange((val) => {
			entities
				.find((entity) => entity instanceof Rock)
				?.mesh.material.color.set(val)
		})

	gui
		.addColor(params, 'treeColor')
		.name('Tree color')
		.onChange((val) => {
			entities
				.find((entity) => entity instanceof Tree)
				?.mesh.material.color.set(val)
		})

	gui
		.addColor(params, 'candyColor')
		.name('Candy color')
		.onChange((val) => {
			candies[0].mesh.material.color.set(val)
		})

	gui
		.addColor(params, 'snakeColor')
		.name('Snake color')
		.onChange((val) => {
			snake.body.head.data.mesh.material.color.set(val)
		})
}

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
gridHelper.material.opacity = isMobile ? 0.75 : 0.3
/**
 * Scene
 */
const scene = new THREE.Scene()
scene.background = new THREE.Color(params.fogColor)

scene.fog = new THREE.Fog(params.fogColor, 5, 40)

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

const finalPosition = isMobile
	? new THREE.Vector3(resolution.x / 2 - 0.5, resolution.x + 15, resolution.y)
	: new THREE.Vector3(
			-8 + resolution.x / 2,
			resolution.x / 2 + 4,
			resolution.y + 6
	  )
const initialPosition = new THREE.Vector3(
	resolution.x / 2 + 5,
	4,
	resolution.y / 2 + 4
)
camera.position.copy(initialPosition)
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
controls.target.set(
	resolution.x / 2 - 2,
	0,
	resolution.y / 2 + (isMobile ? 0 : 2)
)

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
const planeMaterial = new THREE.MeshStandardMaterial({
	color: params.groundColor,
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.position.x = resolution.x / 2 - 0.5
plane.position.z = resolution.y / 2 - 0.5
plane.position.y = -0.5
scene.add(plane)

plane.receiveShadow = true

// create snake
const snake = new Snake({
	scene,
	resolution,
	color: selectedPalette.snakeColor,
	mouthColor: selectedPalette.mouthColor,
})
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
	if (isMobile) {
		geometry.rotateX(-Math.PI * 0.5)
	}

	const mesh = new THREE.Mesh(geometry, snake.body.head.data.mesh.material)

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

const mobileArrows = document.getElementById('mobile-arrows')

function registerEventListener() {
	if (isMobile) {
		//mobile
		const prevTouch = new THREE.Vector2()
		let middle = 1.55
		let scale = 1

		window.addEventListener('touchstart', (event) => {
			const touch = event.targetTouches[0]

			middle = THREE.MathUtils.clamp(middle, 1.45, 1.65)

			// console.log(event)
			let x, y
			x = (2 * touch.clientX) / window.innerWidth - 1
			y = (2 * touch.clientY) / window.innerHeight - middle

			// if (Math.abs(x) < 0.15 && Math.abs(y) < 0.15) {
			// 	return
			// }

			if (!isRunning) {
				startGame()
			}

			// console.log('click', x, y)

			if (x * scale > y) {
				if (x * scale < -y) {
					snake.setDirection('ArrowUp')
					scale = 3
				} else {
					snake.setDirection('ArrowRight')
					middle += y
					scale = 0.33
				}
			} else {
				if (-x * scale > y) {
					snake.setDirection('ArrowLeft')
					middle += y
					scale = 0.33
				} else {
					snake.setDirection('ArrowDown')
					scale = 3
				}
			}

			prevTouch.x = x
			prevTouch.y = y
		})
	} else {
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
	}
}

let isRunning

function startGame() {
	if (!snake.isMoving) {
		isRunning = setInterval(() => {
			snake.update()
		}, 240)
	}
}

// startGame()

function stopGame() {
	clearInterval(isRunning)
	isRunning = null
	// this.snake.stop()
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
	const candy = new Candy(resolution, selectedPalette.candyColor)

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
		Math.random() > 0.5
			? new Rock(resolution, selectedPalette.rockColor)
			: new Tree(resolution, selectedPalette.treeColor)

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
const resX = resolution.x
const rexY = resolution.y

const rockData = [
	[new THREE.Vector3(-7, -0.5, 2), new THREE.Vector4(2, 8, 3, 2.8)],
	[new THREE.Vector3(-3, -0.5, -10), new THREE.Vector4(3, 2, 2.5, 1.5)],
	[new THREE.Vector3(-5, -0.5, 3), new THREE.Vector4(1, 1.5, 2, 0.8)],
	[new THREE.Vector3(resX + 5, -0.5, 3), new THREE.Vector4(4, 1, 3, 1)],
	[new THREE.Vector3(resX + 4, -0.5, 2), new THREE.Vector4(2, 2, 1, 1)],
	[new THREE.Vector3(resX + 8, -0.5, 16), new THREE.Vector4(6, 2, 4, 4)],
	[new THREE.Vector3(resX + 6, -0.5, 13), new THREE.Vector4(3, 2, 2.5, 3.2)],
	[new THREE.Vector3(resX + 5, -0.5, -8), new THREE.Vector4(1, 1, 1, 0)],
	[new THREE.Vector3(resX + 6, -0.5, -7), new THREE.Vector4(2, 4, 1.5, 0.5)],
	[new THREE.Vector3(-5, -0.5, 14), new THREE.Vector4(1, 3, 2, 0)],
	[new THREE.Vector3(-4, -0.5, 15), new THREE.Vector4(0.8, 0.6, 0.7, 0)],
	[
		new THREE.Vector3(resX / 2 + 5, -0.5, 25),
		new THREE.Vector4(2.5, 0.8, 4, 2),
	],
	[
		new THREE.Vector3(resX / 2 + 9, -0.5, 22),
		new THREE.Vector4(1.2, 2, 1.2, 1),
	],
	[
		new THREE.Vector3(resX / 2 + 8, -0.5, 21.5),
		new THREE.Vector4(0.8, 1, 0.8, 2),
	],
	// [new THREE.Vector3(0, -0.5, 0), new THREE.Vector4(1, 1, 1, 0)],
]

rockData.forEach(([position, { x, y, z, w }]) => {
	let clone = new Rock(resolution).mesh
	clone.position.copy(position)
	clone.scale.set(x, y, z)
	clone.rotation.y = w
	scene.add(clone)
})

const audio = document.getElementById('audio')
const btnVolume = document.getElementById('btn-volume')
const btnPlay = document.getElementById('btn-play')
const btnPlayImg = document.getElementById('btn-play-img')

gsap.fromTo(
	btnPlay,
	{ autoAlpha: 0, scale: 0, yPercent: -50, xPercent: -50 },
	{
		duration: 0.8,
		autoAlpha: 1,
		scale: 1,
		yPercent: -50,
		xPercent: -50,
		delay: 0.3,
		ease: `elastic.out(1.2, 0.7)`,
	}
)

btnPlay.addEventListener('click', function () {
	audio.play()

	gsap.to(camera.position, { ...finalPosition, duration: 2 })
	if (isMobile) {
		gsap.to(controls.target, {
			x: resolution.x / 2 - 0.5,
			y: 0,
			z: resolution.y / 2 - 0.5,
		})

		// gsap.to(mobileArrows, { autoAlpha: 0.3, duration: 1, delay: 0.5 })
	}
	gsap.to(scene.fog, { duration: 2, near: isMobile ? 30 : 20, far: 55 })

	gsap.to(this, {
		duration: 1,
		scale: 0,
		ease: `elastic.in(1.2, 0.7)`,
		onComplete: () => {
			this.style.visibility = 'hidden'
		},
	})

	registerEventListener()
})

const userVolume = localStorage.getItem('volume')
console.log('user volume', userVolume)
if (userVolume === 'off') {
	muteVolume()
}

const initialVolume = audio.volume

btnVolume.addEventListener('click', function () {
	if (audio.volume === 0) {
		unmuteVolume()
	} else {
		muteVolume()
	}
})

function muteVolume() {
	localStorage.setItem('volume', 'off')
	gsap.to(audio, { volume: 0, duration: 1 })
	btnVolume.classList.remove('after:hidden')
	btnVolume.querySelector(':first-child').classList.remove('animate-ping')
	btnVolume.classList.add('after:block')
}

function unmuteVolume() {
	localStorage.setItem('volume', 'on')
	btnVolume.classList.add('after:hidden')
	btnVolume.querySelector(':first-child').classList.add('animate-ping')
	btnVolume.classList.remove('after:block')
	gsap.to(audio, { volume: initialVolume, duration: 1 })
}

const topBar = document.querySelector('.top-bar')
const topBarItems = document.querySelectorAll('.top-bar__item')

gsap.set(topBarItems, { y: -200, autoAlpha: 0 })

gsap.to(topBar, {
	opacity: 1,
	delay: 0.3,
	onComplete: () => {
		gsap.to(topBarItems, {
			duration: 1,
			y: 0,
			autoAlpha: 1,
			ease: `elastic.out(1.2, 0.9)`,
			stagger: {
				amount: 0.3,
			},
		})
	},
})

const paletteSelectors = document.querySelectorAll('[data-color]')
gsap.to(topBar, {
	opacity: 1,
	delay: 0.5,
	onComplete: () => {
		gsap.to(paletteSelectors, {
			duration: 1,
			x: 0,
			autoAlpha: 1,
			ease: `elastic.out(1.2, 0.9)`,
			stagger: {
				amount: 0.2,
			},
		})
	},
})

paletteSelectors.forEach((selector) =>
	selector.addEventListener('click', function () {
		const paletteName = this.dataset.color
		applyPalette(paletteName)
	})
)

const manager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(manager)

const wasd = textureLoader.load('/wasd.png')
const arrows = textureLoader.load('/arrows.png')

const wasdGeometry = new THREE.PlaneGeometry(3.5, 2)
wasdGeometry.rotateX(-Math.PI * 0.5)

const planeWasd = new THREE.Mesh(
	wasdGeometry,
	new THREE.MeshStandardMaterial({
		transparent: true,
		map: wasd,
		opacity: isMobile ? 0 : 0.5,
	})
)

const planeArrows = new THREE.Mesh(
	wasdGeometry,
	new THREE.MeshStandardMaterial({
		transparent: true,
		map: arrows,
		opacity: isMobile ? 0 : 0.5,
	})
)

planeArrows.position.set(8.7, 0, 21)
planeWasd.position.set(13, 0, 21)

scene.add(planeArrows, planeWasd)

manager.onLoad = () => {
	console.log('texture caricate')
}

applyPalette(paletteName)

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
