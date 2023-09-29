import { Mesh, MeshNormalMaterial, Vector2, Vector3 } from 'three'
import LinkedKList from './LinkedList'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry'
import ListNode from './ListNode'
import Entity from './Entity'

const NODE_GEOMETRY = new RoundedBoxGeometry(0.9, 0.9, 0.9, 5, 0.1)
const NODE_MATERIAL = new MeshNormalMaterial()

const UP = new Vector3(0, 0, -1)
const DOWN = new Vector3(0, 0, 1)
const LEFT = new Vector3(-1, 0, 0)
const RIGHT = new Vector3(1, 0, 0)

export default class Snake {
	direction = RIGHT
	indexes = []

	constructor({ scene, resolution = new Vector2(10, 10) }) {
		// creare la testa
		this.scene = scene
		this.resolution = resolution
		const head = new ListNode(new SnakeNode(resolution))
		head.data.mesh.position.x = resolution.x / 2
		head.data.mesh.position.z = resolution.y / 2
		this.body = new LinkedKList(head)

		this.indexes.push(this.head.data.getIndexByCoord())
		for (let i = 0; i < 3; i++) {
			this.addTailNode()
			this.indexes.push(this.end.data.getIndexByCoord())
		}

		scene.add(head.data.mesh)
	}

	get head() {
		return this.body.head
	}

	get end() {
		return this.body.end
	}

	setDirection(keyCode) {
		switch (keyCode) {
			case 'ArrowUp':
				this.newDirection = UP
				break
			case 'ArrowDown':
				this.newDirection = DOWN
				break
			case 'ArrowLeft':
				this.newDirection = LEFT
				break
			case 'ArrowRight':
				this.newDirection = RIGHT
				break
		}
		if (this.newDirection) {
			const dot = this.direction.dot(this.newDirection)
			if (dot !== 0) {
				this.newDirection = null
			}
		}
	}

	update() {
		// console.log('update')

		if (this.newDirection) {
			this.direction = this.newDirection
			this.newDirection = null
		}

		let currentNode = this.end

		while (currentNode.prev) {
			const position = currentNode.prev.data.mesh.position
			currentNode.data.mesh.position.copy(position)

			currentNode = currentNode.prev
		}
		const headPos = currentNode.data.mesh.position
		headPos.add(this.direction)
		// currentNode.data.mesh.position.add(this.direction)

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
	}

	addTailNode() {
		const node = new ListNode(new SnakeNode(this.resolution))
		const position = this.end.data.mesh.position.clone()
		position.sub(this.direction)
		node.data.mesh.position.copy(position)
		this.body.addNode(node)
		this.scene.add(node.data.mesh)
	}
}

class SnakeNode extends Entity {
	constructor(resolution) {
		const mesh = new Mesh(NODE_GEOMETRY, NODE_MATERIAL)
		super(mesh, resolution)
	}
}
