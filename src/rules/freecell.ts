import { generateDeck, shuffle } from '../functions'
import { Rules } from '../types'
import { isConnected } from './klondike'

export const freecell: Rules = {
	init({ suitCount }) {
		// const deck = shuffle(generateDeck(suitCount))

		throw new Error('Not implemented!')
	},
	deal(state) {
		throw new Error('Not implemented!')
	},
	move(state, from, to) {
		throw new Error('Not implemented!')
	},
	isConnected,
}
