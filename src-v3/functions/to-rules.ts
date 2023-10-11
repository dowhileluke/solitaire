import { tail } from '@dowhileluke/fns'
import { CARD_DATA } from '../data'
import { GameDef } from '../games'
import { Card, CardId, GameState, Pile, PileCard, Position, Rules } from '../types'
import { toSelectedCardIds } from './to-selected-card-ids'
import { toPile } from './to-pile'

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

	function getMaximumLength(state: GameState) {
		if (def.groupRestriction !== 'restricted') return 999

		const freeCells = state.cells.filter(x => x === null).length
		const freePiles = state.tableau.filter(pile => pile.cardIds.length === 0).length

		return (freeCells + 1) * (2 ** freePiles)
	}

	function isValidSimpleMove(state: GameState, cards: Card[], to: Position) {
		if (to.zone === 'tableau') {
			const maxLength = cards.length === 1 ? 999 : getMaximumLength(state)

			if (cards.length > maxLength) return false

			const targetPile = state.tableau[to.x]

			if (targetPile.cardIds.length === 0) {
				if (def.emptyRestriction === 'kings' && cards[0].rank !== 12) return false

				const halfMax = maxLength >> 1

				if (cards.length > halfMax) return false

				return true
			}

			return isCompatible(cards[0], tailCard(targetPile.cardIds))
		}

		if (to.zone === 'foundation') {
			if (!isPackedSuit(cards)) return false

			const targetId = state.foundations[to.x]
			const lowestCard = tail(cards)

			if (targetId === null) return lowestCard.rank === 0

			const targetCard = CARD_DATA[targetId]

			return targetCard.suit === lowestCard.suit && isSequentialDesc(targetCard, lowestCard)
		}

		throw new Error('Unknown zone!')
	}

	function isValidMove(state: GameState, movingCardIds: CardId[], to: Position) {
		const movingCards = movingCardIds.map(id => CARD_DATA[id])

		if (isValidInvertedMove(state, movingCards, to)) return 'invert'
		if (isValidSimpleMove(state, movingCards, to)) return 'simple'

		return false
	}

	const result: Rules = {
		isConnected,
		toPileCards,
		finalizeState,
		isValidMove,
	}

	return result
}
