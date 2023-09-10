import { generateDeck, shuffle, toKlondikeLayout } from '../functions'
import { IsConnectedFn, Rules } from '../types'

const isConnected: IsConnectedFn = (a, b) => a.isRed !== b.isRed && a.rank + 1 === b.rank

export const klondike: Rules = {
	init({ suitCount }) {
		const deck = shuffle(generateDeck(suitCount))

		return {
			...toKlondikeLayout(deck),
			waste: [],
			foundations: [],
		}
	},
	deal(state) {
		throw new Error('Not implemented!')
	},
	move(state, from, to) {
		throw new Error('Not implemented!')
	},
	isConnected,
}
