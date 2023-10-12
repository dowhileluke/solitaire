import { split, tail } from '@dowhileluke/fns'
import { CARD_DATA } from '../data'
import { GameDef } from '../games'
import { Card, CardId, GameState, GuessedPosition, Pile, PileCard, Position, Rules } from '../types'
import { toPile, extendPile } from './pile'

function tailCard(cardIds: CardId[]) {
	return CARD_DATA[tail(cardIds)]
}

export function toRules(def: GameDef) {
	function isSequentialDesc(low: Card, high: Card) {
		return low.rank + 1 === high.rank
	}

	function isSequential(source: Card, target: Card) {
		if (isSequentialDesc(source, target)) return true
		if (def.buildDirection === 'descending') return false

		return isSequentialDesc(target, source) // inverted
	}

	function isAltColor(a: Card, b: Card) {
		return def.suits === 1 || a.isRed !== b.isRed
	}

	function isConnected(source: Card, target: Card) {
		if (def.groupRestriction === 'none') return true
		if (!isSequential(source, target)) return false
		if (def.groupRestriction === 'suit') return source.suit === target.suit
		if (def.groupRestriction === 'alt-color') return isAltColor(source, target)

		// else use supermove logic
		if (def.buildRestriction === 'suit') return source.suit === target.suit
		if (def.buildRestriction === 'alt-color') return isAltColor(source, target)

		return true
	}

	function toPileCards(cardIds: CardId[]) {
		const cards = cardIds.map(id => CARD_DATA[id]).reverse()
		const result: PileCard[] = []

		let available = 0
		let isAvailable = true
	
		for (const [i, card] of cards.entries()) {
			const nextCard = cards[i + 1]
	
			if (isAvailable) {
				available += 1
			}
	
			if (nextCard && isConnected(card, nextCard)) {
				result.push({ ...card, isConnected: true, isAvailable })
			} else {
				result.push({ ...card, isConnected: false, isAvailable })
	
				isAvailable = false
			}
		}

		return result.reverse()
	}

	function isPackedSuit(cards: Card[]) {
		return cards.slice(1).every((x, i) => x.suit === cards[i].suit && isSequentialDesc(x, cards[i]))
	}

	function hasTailSequence(cardIds: CardId[]) {
		if (cardIds.length < 13) return false
		if (tailCard(cardIds).rank > 0) return false

		return isPackedSuit(cardIds.slice(-13).map(id => CARD_DATA[id]))
	}

	function finalizeState(state: GameState) {
		const foundations = state.foundations.slice()
		const tableau: Pile[] = []
		let { waste } = state
		let isModified = false

		for (let { cardIds, down } of state.tableau) {
			if (def.goal === 'sequence') {
				while (hasTailSequence(cardIds.slice(down))) {
					foundations.push(tail(cardIds))
					cardIds = cardIds.slice(-13)
					isModified = true
				}
			}

			if (down > 0 && down >= cardIds.length) {
				tableau.push({ cardIds, down: cardIds.length - 1 })
				isModified = true
			} else {
				tableau.push({ cardIds, down })
			}
		}

		if (waste && waste.down > 0 && waste.down >= waste.cardIds.length) {
			waste = toPile(waste.cardIds, waste.cardIds.length - 1)
			isModified = true
		}

		if (!isModified) return state

		return {
			...state,
			foundations,
			tableau,
			waste,
		}
	}

	function isCompatible(source: Card, target: Card) {
		if (!isSequential(source, target)) return false
		if (def.buildRestriction === 'none') return true
		if (def.buildRestriction === 'suit') return source.suit === target.suit

		return isAltColor(source, target)
	}

	function isValidInvertedMove(state: GameState, cards: Card[], to: Position) {
		if (def.buildDirection === 'descending') return false
		if (cards.length === 1) return false
		if (to.zone !== 'tableau') return false

		const targetPile = state.tableau[to.x]

		if (targetPile.cardIds.length === 0) return def.emptyRestriction === 'none' || tail(cards).rank === 12

		return isCompatible(tail(cards), tailCard(targetPile.cardIds))
	}

	function getMaximumLength(state: GameState, isKingTailed: boolean) {
		if (def.groupRestriction !== 'restricted') return 999

		const isKingsOnly = def.emptyRestriction === 'kings'
		const freeCells = state.cells.filter(x => x === null).length
		const freePiles = state.tableau.filter(pile => pile.cardIds.length === 0).length

		// double invert
		if (def.buildDirection === 'either' && (!isKingsOnly || isKingTailed) && freePiles > 0) return 999

		if (isKingsOnly) return freeCells + 1

		return (freeCells + 1) * (2 ** freePiles)
	}

	function isValidSimpleMove(state: GameState, cards: Card[], to: Position) {
		if (to.zone === 'tableau') {
			const maxLength = cards.length === 1 ? 999 : getMaximumLength(state, tail(cards).rank === 12)

			if (cards.length > maxLength) return false

			const isKingsOnly = def.emptyRestriction === 'kings'
			const targetPile = state.tableau[to.x]

			if (targetPile.cardIds.length === 0) {
				if (isKingsOnly) return cards[0].rank === 12

				const halfMax = maxLength >> 1

				if (cards.length > halfMax) return false

				return true
			}

			return isCompatible(cards[0], tailCard(targetPile.cardIds))
		}

		if (to.zone === 'foundation') {
			if (def.goal === 'sequence') return false
			if (!isPackedSuit(cards)) return false

			const targetId = state.foundations[to.x]
			const lowestCard = tail(cards)

			if (targetId === null) return lowestCard.rank === 0

			const targetCard = CARD_DATA[targetId]

			return targetCard.suit === lowestCard.suit && isSequentialDesc(targetCard, lowestCard)
		}

		if (to.zone === 'cell') {
			return cards.length === 1 && state.cells[to.x] === null
		}

		throw new Error('Unknown zone!')
	}

	function isValidMove(state: GameState, movingCardIds: CardId[], to: Position) {
		const movingCards = movingCardIds.map(id => CARD_DATA[id])

		if (isValidInvertedMove(state, movingCards, to)) return 'invert'
		if (isValidSimpleMove(state, movingCards, to)) return 'simple'

		return false
	}

	function getSafeRank(state: GameState) {
		let lowest = 999

		for (const id of state.foundations) {
			if (id === null) return 2

			const { rank } = CARD_DATA[id]

			if (rank < lowest) lowest = rank
		}

		return lowest + 2
	}

	function guessMove(state: GameState, movingCardIds: CardId[], from: Position) {
		const highestCard = CARD_DATA[movingCardIds[0]]
		let eligibleFoundation: GuessedPosition | null = null

		if (from.zone !== 'foundation') {
			const safeRank = def.buildRestriction === 'suit' || def.suits === 1 ? 999 : getSafeRank(state)

			for (let x = 0; x < state.foundations.length && eligibleFoundation === null; x++) {
				const guess: GuessedPosition = { zone: 'foundation', x }

				if (isValidMove(state, movingCardIds, guess)) {
					if (highestCard.rank <= safeRank) return guess

					eligibleFoundation = guess
				}
			}
		}

		const isKingsOnly = def.emptyRestriction === 'kings'
		const isSuitInsensitive = def.suits === 1 || def.buildRestriction !== 'none'
		const invalidX = from.zone === 'tableau' ? from.x : 999
		let eligibleSpace: GuessedPosition | null = null
		let eligiblePile: GuessedPosition | null = null

		for (let x = 0; x < state.tableau.length; x++) {
			if (x === invalidX) continue

			const guess: GuessedPosition = { zone: 'tableau', x, y: 0 }
			const isValid = isValidMove(state, movingCardIds, guess)

			if (isValid === 'invert') guess.invert = true

			if (isValid) {
				const targetPile = state.tableau[x]
				
				if (targetPile.cardIds.length === 0) {
					if (isKingsOnly) return guess

					eligibleSpace ??= guess
				} else {
					if (isSuitInsensitive) return guess
					if (tailCard(targetPile.cardIds).suit === highestCard.suit) return guess

					if (eligiblePile === null || (isValid === 'invert' && !eligiblePile.invert)) {
						eligiblePile = guess
					}
				}
			}
		}

		if (eligiblePile) return eligiblePile

		if (from.zone !== 'cell') {
			for (let x = 0; x < state.cells.length; x++) {
				const guess: GuessedPosition = { zone: 'cell', x }

				if (isValidMove(state, movingCardIds, guess)) return guess
			}
		}

		return eligibleFoundation ?? eligibleSpace ?? null
	}

	function isWideDealAllowed({ tableau }: GameState) {
		let empty = 0
		let multi = 0
	
		for (const { cardIds } of tableau) {
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

	function dealStock(state: GameState) {
		const { dealLimit = 0, wasteRate = 0 } = def
		const isEmpty = state.stock.length === 0

		if (wasteRate) {
			if (!state.waste) return null

			if (isEmpty) {
				if (dealLimit && state.pass >= dealLimit) return null

				const [flippedIds, stock] = split(state.waste.cardIds, wasteRate)
				const result: GameState = {
					...state,
					stock,
					waste: toPile(flippedIds, 0),
					pass: state.pass + 1,
				}

				return result
			}

			const [flippedIds, stock] = split(state.stock, wasteRate)
			const result: GameState = {
				...state,
				stock,
				waste: {
					cardIds: state.waste.cardIds.concat(flippedIds),
					down: state.waste.cardIds.length,
				},
			}

			return result
		}

		if (isEmpty) return null
		if (def.emptyRestriction === 'none' && !isWideDealAllowed(state)) return null

		const [flippedIds, stock] = split(state.stock, state.tableau.length)
		const tableau = state.tableau.map(
			(pile, x) => x < flippedIds.length ? extendPile(pile, [flippedIds[x]]) : pile
		)
		const result: GameState = {
			...state,
			tableau,
			stock,
		}

		return result
	}

	const result: Rules = {
		isConnected,
		toPileCards,
		finalizeState,
		isValidMove,
		guessMove,
		dealStock,
	}

	return result
}
