export default class Entity {
	constructor(mesh, resolution) {
		this.mesh = mesh

		mesh.castShadow = true
		mesh.receiveShadow = true

		this.resolution = resolution
	}

	get position() {
		return this.mesh.position
	}

	getIndexByCoord() {
		const { x, y } = this.resolution
		return this.position.z * x + this.position.x
	}
}
