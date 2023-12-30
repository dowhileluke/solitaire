import { GameDef } from '../games2'
import { isFullyDealtGame } from './is-fully-dealt-game'

export function isOpenGame(def: Required<GameDef>) {
	if (def.upPiles !== true && def.upPiles < def.piles) return false

	return isFullyDealtGame(def)
}
