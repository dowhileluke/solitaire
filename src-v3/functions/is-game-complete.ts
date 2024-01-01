import { GameState } from '../types'

export function isGameComplete({ tableau, stock, cells, waste }: GameState) {
	if (stock.length > 0) return false
	if (tableau.some(pile => pile.cardIds.length > 0)) return false
	if (cells.some(cardId => cardId !== null)) return false
	if (waste && waste.cardIds.length > 0) return false

	return true
}
