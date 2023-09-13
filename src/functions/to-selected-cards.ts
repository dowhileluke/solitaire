import { GameState, Location } from '../types'

const NO_CARDS: never[] = []

export function toSelectedCards(state: GameState, selection: Location | null) {
	if (!selection) return NO_CARDS

	if (selection.zone === 'tableau') {
		return state.tableau[selection.x].cardIds.slice(selection.y)
	}

	if (selection.zone === 'waste') {
		return state.waste ? state.waste.cardIds.slice(-1) : NO_CARDS
	}

	return NO_CARDS
}
