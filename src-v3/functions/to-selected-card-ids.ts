import { CardId, GameState, Position } from "../types"

const NO_CARDS: never[] = []

function asArray(id: CardId | null) {
	return id === null ? [] : [id]
}

function toSimpleCardIds(state: GameState, selection: Position) {
	if (selection.zone === 'tableau') {
		return state.tableau[selection.x].cardIds.slice(selection.y)
	} else if (selection.zone === 'foundation') {
		return asArray(state.foundations[selection.x])
	} else if (selection.zone === 'cell') {
		return asArray(state.cells[selection.x])
	} else if (selection.zone === 'waste') {
		return state.waste?.cardIds.slice(-1) ?? NO_CARDS
	}

	return NO_CARDS
}

export function toSelectedCardIds(state: GameState, selection: Position, isMerciActive = false) {
	const cardIds = toSimpleCardIds(state, selection)

	return isMerciActive ? cardIds.slice(0, 1) : cardIds
}
