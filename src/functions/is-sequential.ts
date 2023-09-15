import { Card } from '../types'

export function isSequential(highCard: Card, lowCard: Card) {
	return highCard.rank === lowCard.rank + 1
}
