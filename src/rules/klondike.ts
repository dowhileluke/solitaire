import { split } from '@dowhileluke/fns'
import { generateDeck, shuffle, toKlondikeLayout } from '../functions'
import { IsConnectedFn, Rules } from '../types'

export const isConnected: IsConnectedFn = (a, b, { suitCount }) => {
	const isSequential = a.rank + 1 === b.rank

	if (suitCount === 1) return isSequential

	return isSequential && a.isRed !== b.isRed
}

export const klondike: Rules = {
	init({ suitCount }) {
		const deck = shuffle(generateDeck(suitCount))

		return {
			...toKlondikeLayout(deck),
			waste: { cardIds: [], down: 0 },
			foundations: [[], [], [], []],
			pass: 1,
		}
	},
	deal({ dealFlag }, prev) {
		if (!prev.stock || !prev.waste) return null

		const isEmpty = prev.stock.length === 0
		const passCount = prev.pass ?? 1
		const perDeal = dealFlag % 2 ? 3 : 1 // also equals passLimit
		const hasPassLimit = dealFlag > 1

		if (isEmpty) {
			if (hasPassLimit && passCount >= perDeal) return null

			const [cardIds, stock] = split(prev.waste.cardIds, perDeal)

			return {
				...prev,
				waste: { cardIds, down: 0 },
				stock,
				pass: passCount + 1,
			}
		}

		const [cardIds, stock] = split(prev.stock, perDeal)

		return {
			...prev,
			stock,
			waste: {
				cardIds: prev.waste.cardIds.concat(cardIds),
				down: prev.waste.cardIds.length,
			},
		}
	},
	move(config, state, from, to) {
		return null
	},
	isConnected,
}
