import { split, tail } from '@dowhileluke/fns'
import { CARD_DATA } from '../data'
import { generateDeck, isSequential, shuffle, toFlatLayout, toAscendingLayout } from '../functions'
import { extendPile, trimPile } from '../functions/movement'
import { CardId, GameState, IsConnectedFn, Pile, Rules } from '../types'

export const FLAG_EXTRA_SPACE = 1

const isConnected: IsConnectedFn = (low, high) => isSequential(low, high) && low.suit === high.suit

function isDealAllowed<T extends GameState>(layout: T): layout is T & Required<Pick<T, 'stock'>> {
	if (!layout.stock || layout.stock.length === 0) return false

	let empty = 0
	let multi = 0

	for (const { cardIds } of layout.tableau) {
		if (cardIds.length === 0) {
			empty += 1
		} else if (cardIds.length > 1) {
			multi += 1
		}
	}

	// allow edge case where there are fewer cards than piles
	if (multi === 0) return true

	return empty === 0
}

function hasFullSequence(cardIds: CardId[]) {
	const last13 = cardIds.slice(-13)

	if (last13.length !== 13) return false

	const last = tail(last13)

	if (last % 13 !== 0) return false // ends with non-Ace

	return last13.every((id, index) => id - last === 12 - index)
}

export const spider: Rules = {
	v: 2,
	init({ suitCount, deckCount, modeFlags }) {
		const deck = generateDeck(suitCount)
		const foundations: never[] = []

		if (deckCount === 1) {
			const hasExtraSpace = Boolean(modeFlags & FLAG_EXTRA_SPACE)
			const layout = hasExtraSpace
				? toAscendingLayout(shuffle(deck), 8, 0)
				: toAscendingLayout(shuffle(deck), 7)

			return { ...layout, foundations }
		}

		const doubleDeck = shuffle(deck.concat(deck))
		const [stock, cards] = split(doubleDeck, 50)
		const tableau = toFlatLayout(cards, 10)

		return { tableau, stock, foundations }
	},
	deal(_, prev) {
		if (!isDealAllowed(prev)) return null

		const [dealt, stock] = split(prev.stock, prev.tableau.length)
		const tableau = prev.tableau.map((pile, i) => (i < dealt.length) ? extendPile(pile, [dealt[i]]) : pile)

		return { ...prev, tableau, stock }
	},
	isConnected,
	isValidTarget(_, state, movingCards, to) {
		if (to.zone !== 'tableau') return false
	
		const targetPile = state.tableau[to.x]
	
		if (targetPile.cardIds.length === 0) return true
	
		const targetCard = CARD_DATA[tail(targetPile.cardIds)]
	
		return isSequential(movingCards[0], targetCard)
	},
	guessMove(_, state, movingCards) {
		const highestMoving = movingCards[0]
		let openX: number | null = null
		let sequentialX: number | null = null
	
		for (const [x, pile] of state.tableau.entries()) {
			if (pile.cardIds.length === 0) {
				openX ??= x
			} else {
				const pileCard = CARD_DATA[tail(pile.cardIds)]
	
				if (isSequential(highestMoving, pileCard)) {
					if (highestMoving.suit === pileCard.suit) return { zone: 'tableau', x, y: 0 }
	
					sequentialX ??= x
				}
			}
		}
	
		for (const x of [sequentialX, openX]) {
			if (x !== null) return { zone: 'tableau', x, y: 0}
		}
	
		return null
	},
	validateState(state) {
		const tableau: Pile[] = []
		const foundations = state.foundations.slice()
		let isChanged = false
	
		for (const pile of state.tableau) {
			if (hasFullSequence(pile.cardIds)) {
				isChanged = true
				tableau.push(trimPile(pile, 13))
				foundations.unshift(pile.cardIds.slice(-1))
			} else {
				tableau.push(pile)
			}
		}
	
		if (!isChanged) return state
	
		return {
			...state,
			tableau,
			foundations,
		}
	},
}
