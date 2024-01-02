import { truthy } from '@dowhileluke/fns'
import { CARD_DATA } from '../data'
import { GameState } from '../types'

export function toPlaintext(state: GameState) {
	const cellsText = state.cells.filter(x => x !== null).map(id => CARD_DATA[id!].initials).join(' ')
	const acesText = state.foundations.filter(x => x !== null).map(id => CARD_DATA[id!].initials).join(' ')
	const pilesText = state.tableau.map(t => t.cardIds.map(id => CARD_DATA[id].initials).join(' '))

	if (acesText) pilesText[0] += ` ${acesText}`

	const result = truthy([
		cellsText && `FC: ${cellsText}`,
		pilesText.join('\n')
	]).join('\n').toUpperCase()

	return result
}
