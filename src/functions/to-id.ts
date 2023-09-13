import { Location } from '../types'

export function toId(location: Location) {
	const parts: Array<string | number> = [location.zone]

	if (location.zone === 'waste') {
		parts.push(location.y)
	} else if (location.zone === 'cell') {
		parts.push(location.x)
	} else {
		parts.push(location.x, location.y)
	}

	return parts.join('-')
}
