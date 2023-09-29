export default class LinkedKList {
	constructor(head) {
		this.head = head
		this.end = head
	}

	addNode(node) {
		this.end.linkTo(node)
		this.end = node
	}
}
