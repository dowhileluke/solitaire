import { Rules, RulesV2 } from '../types'
import { freecellV2 } from './freecell'
import { klondike } from './klondike'
import { spiderV2 } from './spider'
import { LabeledValue } from '../components/pills'

export type Mode = 'spiderette' | 'klondike' | 'freecell'
export const MODES: Mode[] = ['spiderette', 'klondike', 'freecell']
export const RULES: Record<Mode, Rules | RulesV2> = {
	spiderette: spiderV2,
	klondike,
	freecell: freecellV2,
}

const MODE_LABELS: Record<Mode, string> = {
	spiderette: 'Spider',
	klondike: 'Klondike',
	freecell: 'FreeCell'
}

export const MODE_OPTIONS = MODES.map((value): LabeledValue<Mode> => ({
	value, label: MODE_LABELS[value],
}))
