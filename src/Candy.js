import {
	Mesh,
	MeshNormalMaterial,
	MeshStandardMaterial,
	SphereGeometry,
} from 'three'
import Entity from './Entity'

const GEOMETRY = new SphereGeometry(0.3, 10, 10)
const MATERIAL = new MeshStandardMaterial({
	color: 0x614bdd,
})

export default class Candy extends Entity {
	constructor(resolution) {
		const mesh = new Mesh(GEOMETRY, MATERIAL)
		super(mesh, resolution)
	}
}
