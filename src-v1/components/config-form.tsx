import { Info, Play, Rewind } from '@phosphor-icons/react'
import { concat } from '../functions'
import { FLAG_SUITED_ONLY } from '../rules/freecell'
import { FLAG_DEAL_LIMIT, FLAG_DEAL_TRIPLE } from '../rules/klondike'
import { FLAG_EXTRA_SPACE } from '../rules/spider'
import { GameConfig, Mode } from '../types'
import { Button } from './button'
import { LabeledValue, Pills } from './pills'

type ConfigFormProps = {
	mode: Mode;
	state: GameConfig;
	onChange: (config: Partial<GameConfig>) => void;
	onInfo?: (() => void) | null;
	onRetry?: (() => void) | null;
	submitLabel: string;
}

const SUIT_PILLS: Array<LabeledValue<number>> = [
	{ value: 4, label: '4 suits' },
	{ value: 3, label: '3 suits' },
	{ value: 2, label: '2 suits' },
	{ value: 1, label: '1 suit' },
]

const F_DOUBLE_DECK = 64
const DECK_PILLS: Array<LabeledValue<number>> = [
	{ value: 0, label: '1 deck' },
	{ value: FLAG_EXTRA_SPACE, label: '1 deck+' },
	{ value: F_DOUBLE_DECK, label: '2 decks' },
]

const DEAL_PILLS: Array<LabeledValue<number>> = [
	{ value: FLAG_DEAL_TRIPLE | FLAG_DEAL_LIMIT, label: 'Deal 3x3' },
	{ value: FLAG_DEAL_LIMIT, label: 'Deal 1x1' },
	{ value: FLAG_DEAL_TRIPLE, label: 'Deal 3' },
	{ value: 0, label: 'Deal 1' },
]

const CONNECT_PILLS: Array<LabeledValue<number>> = [
	{ value: 0, label: 'Connect alternating' },
	{ value: FLAG_SUITED_ONLY, label: 'Connect suited' },
]

function getNote(mode: Mode, { deckCount, modeFlags, suitCount }: GameConfig) {
	if (mode === 'spiderette') {
		if (deckCount === 2) return 'Classic 10-column Spider (small screens beware)'
		if (modeFlags & FLAG_EXTRA_SPACE) return 'Spiderette with an extra empty space'
		
		return 'AKA Spiderette'
	}

	if (mode === 'klondike') {
		const perDeal = modeFlags & FLAG_DEAL_TRIPLE ? 3 : 1
		const hasPassLimit = Boolean(modeFlags & FLAG_DEAL_LIMIT)

		const times = perDeal === 1 ? 'only 1 pass' : '3 passes'
		const limit = hasPassLimit ? `, ${times} through the deck` : ''
		const cards = perDeal === 1 ? 'card' : 'cards'

		return `Deal ${perDeal} ${cards} at a time` + limit
	}

	if (mode === 'freecell' && suitCount > 1) {
		if (modeFlags & FLAG_SUITED_ONLY) return "AKA Baker\'s Game"

		return 'Build sequences with alternating colors'
	}

	if (mode === 'yukon' && suitCount > 1) {
		if (modeFlags & FLAG_SUITED_ONLY) return "AKA Russian"

		return 'Move piles to opposite colors'
	}
}

export function ConfigForm({ mode, state, onChange, onInfo, onRetry, submitLabel }: ConfigFormProps) {
	const note = getNote(mode, state)

	return (
		<>
			<Pills value={state.suitCount} onChange={suitCount => onChange({ suitCount })} options={SUIT_PILLS} />
			<div>
				{mode === 'spiderette' && (
					<Pills
						value={(state.deckCount > 1 ? F_DOUBLE_DECK : 0) | state.modeFlags}
						onChange={flags => onChange({
							deckCount: flags & F_DOUBLE_DECK ? 2 : 1,
							modeFlags: flags & FLAG_EXTRA_SPACE,
						})}
						options={DECK_PILLS}
					/>
				)}
				{mode === 'klondike' && (
					<Pills
						value={state.modeFlags}
						onChange={modeFlags => onChange({ modeFlags })}
						options={DEAL_PILLS}
					/>
				)}
				{(mode === 'freecell' || mode === 'yukon') && (
					<Pills
						value={state.modeFlags}
						onChange={modeFlags => onChange({ modeFlags })}
						options={CONNECT_PILLS}
						disabled={state.suitCount === 1}
					/>
				)}
				<div className={concat('note', !note && 'hidden')}>
					{note || ':)'}
				</div>
			</div>
			<div className="controls">
				{onRetry && (
					<Button isBig isBlack onClick={onRetry}>
						<Rewind weight="fill" />
						Retry
					</Button>
				)}
				{onInfo && (
					<Button isBig isRed isHollow onClick={onInfo}>
						<Info />
						Rules
					</Button>
				)}
				<Button type="submit" isBig isRed>
					{submitLabel}
					<Play weight="fill" />
				</Button>
			</div>
		</>
	)
}
