import { Position } from '../types'

export function toId(pos: Position) {
	const parts: Array<string | number> = [pos.zone]

	if (pos.zone === 'tableau') {
		parts.push(pos.x, pos.y)
	} else if (pos.zone === 'foundation') {
		parts.push(pos.x)

		if (pos.y) parts.push(pos.y)
	} else if (pos.zone === 'cell') {
		parts.push(pos.x)
	} else {
		parts.push(pos.n)
	}

	return parts.join('-')
}
