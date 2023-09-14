import { generateArray, split, tail } from '@dowhileluke/fns'
import { CARD_DATA } from '../data'
import { generateDeck, shuffle, toKlondikeLayout, toSelectedCards } from '../functions'
import { appendAtLocation, removeAtLocation } from '../functions/movement'
import { IsConnectedFn, Rules } from '../types'

export const FLAG_DEAL_TRIPLE = 1
export const FLAG_DEAL_LIMIT = 2

export const isConnected: IsConnectedFn = (a, b, { suitCount }) => {
	const isSequential = a.rank + 1 === b.rank

	if (suitCount === 1) return isSequential

	return isSequential && a.isRed !== b.isRed
}

export const klondike: Rules = {
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
	move(config, state, from, to) {
		const movingCardIds = toSelectedCards(state, from)
		const movingCards = movingCardIds.map(id => CARD_DATA[id])
	
		if (movingCards.length === 0) return null
	
		if (to.zone === 'tableau') {
			const toPile = state.tableau[to.x]
			
			if (toPile.cardIds.length === 0) {
				if (movingCards[0].rank !== 12) return null
			} else {
				const targetCard = CARD_DATA[tail(toPile.cardIds)]
				
				if (!isConnected(movingCards[0], targetCard, config)) return null
			}

			return appendAtLocation(removeAtLocation(state, from), to, movingCardIds)
		}

		if (to.zone === 'foundation') {
			if (movingCards.length > 1 || !state.foundations) return null

			const target = state.foundations[to.x]

			if (target.length > 0) {
				const topCard = CARD_DATA[tail(target)]

				if (topCard.suit !== movingCards[0].suit || topCard.rank + 1 !== movingCards[0].rank) return null
			} else {
				if (movingCards[0].rank !== 0) return null
			}

			return appendAtLocation(removeAtLocation(state, from), to, movingCardIds)
		}
	
		return null
	},
	autoMove(config, state, from) {
		if (!state.foundations) return null

		const movingCardIds = toSelectedCards(state, from)

		if (movingCardIds.length === 0) return null

		const movingCard = CARD_DATA[movingCardIds[0]]

		// move aces to foundation
		if (movingCard.rank === 0) {
			return { zone: 'foundation', x: state.foundations.findIndex(ids => ids.length === 0) ?? 0, y: 0 }
		}

		// move single card to foundation
		if (movingCardIds.length === 1) {
			for (const [x, cardIds] of state.foundations.entries()) {
				if (cardIds.length === 0) continue

				const upCard = CARD_DATA[tail(cardIds)]

				if (upCard.suit === movingCard.suit && upCard.rank + 1 === movingCard.rank) {
					return { zone: 'foundation', x, y: 0 }
				}
			}
		}

		for (const [x, pile] of state.tableau.entries()) {
			if (pile.cardIds.length === 0) {
				if (movingCard.rank === 12) {
					return { zone: 'tableau', x, y: 0 }
				}
			} else {
				const pileCard = CARD_DATA[tail(pile.cardIds)]

				if (isConnected(movingCard, pileCard, config)) {
					return { zone: 'tableau', x, y: 0 }
				}
			}
		}

		return null
	},
	isConnected,
}
