import { CARD_DATA } from '../data'
import { CardId, GameState, Position } from '../types'
import { truncatePile, extendPile } from './pile'

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
