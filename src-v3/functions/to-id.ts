import { Position } from '../types'

export function toId(pos: Position) {
	const parts: Array<string | number> = [pos.zone]

	if (pos.zone !== 'waste') parts.push(pos.x)
	if (typeof pos.y === 'number') parts.push(pos.y)

	return parts.join('-')
}
