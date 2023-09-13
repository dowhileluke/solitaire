import { Rules } from '../types'
import { freecell } from './freecell'
import { klondike } from './klondike'
import { spiderette } from './spiderette'
// import { spider } from './spider'

export type Mode = 'spiderette' | 'klondike' | 'freecell'
export const MODES: Mode[] = ['spiderette', 'klondike', 'freecell']
export const RULES: Record<Mode, Rules> = {
	spiderette,
	klondike,
	freecell,
}
