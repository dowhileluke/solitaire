import { CARD_DATA } from '../data'
import { GameDef } from '../games2'
import { GameState, Pile } from '../types'

function isSorted(tableau: Pile[], height: number) {
	return tableau.every(pile => {
		const pileHeight = pile.cardIds.length

		if (pileHeight === 0) return true
		if (pileHeight !== height) return false

		const pileRank = CARD_DATA[pile.cardIds[0]].rank

		return pile.cardIds.slice(1).every(cardId => CARD_DATA[cardId].rank === pileRank)
	})
}

export function isGameComplete({ tableau, stock, cells, waste }: GameState, { decks, goal }: Required<GameDef>) {
	if (goal === 'sorted') return isSorted(tableau, decks * 4)

	if (stock.length > 0) return false
	if (tableau.some(pile => pile.cardIds.length > 0)) return false
	if (cells.some(cardId => cardId !== null)) return false
	if (waste && waste.cardIds.length > 0) return false

	return true
}
