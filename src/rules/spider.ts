import { categorize, generateArray, split, tail, truthy } from '@dowhileluke/fns'
import { generateDeck, shuffle, toCascade, toKlondikeLayout } from '../functions'
import { CardId, GameConfig, GameState, IsConnectedFn, Pile, Rules } from '../types'
import { CARD_DATA } from '../data'

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
	init({ suitCount }) {
		const deck = generateDeck(suitCount)
		const doubleDeck = shuffle(deck.concat(deck))
		const [stock, cards] = split(doubleDeck, 50)
		const groups = categorize(cards, (_, n) => n % 10) as Record<number, CardId[]>
		const tableau = Object.values(groups).map((cardIds): Pile => ({ cardIds, down: cardIds.length - 1 }))

		return { tableau, stock }
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
