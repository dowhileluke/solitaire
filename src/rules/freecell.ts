import { generateArray, tail } from '@dowhileluke/fns'
import { generateDeck, isSequential, shuffle, toFlatLayout, toSelectedCards } from '../functions'
import { CardId, IsConnectedFn, Pile, Rules } from '../types'
import { appendAtLocation, removeAtLocation } from '../functions/movement'
import { CARD_DATA } from '../data'

export const FLAG_BAKERS_GAME = 1

const isConnected: IsConnectedFn = (a, b, { suitCount, modeFlags }) => {
	const isSequence = isSequential(b, a)

	if (!isSequence) return false

	if (suitCount === 1 || modeFlags & FLAG_BAKERS_GAME) return a.suit === b.suit

	return a.isRed !== b.isRed
}

function getMaxHeight(tableau: Pile[], cells: Array<CardId | null>) {
	const emptyCascCount = tableau.filter(p => p.cardIds.length === 0).length
	const emptyCellCount = cells.filter(c => c === null).length
	
	return (2 ** emptyCascCount) * (emptyCellCount + 1)
}

export const freecell: Rules = {
	v: 1,
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
	move(config, prev, from, to) {
		if (!prev.cells) return null

		const movingCardIds = toSelectedCards(prev, from)

		if (movingCardIds.length === 0) return null

		const topCard = CARD_DATA[movingCardIds[0]]

		if (to.zone === 'tableau') {
			const maxHeight = getMaxHeight(prev.tableau, prev.cells)
			const halfMax = maxHeight >> 1
	
			if (movingCardIds.length > maxHeight) return null

			const targetPile = prev.tableau[to.x]

			if (targetPile.cardIds.length === 0) {
				if (movingCardIds.length > halfMax) return null
			} else {
				const targetCard = CARD_DATA[tail(targetPile.cardIds)]

				if (!isConnected(topCard, targetCard, config)) return null
			}

			return appendAtLocation(removeAtLocation(prev, from), to, movingCardIds)
		}

		if (movingCardIds.length > 1) return null

		if (to.zone === 'cell') {
			const target = prev.cells[to.x]

			if (target !== null) return null

			return appendAtLocation(removeAtLocation(prev, from), to, movingCardIds)
		}

		if (to.zone === 'foundation') {
			if (!prev.foundations) return null

			const targetIds = prev.foundations[to.x]

			if (targetIds.length === 0) {
				if (topCard.rank !== 0) return null
			} else {
				const targetCard = CARD_DATA[tail(targetIds)]

				if (topCard.suit !== targetCard.suit || topCard.rank !== targetCard.rank + 1) return null
			}

			return appendAtLocation(removeAtLocation(prev, from), to, movingCardIds)
		}

		return null
	},
	autoMove(config, state, from) {
		if (!state.cells || !state.foundations) return null

		const movingCardIds = toSelectedCards(state, from)

		if (movingCardIds.length === 0) return null

		const topCard = CARD_DATA[movingCardIds[0]]
		let maxHeight = 2
		let matchingX: number | null = null

		// look for a foundation
		if (movingCardIds.length === 1) {
			if (topCard.rank === 0) {
				return { zone: 'foundation', x: state.foundations.findIndex(ids => ids.length === 0) ?? 0, y: 0 }
			}

			let lowestRank = 999

			for (const [x, cardIds] of state.foundations.entries()) {
				if (cardIds.length === 0) {
					lowestRank = -1
				} else {
					const targetCard = CARD_DATA[tail(cardIds)]

					if (matchingX === null && topCard.suit === targetCard.suit && topCard.rank === targetCard.rank + 1) {
						matchingX = x
					}

					lowestRank = Math.min(lowestRank, targetCard.rank)
				}
			}

			// prevent overly aggressive foundation moves
			if (matchingX !== null && topCard.rank < lowestRank + 3) {
				return { zone: 'foundation', x: matchingX, y: 0 }
			}
		} else {
			maxHeight = getMaxHeight(state.tableau, state.cells)
		}

		if (movingCardIds.length > maxHeight) return null

		const halfMax = maxHeight >> 1
		let openX: number | null = null

		for (const [x, pile] of state.tableau.entries()) {
			if (pile.cardIds.length === 0) {
				if (openX === null && movingCardIds.length <= halfMax) {
					openX = x
				}
			} else {
				const targetCard = CARD_DATA[tail(pile.cardIds)]

				if (isConnected(topCard, targetCard, config)) {
					return { zone: 'tableau', x, y: 0 }
				}
			}
		}

		if (from.zone !== 'cell' && movingCardIds.length === 1) {
			for (const [x, id] of state.cells.entries()) {
				if (id === null) {
					return { zone: 'cell', x }
				}
			}
		}

		// fall back to these if necessary/possible
		if (openX !== null) return { zone: 'tableau', x: openX, y: 0 }
		if (matchingX !== null) return { zone: 'foundation', x: matchingX, y: 0 }

		return null
	},
	isConnected,
}
