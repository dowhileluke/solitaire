import { CardId, Pile } from '../types'

export function toPile(cardIds: CardId[], down = 0) {
	const result: Pile = { cardIds, down }

	return result
}

export function truncatePile({ cardIds, down }: Pile, length: number) {
	return toPile(cardIds.slice(0, length), down)
}

export function extendPile({ cardIds, down }: Pile, moreIds: CardId[]) {
	return toPile(cardIds.concat(moreIds), down)
}
