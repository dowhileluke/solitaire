import { generateArray, tail } from '@dowhileluke/fns'
import { generateDeck, isSequential, shuffle, toFlatLayout, toSelectedCards } from '../functions'
import { CardId, IsConnectedFn, Location, Pile, Rules, RulesV2 } from '../types'
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

const freecell: Rules = {
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

export const freecellV2: RulesV2 = {
	v: 2,
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
	isConnected,
	isValidTarget(config, state, movingCards, to) {
		const maxHeight = getMaxHeight(state.tableau, state.cells ?? [])

		if (movingCards.length > maxHeight) return false

		if (to.zone === 'tableau') {
			const halfMax = maxHeight >> 1
			const targetPile = state.tableau[to.x]

			if (targetPile.cardIds.length === 0) return movingCards.length <= halfMax

			const targetCard = CARD_DATA[tail(targetPile.cardIds)]

			return isConnected(movingCards[0], targetCard, config)
		}

		if (to.zone === 'foundation') {
			const smallestMoving = tail(movingCards)
			const target = state.foundations[to.x]

			if (target.length === 0) {
				if (smallestMoving.rank !== 0) return false
				if (movingCards.length === 1) return true

				// moving cards are all same-suited if this statement is true
				return Boolean(config.modeFlags & FLAG_BAKERS_GAME) || config.suitCount === 1
			}

			const targetCard = CARD_DATA[tail(target)]

			return smallestMoving.suit === targetCard.suit && smallestMoving.rank === targetCard.rank + 1
		}

		if (movingCards.length !== 1) return false
		if (to.zone === 'cell') return state.cells![to.x] === null

		return false
	},
	validateState(state) {
		const foundations: number[][] = []
		let isChanged = false

		// check for foundations with a top value that doesn't match its height
		for (const cardIds of state.foundations) {
			if (cardIds.length === 0 || tail(cardIds) % 13 === cardIds.length - 1) {
				foundations.push(cardIds)
			} else {
				foundations.push(cardIds.slice().sort((a, b) => a - b))
				isChanged = true
			}
		}

		if (!isChanged) return state

		return {
			...state,
			foundations,
		}
	},
	guessMove(config, state, movingCards, from) {
		const isBakers = Boolean(config.modeFlags & FLAG_BAKERS_GAME) || config.suitCount > 1
		const lowestFoundationRank = state.foundations.reduce((lo, f) => Math.min(lo, f.length), 999) - 1
		let eligibleFoundation: Location | null = null

		for (const target of generateArray(state.foundations.length, (x): Location => ({ zone: 'foundation', x, y: 0 }))) {
			const isValid = this.isValidTarget(config, state, movingCards, target)

			if (isValid) {
				if (isBakers || movingCards[0].rank < lowestFoundationRank + 3) return target

				eligibleFoundation ??= target
			}
		}

		let openCascade: Location | null = null

		for (const [x, pile] of state.tableau.entries()) {
			const target: Location = { zone: 'tableau', x, y: 0 }
			const isValid = this.isValidTarget(config, state, movingCards, target)

			if (isValid) {
				if (pile.cardIds.length > 0) return target

				openCascade ??= target
			}
		}

		if (movingCards.length === 1 && from.zone !== 'cell') {
			for (const [x, id] of state.cells!.entries()) {
				if (id === null) return { zone: 'cell', x }
			}
		} 

		return openCascade ?? eligibleFoundation
	},
}
