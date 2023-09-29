export default class ListNode {
	next = null
	prev = null

	constructor(data) {
		this.data = data
	}

	linkTo(node) {
		this.next = node
		node.prev = this
	}
}
