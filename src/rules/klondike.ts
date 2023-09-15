import { generateArray, split, tail } from '@dowhileluke/fns'
import { CARD_DATA } from '../data'
import { generateDeck, isSequential, shuffle, toKlondikeLayout } from '../functions'
import { IsConnectedFn, IsValidTargetFn, Location, Rules } from '../types'

export const FLAG_DEAL_TRIPLE = 1
export const FLAG_DEAL_LIMIT = 2

const isConnected: IsConnectedFn = (low, high, { suitCount }) => {
	const isOrdered = isSequential(high, low)

	if (suitCount === 1) return isOrdered

	return isOrdered && low.isRed !== high.isRed
}

const isValidTarget: IsValidTargetFn = (config, state, movingCards, to) => {
	if (to.zone === 'tableau') {
		const toPile = state.tableau[to.x]
		
		if (toPile.cardIds.length === 0) return movingCards[0].rank === 12

		const targetCard = CARD_DATA[tail(toPile.cardIds)]
			
		return isConnected(movingCards[0], targetCard, config)
	}

	if (movingCards.length > 1) return false

	const highestMoving = movingCards[0]

	if (to.zone === 'foundation') {
		const target = state.foundations[to.x]

		if (highestMoving.rank !== target.length) return false
		
		return target.length === 0 || CARD_DATA[target[0]].suit === highestMoving.suit
	}

	return false
}

export const klondike: Rules = {
	v: 2,
	init({ suitCount, deckCount }) {
		const deck = generateDeck(suitCount)
		const isDoubleDeck = deckCount > 1
		const pileCount = isDoubleDeck ? 9 : 7

		return {
			...toKlondikeLayout(shuffle(isDoubleDeck ? deck.concat(deck) : deck), pileCount),
			foundations: generateArray(isDoubleDeck ? 8 : 4, () => []),
			waste: { cardIds: [], down: 0 },
			pass: 1,
		}
	},
	deal({ modeFlags }, prev) {
		if (!prev.stock || !prev.waste) return null

		const isEmpty = prev.stock.length === 0
		const passCount = prev.pass ?? 1
		const perDeal = modeFlags & FLAG_DEAL_TRIPLE ? 3 : 1 // also equals passLimit
		const hasPassLimit = Boolean(modeFlags & FLAG_DEAL_LIMIT)

		if (isEmpty) {
			if (prev.waste.cardIds.length === 0) return null
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
	isConnected,
	isValidTarget,
	guessMove(config, state, movingCards) {
		const highestMoving = movingCards[0]

		if (highestMoving.rank === 0) {
			return { zone: 'foundation', x: state.foundations.findIndex(ids => ids.length === 0), y: 0 }
		}

		let eligibleFoundation: Location | null = null

		if (movingCards.length === 1) {
			const lowestFoundationRank = state.foundations.reduce((lo, f) => Math.min(lo, f.length), 999) - 1
	
			for (const target of generateArray(state.foundations.length, (x): Location => ({ zone: 'foundation', x, y: 0 }))) {
				const isValid = isValidTarget(config, state, movingCards, target)
	
				if (isValid) {
					if (movingCards[0].rank < lowestFoundationRank + 3) return target
	
					eligibleFoundation ??= target
				}
			}
		}

		for (const [x, pile] of state.tableau.entries()) {
			if (pile.cardIds.length === 0) {
				if (highestMoving.rank === 12) {
					return { zone: 'tableau', x, y: 0 }
				}
			} else {
				const pileCard = CARD_DATA[tail(pile.cardIds)]

				if (isConnected(highestMoving, pileCard, config)) {
					return { zone: 'tableau', x, y: 0 }
				}
			}
		}

		return eligibleFoundation
	},
}
