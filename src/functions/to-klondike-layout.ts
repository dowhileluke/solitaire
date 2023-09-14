import { generateArray } from '@dowhileluke/fns'
import { CardId, GameState, Pile } from '../types'

export function toKlondikeLayout(deck: CardId[], pileCount: number) {
	const tableau: Pile[] = []
	let index = 0

	for (const height of generateArray(1, pileCount)) {
		const cardIds = deck.slice(index, index + height)

		tableau.push({
			cardIds,
			down: cardIds.length - 1,
		})

		index += height
	}

	const result: Required<Pick<GameState, 'tableau' | 'stock'>> = {
		tableau,
		stock: deck.slice(index),
	}

	return result
}
