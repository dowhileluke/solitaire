import { generateArray, tail } from '@dowhileluke/fns'
import { CARD_DATA } from '../data'
import { generateDeck, isSequential, shuffle, toFlatLayout } from '../functions'
import { CardId, IsConnectedFn, IsValidTargetFn, Location, Pile, Rules } from '../types'

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

const isValidTarget: IsValidTargetFn = (config, state, movingCards, to) => {
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

	// bypass this step for single cards
	const maxHeight = movingCards.length > 1 ? getMaxHeight(state.tableau, state.cells ?? []) : 999

	if (movingCards.length > maxHeight) return false

	if (to.zone === 'tableau') {
		const halfMax = maxHeight >> 1
		const targetPile = state.tableau[to.x]

		if (targetPile.cardIds.length === 0) return movingCards.length <= halfMax

		const targetCard = CARD_DATA[tail(targetPile.cardIds)]

		return isConnected(movingCards[0], targetCard, config)
	}

	if (movingCards.length !== 1) return false
	if (to.zone === 'cell') return state.cells![to.x] === null

	return false
}

export const freecell: Rules = {
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
	isValidTarget,
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
		const isBakers = Boolean(config.modeFlags & FLAG_BAKERS_GAME) || config.suitCount === 1
		const lowestFoundationRank = state.foundations.reduce((lo, f) => Math.min(lo, f.length), 999) - 1
		let eligibleFoundation: Location | null = null

		for (const target of generateArray(state.foundations.length, (x): Location => ({ zone: 'foundation', x, y: 0 }))) {
			const isValid = isValidTarget(config, state, movingCards, target)

			if (isValid) {
				if (isBakers || movingCards[0].rank < lowestFoundationRank + 3) return target

				eligibleFoundation ??= target
			}
		}

		let openCascade: Location | null = null

		for (const [x, pile] of state.tableau.entries()) {
			const target: Location = { zone: 'tableau', x, y: 0 }
			const isValid = isValidTarget(config, state, movingCards, target)

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
