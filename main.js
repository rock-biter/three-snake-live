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
 * move camera backward
 */
camera.position.z = 4

// mesh.position.x = 2
// mesh.position.set(1, 0, -2)
const pos2 = new THREE.Vector3(2, 2, 0)

// mesh.position.copy(pos2)
// mesh.position = pos2
// mesh.position.x += 1
// mesh.position.y += 0.5
// mesh.position.add(new THREE.Vector3(1, 0.5, 0))
const mesh2 = mesh.clone()
const mesh3 = mesh.clone()

// scene.add(mesh2, mesh3)
mesh2.position.x = -2
mesh3.position.x = 2

// mesh2.scale.set(1.2, 1.2, 1.2)
mesh2.scale.multiplyScalar(1.2)
mesh.scale.y = 2
mesh3.scale.set(0.5, 0.75, 3)

const axesHelper = new THREE.AxesHelper(2)
mesh.add(axesHelper.clone())
mesh2.add(axesHelper.clone())
mesh3.add(axesHelper.clone())

mesh2.rotation.y = THREE.MathUtils.degToRad(45)
mesh2.rotation.z = THREE.MathUtils.degToRad(-15)
mesh2.rotation.order = 'ZXY'

console.log(THREE.MathUtils.radToDeg(mesh2.rotation.y))

mesh.quaternion.copy(new THREE.Quaternion().random())
console.log(mesh.rotation)

camera.position.y = 1
camera.position.set(-2, 1, 2)

const group = new THREE.Group()
group.add(mesh2, mesh3)
scene.add(group)

group.position.set(0, 1, -1)
group.scale.multiplyScalar(0.5)

const v = new THREE.Vector3()
mesh2.getWorldPosition(v)

camera.lookAt(v)

/**
 * frame loop
 */
function tic() {
	renderer.render(scene, camera)

	requestAnimationFrame(tic)
}

requestAnimationFrame(tic)
