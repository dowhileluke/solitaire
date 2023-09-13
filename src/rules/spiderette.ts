import { generateDeck, shuffle, toKlondikeLayout } from '../functions'
import { Rules } from '../types'
import { spider } from './spider'

export const spiderette: Rules = {
	...spider,
	init({ suitCount, hasExtraSpace }) {
		const deck = shuffle(generateDeck(suitCount))
		const layout = toKlondikeLayout(deck)

		if (hasExtraSpace) {
			layout.tableau.unshift({ cardIds: [], down: 0 })
		}

		return { ...layout, foundations: [] }
	},
}
