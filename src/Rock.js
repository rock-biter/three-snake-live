import {
	IcosahedronGeometry,
	Mesh,
	MeshNormalMaterial,
	MeshStandardMaterial,
} from 'three'
import Entity from './Entity'

const GEOMETRY = new IcosahedronGeometry(0.5)
const MATERIAL = new MeshStandardMaterial({
	color: 0xacacac,
	flatShading: true,
})

export default class Rock extends Entity {
	constructor(resolution, color) {
		const mesh = new Mesh(GEOMETRY, MATERIAL)
		mesh.scale.set(Math.random() * 0.5 + 0.5, 0.5 + Math.random() ** 2 * 1.9, 1)
		mesh.rotation.y = Math.random() * Math.PI * 2
		mesh.rotation.x = Math.random() * Math.PI * 0.1
		mesh.rotation.order = 'YXZ'
		mesh.position.y = -0.5

		if (color) {
			MATERIAL.color.set(color)
		}

		super(mesh, resolution)
	}
}
