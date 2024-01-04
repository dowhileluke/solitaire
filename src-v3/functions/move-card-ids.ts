import { tail } from '@dowhileluke/fns'
import { CARD_DATA } from '../data'
import { CardId, GameState, Position } from '../types'
import { truncatePile, extendPile, toPile } from './pile'

function purgeCardIds(state: GameState, target: Position) {
	const result: GameState = { ...state }

	if (target.zone === 'foundation') {
		result.foundations = state.foundations.map((id, x) => {
			if (x !== target.x || id === null) return id

			const card = CARD_DATA[id]

			return card.rank === 0 ? null : (id - 1)
		})

		return result
	}

	if (target.zone === 'tableau') {
		result.tableau = state.tableau.map((pile, x) => x === target.x ? truncatePile(pile, target.y) : pile)

		return result
	}

	if (target.zone === 'cell') {
		result.cells = state.cells.map((id, x) => x === target.x ? null : id)

		return result
	}

	if (target.zone === 'waste') {
		result.waste = state.waste ? truncatePile(state.waste, -1) : null

		return result
	}

	throw new Error('Unknown zone!')
}

function placeCardIds(state: GameState, cardIds: CardId[], target: Position) {
	const result: GameState = { ...state }

	if (target.zone === 'foundation') {
		result.foundations = state.foundations.map((id, x) => x === target.x ? cardIds[0] : id)

		return result
	}

	if (target.zone === 'tableau') {
		result.tableau = state.tableau.map((pile, x) => x === target.x ? extendPile(pile, cardIds) : pile)

		return result
	}

	if (target.zone === 'cell') {
		result.cells = state.cells.map((id, x) => x === target.x ? cardIds[0] : id)

		return result
	}

	throw new Error('Unknown zone!')
}

export function moveCardIds(state: GameState, cardIds: CardId[], from: Position, to: Position) {
	return placeCardIds(purgeCardIds(state, from), cardIds, to)
}

export function swapMerciCardIds(state: GameState, merciX: number, to: Position) {
	if (to.zone !== 'tableau') throw new Error('Invalid merci zone!')

	const merciCardId = tail(state.tableau[merciX].cardIds)
	const otherCardId = state.tableau[to.x].cardIds[to.y]

	const tableau = state.tableau.map((pile, x) => {
		const isMerciX = x === merciX
		const isOtherX = x === to.x

		if (!isMerciX && !isOtherX) return pile

		const clone = pile.cardIds.slice()

		if (isMerciX) clone[clone.length - 1] = otherCardId
		if (isOtherX) clone[to.y] = merciCardId

		return toPile(clone, pile.down)
	})

	const result: GameState = {
		...state,
		tableau,
		merciUsed: state.merciUsed + 1,
	}

	return result
}
