import { CARD_DATA } from '../data'
import { GameState, Location } from '../types'

export function toSelectedCards(state: GameState, selection: Location | null) {
	if (!selection || selection.zone !== 'tableau') return []

	return state.tableau[selection.x].cardIds.slice(selection.y).map(id => CARD_DATA[id])
}
