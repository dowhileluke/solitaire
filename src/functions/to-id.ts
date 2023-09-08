import { Location } from '../types'

export function toId(location: Location) {
	const parts: Array<string | number> = [location.zone]

	if (location.zone === 'tableau') {
		parts.push(location.x, location.y)
	} else if (location.zone !== 'waste') {
		parts.push(location.x)
	}

	return parts.join('-')
}
