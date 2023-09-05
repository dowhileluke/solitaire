import { DECK } from '../data'
import { DeckState, Pile } from '../types'
import { shuffle } from './shuffle'

export function deal() {
	const allCards = shuffle(DECK)
	const tableau: Pile[] = []
	let startIndex = 0

	for (let i = 0; i < 7; i++) {
		const lastIndex = startIndex + i + 1

		tableau.push({
			cards: allCards.slice(startIndex, lastIndex),
			down: i,
		})

		startIndex = lastIndex
	}

	const result: DeckState = {
		tableau,
		stock: allCards.slice(startIndex),
	}

	return result
}
