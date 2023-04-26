import './style.css'
import * as THREE from 'three'

// creo la scena
const scene = new THREE.Scene()

// creo un cubo verde
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })

const mesh = new THREE.Mesh(geometry, material)

// aggiungo il cubo alla scena
scene.add(mesh)

// imposto temporaneamente le dimensione del render
const temp = {
	width: 1024,
	height: 720,
}

// creo la camera prospettica
const camera = new THREE.PerspectiveCamera(75, temp.width / temp.height)

// creo il renderer
const renderer = new THREE.WebGLRenderer()
renderer.setSize(temp.width, temp.height)
// appendo la canvas al body
document.body.appendChild(renderer.domElement)

// sposto indietro la camera
camera.position.z = 4

// renderizzo la scena
renderer.render(scene, camera)
