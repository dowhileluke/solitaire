import { LayoutState, Location } from '../types'

export function toSelectedCards(layout: LayoutState, selection: Location | null) {
	if (!selection || selection.zone !== 'tableau') return []

	return layout.tableau[selection.x].cards.slice(selection.y)
}
