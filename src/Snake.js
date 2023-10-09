import {
	EventDispatcher,
	Mesh,
	MeshNormalMaterial,
	MeshStandardMaterial,
	SphereGeometry,
	Vector2,
	Vector3,
} from 'three'
import LinkedKList from './LinkedList'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry'
import ListNode from './ListNode'
import Entity from './Entity'

const NODE_GEOMETRY = new RoundedBoxGeometry(0.9, 0.9, 0.9, 5, 0.1)
const NODE_MATERIAL = new MeshStandardMaterial({
	color: 0xff470a,
})

const UP = new Vector3(0, 0, -1)
const DOWN = new Vector3(0, 0, 1)
const LEFT = new Vector3(-1, 0, 0)
const RIGHT = new Vector3(1, 0, 0)

export default class Snake extends EventDispatcher {
	direction = RIGHT
	indexes = []
	speedInterval = 240

	constructor({ scene, resolution = new Vector2(10, 10), color, mouthColor }) {
		// creare la testa
		super()

		this.scene = scene
		this.resolution = resolution
		this.mouthColor = mouthColor

		if (color) {
			NODE_MATERIAL.color.set(color)
		}

		this.init()
	}

	get head() {
		return this.body.head
	}

	get end() {
		return this.body.end
	}

	createHeadMesh() {
		const headMesh = this.body.head.data.mesh

		const leftEye = new Mesh(
			new SphereGeometry(0.2, 10, 10),
			new MeshStandardMaterial({ color: 0xffffff })
		)
		leftEye.scale.x = 0.1
		leftEye.position.x = 0.5
		leftEye.position.y = 0.12
		leftEye.position.z = -0.1

		let leftEyeHole = new Mesh(
			new SphereGeometry(0.22, 10, 10),
			new MeshStandardMaterial({ color: 0x333333 })
		)
		leftEyeHole.scale.set(1, 0.6, 0.6)
		leftEyeHole.position.x += 0.05
		leftEye.add(leftEyeHole)

		const rightEye = leftEye.clone()

		rightEye.position.x = -0.5
		rightEye.rotation.y = Math.PI

		const mouthMesh = new Mesh(
			new RoundedBoxGeometry(1.05, 0.1, 0.6, 5, 0.1),
			new MeshStandardMaterial({
				color: this.mouthColor, //0x614bdd,
			})
		)

		mouthMesh.rotation.x = -Math.PI * 0.07
		mouthMesh.position.z = 0.23
		mouthMesh.position.y = -0.19

		this.mouth = mouthMesh

		headMesh.add(rightEye, leftEye, mouthMesh)

		headMesh.lookAt(headMesh.position.clone().add(this.direction))
	}

	init() {
		this.direction = RIGHT
		this.iMoving = null

		const head = new ListNode(new SnakeNode(this.resolution))

		head.data.mesh.position.x = this.resolution.x / 2
		head.data.mesh.position.z = this.resolution.y / 2
		this.body = new LinkedKList(head)

		this.createHeadMesh()

		this.indexes.push(this.head.data.getIndexByCoord())
		for (let i = 0; i < 3; i++) {
			const position = this.end.data.mesh.position.clone()
			position.sub(this.direction)
			this.addTailNode()
			this.end.data.mesh.position.copy(position)

			this.indexes.push(this.end.data.getIndexByCoord())
		}

		head.data.in()
		this.scene.add(head.data.mesh)
	}

	// move() {
	// 	this.update()

	// 	this.isMoving = setTimeout(() => {
	// 		this.move()
	// 	}, this.speedInterval)
	// }

	// stop() {
	// 	clearTimeout(this.isMoving)
	// 	this.isMoving = null
	// }

	setDirection(keyCode) {
		let newDirection

		switch (keyCode) {
			case 'ArrowUp':
			case 'KeyW':
				newDirection = UP
				break
			case 'ArrowDown':
			case 'KeyS':
				newDirection = DOWN
				break
			case 'ArrowLeft':
			case 'KeyA':
				newDirection = LEFT
				break
			case 'ArrowRight':
			case 'KeyD':
				newDirection = RIGHT
				break
			default:
				return
		}

		const dot = this.direction.dot(newDirection)
		if (dot === 0) {
			// this.directions.push()
			this.newDirection = newDirection
			// this.stop()
			// this.move()
		}
	}

	update() {
		// console.log('update')

		if (this.newDirection) {
			this.direction = this.newDirection
			this.newDirection = null
		}
		// const direction =
		// 	this.directions.length > 1 ? this.directions.shift() : this.directions[0]

		let currentNode = this.end

		if (this.end.data.candy) {
			this.end.data.candy = null
			this.end.data.mesh.scale.setScalar(1)

			this.addTailNode()
		}

		while (currentNode.prev) {
			const candy = currentNode.prev.data.candy
			if (candy) {
				currentNode.data.candy = candy
				currentNode.data.mesh.scale.setScalar(1.15)
				currentNode.prev.data.candy = null
				currentNode.prev.data.mesh.scale.setScalar(1)
			}

			const position = currentNode.prev.data.mesh.position
			currentNode.data.mesh.position.copy(position)

			currentNode = currentNode.prev
		}
		const headPos = currentNode.data.mesh.position
		headPos.add(this.direction)
		// currentNode.data.mesh.position.add(this.direction)
		const headMesh = this.body.head.data.mesh
		headMesh.lookAt(headMesh.position.clone().add(this.direction))

		if (headPos.z < 0) {
			headPos.z = this.resolution.y - 1
		} else if (headPos.z > this.resolution.y - 1) {
			headPos.z = 0
		}

		if (headPos.x < 0) {
			headPos.x = this.resolution.x - 1
		} else if (headPos.x > this.resolution.x - 1) {
			headPos.x = 0
		}

		this.updateIndexes()
		// console.log(this.indexes)

		this.dispatchEvent({ type: 'updated' })
	}

	die() {
		let node = this.body.head

		do {
			this.scene.remove(node.data.mesh)
			node = node.next
		} while (node)

		this.init()
		this.addEventListener({ type: 'die' })
	}

	checkSelfCollision() {
		const headIndex = this.indexes.pop()
		const collide = this.indexes.includes(headIndex)
		this.indexes.push(headIndex)

		return collide
	}

	checkEntitiesCollision(entities) {
		const headIndex = this.indexes.at(-1)

		const entity = entities.find(
			(entity) => entity.getIndexByCoord() === headIndex
		)

		return !!entity
	}

	updateIndexes() {
		this.indexes = []

		let node = this.body.end

		while (node) {
			this.indexes.push(node.data.getIndexByCoord())
			node = node.prev
		}
	}

	addTailNode(position) {
		const node = new ListNode(new SnakeNode(this.resolution))

		if (position) {
			node.data.mesh.position.copy(position)
		} else {
			node.data.mesh.position.copy(this.end.data.mesh.position)
		}

		this.body.addNode(node)
		node.data.in()
		this.scene.add(node.data.mesh)
	}
}

class SnakeNode extends Entity {
	constructor(resolution) {
		const mesh = new Mesh(NODE_GEOMETRY, NODE_MATERIAL)
		super(mesh, resolution)
	}
}
