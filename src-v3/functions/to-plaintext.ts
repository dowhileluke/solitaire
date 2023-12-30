import { truthy } from '@dowhileluke/fns'
import { CARD_DATA } from '../data'
import { GameState } from '../types'

export function toPlaintext(state: GameState) {
	const fcText = state.cells.filter(x => x !== null).map(id => CARD_DATA[id!].initials).join(' ')
	const result = truthy([
		fcText && `FC: ${fcText}`,
		state.tableau.map(t => t.cardIds.map(id => CARD_DATA[id].initials).join(' ')).join('\n')
	]).join('\n').toUpperCase()

	return result
}
