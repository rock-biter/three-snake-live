import {
	IcosahedronGeometry,
	Mesh,
	MeshNormalMaterial,
	MeshStandardMaterial,
} from 'three'
import Entity from './Entity'

const GEOMETRY = new IcosahedronGeometry(0.3)
GEOMETRY.rotateX(Math.random() * Math.PI * 2)
GEOMETRY.scale(1, 6, 1)
const MATERIAL = new MeshStandardMaterial({
	flatShading: true,
	color: 0xa2d109,
})

export default class Tree extends Entity {
	constructor(resolution, color) {
		const mesh = new Mesh(GEOMETRY, MATERIAL)
		mesh.scale.setScalar(0.6 + Math.random() * 0.6)
		mesh.rotation.y = Math.random() * Math.PI * 2

		if (color) {
			MATERIAL.color.set(color)
		}

		super(mesh, resolution)
	}
}
