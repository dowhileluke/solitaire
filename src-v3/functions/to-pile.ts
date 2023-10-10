import { CardId, Pile } from '../types'

export function toPile(cardIds: CardId[], down: number) {
	const result: Pile = { cardIds, down }

	return result
}
