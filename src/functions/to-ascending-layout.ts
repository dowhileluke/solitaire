import { generateArray } from '@dowhileluke/fns'
import { CardId, GameState, Pile } from '../types'

export function toAscendingLayout(deck: CardId[], pileCount: number, startingHeight = 1, upCount = 1) {
	const tableau: Pile[] = []
	let index = 0

	for (const i of generateArray(pileCount)) {
		const height = startingHeight + i
		const cardIds = deck.slice(index, index + height)

		tableau.push({
			cardIds,
			down: Math.max(0, cardIds.length - upCount),
		})

		index += height
	}

	const result: Required<Pick<GameState, 'tableau' | 'stock'>> = {
		tableau,
		stock: deck.slice(index),
	}

	return result
}
