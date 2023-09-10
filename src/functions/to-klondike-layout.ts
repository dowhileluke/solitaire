import { CardId, GameState, Pile } from '../types'

export function toKlondikeLayout(deck: CardId[]) {
	const tableau: Pile[] = []
	let startIndex = 0

	for (let i = 0; i < 7; i++) {
		const lastIndex = startIndex + i + 1

		tableau.push({
			cardIds: deck.slice(startIndex, lastIndex),
			down: i,
		})

		startIndex = lastIndex
	}

	const result: Required<Pick<GameState, 'tableau' | 'stock'>> = {
		tableau,
		stock: deck.slice(startIndex),
	}

	return result
}
