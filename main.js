import './style.css'
import * as THREE from 'three'

const scene = new THREE.Scene()

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: '#00ff00' })

const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)

const temp = {
	width: 1024,
	height: 720,
}

const camera = new THREE.PerspectiveCamera(
	75,
	temp.width / temp.height,
	0.1,
	10
)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(temp.width, temp.height)
document.body.appendChild(renderer.domElement)

camera.position.z = 4
// mesh.rotation.y = Math.PI / 4
// mesh.rotation.x = Math.PI / 4

function tic() {
	renderer.render(scene, camera)

	mesh.rotation.x += 0.01
	mesh.rotation.y += 0.01

	requestAnimationFrame(tic)
}

requestAnimationFrame(tic)
