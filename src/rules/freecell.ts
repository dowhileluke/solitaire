import { generateArray } from '@dowhileluke/fns'
import { generateDeck, shuffle, toFlatLayout } from '../functions'
import { Rules } from '../types'
import { isConnected } from './klondike'

export const freecell: Rules = {
	init({ suitCount }) {
		const deck = shuffle(generateDeck(suitCount))
		const tableau = toFlatLayout(deck, 8, true)

		return {
			tableau,
			foundations: generateArray(4, () => []),
			cells: generateArray(4, () => null),
		}
	},
	deal() {
		throw new Error('Not implemented!')
	},
	move() {
		throw new Error('Not implemented!')
	},
	isConnected,
}
