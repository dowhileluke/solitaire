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

	if (selection.zone === 'foundation') {
		if (!state.foundations || state.foundations.length < selection.x) return NO_CARDS

		return state.foundations[selection.x].slice(-1)
	}

	if (selection.zone === 'cell') {
		if (!state.cells) return NO_CARDS

		const value = state.cells[selection.x]

		return value === null ? NO_CARDS : [value]
	}

	return NO_CARDS
}
