import { Position } from '../types'

export function toId(pos: Position) {
	const parts: Array<string | number> = [pos.zone]

	if (pos.zone === 'tableau') {
		parts.push(pos.x, pos.y)
	} else {
		parts.push(pos.x)
	}

	return parts.join('-')
}
