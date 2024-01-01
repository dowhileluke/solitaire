import { Card } from '../types'

export function isSequential(low: Card, high: Card) {
	return low.rank + 1 === high.rank
}
