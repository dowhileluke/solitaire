import { Rules } from '../types'
import { klondike } from './klondike'
import { spiderette } from './spiderette'

export const MODES = ['spiderette', 'klondike'] as const

export type Mode = typeof MODES[number]

export const RULES: Record<Mode, Rules> = {
	spiderette,
	klondike,
}
