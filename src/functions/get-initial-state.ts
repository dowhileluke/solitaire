import { generateArray } from '@dowhileluke/fns'
import { CascadeState, LayoutState } from '../types'
import { shuffle } from './shuffle'

export function getInitialState() {
	const deck = shuffle(generateArray(52))
	const tableau: CascadeState[] = []
	let startIndex = 0

	for (let i = 0; i < 7; i++) {
		const lastIndex = startIndex + i + 1

		tableau.push({
			cards: deck.slice(startIndex, lastIndex),
			down: i,
		})

		startIndex = lastIndex
	}

	const result: LayoutState = {
		tableau,
		stock: deck.slice(startIndex),
	}

	return result
}
