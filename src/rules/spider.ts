import { split, tail } from '@dowhileluke/fns'
import { CARD_DATA } from '../data'
import { generateDeck, isSequential, shuffle, toCascade, toFlatLayout, toKlondikeLayout } from '../functions'
import { CardId, GameConfig, GameState, IsConnectedFn, Pile, Rules, RulesV2 } from '../types'
import { extendPile, trimPile } from '../functions/movement'

export const FLAG_EXTRA_SPACE = 1

const isConnected: IsConnectedFn = (a, b) => a.suit === b.suit && a.rank + 1 === b.rank

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

/** returns [validatedPile, ace?] */
function sanitize(pile: Pile, config: GameConfig) {
	const NO_CHANGE = [pile, null] as const

	if (pile.cardIds.length === 0) return NO_CHANGE

	const cascade = toCascade(pile, isConnected, config)
	const hasFullSequence = cascade.available === 13
	const cardIds = hasFullSequence ? pile.cardIds.slice(0, -13) : pile.cardIds
	let down = pile.down

	if (down > 0 && down === cardIds.length) {
		down -= 1
	} else if (!hasFullSequence) {
		return NO_CHANGE
	}

	const result: Pile = { cardIds, down }

	return [result, hasFullSequence ? tail(pile.cardIds) : null] as const
}

export const spider: Rules = {
	v: 1,
	init({ suitCount, deckCount, modeFlags }) {
		const deck = generateDeck(suitCount)
		const foundations: never[] = []

		if (deckCount === 1) {
			const layout = toKlondikeLayout(shuffle(deck), 7)

			if (modeFlags & FLAG_EXTRA_SPACE) {
				layout.tableau.unshift({ cardIds: [], down: 0 })
			}

			return { ...layout, foundations }
		}

		const doubleDeck = shuffle(deck.concat(deck))
		const [stock, cards] = split(doubleDeck, 50)
		const tableau = toFlatLayout(cards, 10)

		return { tableau, stock, foundations }
	},
	deal(config, prev) {
		if (!isDealAllowed(prev)) return null

		const [dealt, stock] = split(prev.stock, prev.tableau.length)
		const [pilesToUpdate, remaining] = split(prev.tableau, dealt.length)
		const updatedPiles: Pile[] = []
		const newFoundations: CardId[][] = []

		for (const [i, pile] of pilesToUpdate.entries()) {
			const cardIds = pile.cardIds.concat(dealt[i])
			const [finalPile, ace] = sanitize({ cardIds, down: pile.down }, config)

			updatedPiles.push(finalPile)

			if (ace !== null) {
				newFoundations.unshift([ace])
			}
		}

		const result: GameState = {
			...prev,
			tableau: updatedPiles.concat(remaining),
			stock,
		}

		if (newFoundations.length > 0) {
			const existing = prev.foundations ?? []

			result.foundations = [...newFoundations, ...existing]
		}

		return result
	},
	move(config, prev, from, to) {
		if (from.zone !== 'tableau' || to.zone !== 'tableau') return null

		const fromPile = prev.tableau[from.x]
		const fromCasc = toCascade(fromPile, isConnected, config)

		if (!fromCasc.cards[from.y].isAvailable) return null

		const [stayingCardIds, movingCardIds] = split(fromPile.cardIds, from.y)
		const movingCard = CARD_DATA[movingCardIds[0]]
		const targetPile = prev.tableau[to.x]

		// validate target rank
		if (targetPile.cardIds.length > 0) {
			const targetCard = CARD_DATA[tail(targetPile.cardIds)]

			if (targetCard.rank !== movingCard.rank + 1) return null
		}

		const tableau: Pile[] = []
		let newFoundation: CardId | null = null

		for (const [x, pile] of prev.tableau.entries()) {
			if (x === to.x) {
				const cardIds = pile.cardIds.concat(movingCardIds)
				const [finalPile, ace] = sanitize({ cardIds, down: pile.down }, config)

				tableau.push(finalPile)
				newFoundation = ace
			} else if (x === from.x) {
				const [finalPile] = sanitize({ cardIds: stayingCardIds, down: pile.down }, config)

				tableau.push(finalPile)
			} else {
				tableau.push(pile)
			}
		}

		const result: GameState = {
			...prev,
			tableau,
		}

		if (newFoundation !== null) {
			const existing = prev.foundations ?? []

			result.foundations = [[newFoundation], ...existing]
		}

		return result
	},
	autoMove(config, { tableau }, from) {
		if (from.zone !== 'tableau') return null

		const fromPile = tableau[from.x]
		const fromCasc = toCascade(fromPile, isConnected, config)
		const movingCard = fromCasc.cards[from.y]

		if (!movingCard.isAvailable) return null

		const topCards = tableau.map(({ cardIds }) => cardIds.length === 0 ? null : CARD_DATA[tail(cardIds)])
		let availableX: number | null = null
		let openX: number | null = null

		for (const [x, card] of topCards.entries()) {
			if (x === from.x) continue

			if (!card) {
				openX ??= x
			} else {
				const isNext = card.rank === movingCard.rank + 1

				if (isNext) {
					if (card.suit === movingCard.suit) return { zone: 'tableau', x, y: 0 }

					availableX ??= x
				}
			}
		}

		const bestX = availableX ?? openX

		if (bestX === null) return null

		return { zone: 'tableau', x: bestX, y: 0 }
	},
	isConnected,
}

function hasFullSequence(cardIds: CardId[]) {
	const last13 = cardIds.slice(-13)

	if (last13.length !== 13) return false

	const last = tail(last13)

	if (last % 13 !== 0) return false // ends with non-Ace

	return last13.every((id, index) => id - last === 12 - index)
}

export const spiderV2: RulesV2 = {
	v: 2,
	init({ suitCount, deckCount, modeFlags }) {
		const deck = generateDeck(suitCount)
		const foundations: never[] = []

		if (deckCount === 1) {
			const layout = toKlondikeLayout(shuffle(deck), 7)

			if (modeFlags & FLAG_EXTRA_SPACE) {
				layout.tableau.unshift({ cardIds: [], down: 0 })
			}

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
	isValidTarget(_, state, movingCards, target) {
		if (target.zone !== 'tableau') return false
	
		const targetPile = state.tableau[target.x]
	
		if (targetPile.cardIds.length === 0) return true
	
		const targetCard = CARD_DATA[tail(targetPile.cardIds)]
	
		return isSequential(targetCard, movingCards[0])
	},
	guessMove(_, state, movingCards) {
		let openX: number | null = null
		let sequentialX: number | null = null
	
		for (const [x, pile] of state.tableau.entries()) {
			if (pile.cardIds.length === 0) {
				openX ??= x
			} else {
				const pileCard = CARD_DATA[tail(pile.cardIds)]
	
				if (isSequential(pileCard, movingCards[0])) {
					if (pileCard.suit === movingCards[0].suit) return { zone: 'tableau', x, y: 0 }
	
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
		let isChanged = false
		const tableau: Pile[] = []
		const foundations = state.foundations.slice()
	
		for (const pile of state.tableau) {
			if (hasFullSequence(pile.cardIds)) {
				isChanged = true
				tableau.push(trimPile(pile, pile.cardIds.length - 13))
				foundations.push(pile.cardIds.slice(-1))
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
