import { DECK } from '../data'
import { DealtCard } from '../types'
import { shuffle } from './shuffle'

export function deal() {
	const cards = shuffle(DECK)
	const tableau: DealtCard[][] = []
	let startIndex = 0

	for (let i = 0; i < 7; i++) {
		const lastIndex = startIndex + i + 1

		tableau.push(cards.slice(startIndex, lastIndex).map((c, n):DealtCard => ({ ...c, isKnown: n === i, })))

		startIndex = lastIndex
	}

	return [tableau, cards.slice(28)] as const
}
