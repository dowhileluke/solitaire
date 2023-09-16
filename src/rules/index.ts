import { Mode, Rules } from '../types'
import { freecell } from './freecell'
import { klondike } from './klondike'
import { spider } from './spider'
import { LabeledValue } from '../components/pills'

export const MODES: Mode[] = ['spiderette', 'klondike', 'freecell']
export const RULES: Record<Mode, Rules> = {
	spiderette: spider,
	klondike,
	freecell,
}

const MODE_LABELS: Record<Mode, string> = {
	spiderette: 'Spider',
	klondike: 'Klondike',
	freecell: 'FreeCell'
}

export const MODE_OPTIONS = MODES.map((value): LabeledValue<Mode> => ({
	value, label: MODE_LABELS[value],
}))
