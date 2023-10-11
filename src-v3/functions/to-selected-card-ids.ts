import { GameState, Position } from "../types"

const NO_CARDS: never[] = []

export function toSelectedCardIds(state: GameState, selection: Position) {
	if (selection.zone === 'tableau') {
		return state.tableau[selection.x].cardIds.slice(selection.y)
	} else if (selection.zone === 'foundation' || selection.zone === 'cell') {
		const id = state.foundations[selection.x]

		return id === null ? NO_CARDS : [id]
	}

	return NO_CARDS
}
