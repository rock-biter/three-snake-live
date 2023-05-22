import './style.css'
import * as THREE from 'three'

// creo la scena
const scene = new THREE.Scene()

// creo un cubo verde
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshNormalMaterial()

const mesh = new THREE.Mesh(geometry, material)

// aggiungo il cubo alla scena
scene.add(mesh)

// imposto temporaneamente le dimensione del render
const temp = {
	width: 1024,
	height: 720,
}

// creo la camera prospettica
const camera = new THREE.PerspectiveCamera(
	75,
	temp.width / temp.height,
	0.1,
	10
)

// creo il renderer
const renderer = new THREE.WebGLRenderer()
renderer.setSize(temp.width, temp.height)
// appendo la canvas al body
document.body.appendChild(renderer.domElement)

mesh.position.x = 3
const mesh2 = mesh.clone()
const mesh3 = mesh.clone()

mesh2.position.x = 5
mesh3.position.x = 1

mesh3.scale.set(0.5, 0.5, 0.5)
mesh2.scale.set(1, 0.5, 2)

scene.add(mesh2, mesh3)

// sposto indietro la camera
camera.position.set(3, 2, 5)
camera.lookAt(2, 0, 1)
// mesh.rotation.y = Math.PI / 4
// mesh.rotation.x = Math.PI / 4

const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)

function tic() {
	// renderizzo la scena
	renderer.render(scene, camera)

	// mesh.rotation.x += 0.01
	// mesh.rotation.y += 0.01

	// invochiamo la funzione tic al prossimo frame
	requestAnimationFrame(tic)
}

//facciamo partire il frame loop
requestAnimationFrame(tic)
