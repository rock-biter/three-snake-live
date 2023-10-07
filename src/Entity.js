import gsap from 'gsap'

export default class Entity {
	constructor(mesh, resolution, option = { size: 1.5, number: 0.5 }) {
		this.mesh = mesh

		mesh.castShadow = true
		mesh.receiveShadow = true

		this.resolution = resolution
		this.option = option
	}

	get position() {
		return this.mesh.position
	}

	getIndexByCoord() {
		const { x, y } = this.resolution
		return this.position.z * x + this.position.x
	}

	in() {
		gsap.from(this.mesh.scale, {
			duration: 1,
			x: 0,
			y: 0,
			z: 0,
			ease: `elastic.out(${this.option.size}, ${this.option.number})`,
		})
	}

	out() {}
}
