import { GameDef } from '../games2'

export function isFullyDealtGame(def: Required<GameDef>) {
	if (def.dealLimit > 0) return false

	const p = def.piles
	const pileCardCount = def.pileHeight < 0 ? (p * (p + 1) / 2) : p * def.pileHeight
	const overCardCount = p * def.overHeight
	const dealtCount = pileCardCount + overCardCount
	
	return dealtCount >= def.decks * 52
}
