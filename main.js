import './style.css'
import * as THREE from 'three'
import { ArcballControls } from 'three/examples/jsm/controls/ArcballControls'
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls'
import { FlyControls } from 'three/examples/jsm/controls/FlyControls'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { MapControls } from 'three/examples/jsm/controls/MapControls'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'

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

camera.position.set(10, 0.5, 10)
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

/**
 * FlyControls
 */
// const controls = new FlyControls(camera, renderer.domElement)
// controls.movementSpeed = 2
// controls.rollSpeed = 0.5
// controls.autoForward = true

/**
 * FirstPersonControls
 */
// const controls = new FirstPersonControls(camera, renderer.domElement)
// controls.lookSpeed = 0.03

// // impedisce inclinazione verticale
// controls.lookVertical = false

// limita gli angoli di inclinazione verticale
// controls.verticalMin = Math.PI * 0.25
// controls.verticalMax = Math.PI * 0.75
// controls.constrainVertical = true
// controls.heightSpeed = true
// controls.heightMax = 100
// controls.heightCoef = 3

/**
 * OrbitControls
 */
// const controls = new OrbitControls(camera, renderer.domElement)

/**
 * MapControls
 */
// const controls = new MapControls(camera, renderer.domElement)
// attiva la rotazione automatica
// controls.autoRotate = true
// imposta la velocità di rotazione
// controls.autoRotateSpeed = 3.0
// controls.enableRotate = false
// controls.enableDamping = true
// controls.dampingFactor = 0.07

// controls.enablePan = false
// controls.panSpeed = 2
// controls.screenSpacePanning = false
// controls.listenToKeyEvents(window)
// controls.keys = {
// 	LEFT: 'KeyA',
// 	UP: 'KeyW',
// 	RIGHT: 'KeyD',
// 	BOTTOM: 'KeyS',
// }

// controls.minDistance = 2
// controls.maxDistance = 20

// controls.minPolarAngle = Math.PI * 0.25
// controls.maxPolarAngle = Math.PI * 0.75

// controls.minAzimuthAngle = -Math.PI * 0.5
// controls.maxAzimuthAngle = Math.PI * 0.5

// /**
//  * PointerLockControls
//  */
// const controls = new PointerLockControls(camera, document.body)

/**
 * PointerLockControls
 */
const controls = new TrackballControls(camera, renderer.domElement)
controls.dynamicDampingFactor = 0.05

/**
 * velocità di rotazione radianti al secondo
 */
const vel = new THREE.Vector3(0, 0, 0)

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
	const deltaTime = clock.getDelta()
	/**
	 * tempo totale trascorso dall'inizio
	 */
	// const time = clock.getElapsedTime()
	controls.update()

	if (controls.isLocked) {
		controls.moveForward(vel.z * deltaTime)
		controls.moveRight(vel.x * deltaTime)
	}

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

	controls.handleResize()
}

controls.addEventListener('lock', function () {
	// menu.style.display = 'none'
})

controls.addEventListener('unlock', function () {
	// menu.style.display = 'block'
})

// window.addEventListener('click', function () {
// 	// cliccando sulla window attiviamo il controls se non è attivo
// 	if (!controls.isLocked) {
// 		controls.lock()
// 	}
// })

window.addEventListener('keydown', function (e) {
	// disattivo il controls se l'utente preme il tasto Esc
	switch (e.code) {
		case 'KeyA':
		case 'ArrowLeft':
			vel.x = -1
			break
		case 'KeyD':
		case 'ArrowRight':
			vel.x = 1
			break
		case 'KeyW':
		case 'ArrowUp':
			vel.z = 1
			break
		case 'KeyS':
		case 'ArrowDown':
			vel.z = -1
			break
	}
})

window.addEventListener('keyup', function (e) {
	// disattivo il controls se l'utente preme il tasto Esc
	switch (e.code) {
		case 'KeyA':
		case 'ArrowLeft':
		case 'KeyD':
		case 'ArrowRight':
			vel.x = 0
			break
		case 'KeyW':
		case 'ArrowUp':
		case 'KeyS':
		case 'ArrowDown':
			vel.z = 0
			break
	}
})
