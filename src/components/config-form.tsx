import { FastForward, Play, Rewind } from 'react-feather'
import { concat } from '../functions'
import { MODES, Mode } from '../rules'
import { GameConfig } from '../types'
import { Button } from './button'
import { LabeledValue, Pills } from './pills'

export type ConfigFormFn = (mode: Mode, config?: Partial<GameConfig>) => void

type ConfigFormProps = {
	mode: Mode;
	state: GameConfig;
	onChange: ConfigFormFn;
	onRetry?: (() => void) | null;
	submitLabel: string;
}

const MODE_LABELS: Record<Mode, string> = {
	spiderette: 'Spiderette',
	klondike: 'Klondike',
	freecell: 'FreeCell'
}

const MODE_PILLS = MODES.map((value): LabeledValue<Mode> => ({
	value, label: MODE_LABELS[value],
}))

const SUIT_PILLS: Array<LabeledValue<number>> = [
	{ value: 4, label: '4 suits' },
	{ value: 3, label: '3 suits' },
	{ value: 2, label: '2 suits' },
	{ value: 1, label: '1 suit' },
]

const SPACE_PILLS: Array<LabeledValue<boolean>> = [
	{ value: true, label: 'Extra free space' },
	{ value: false, label: 'Traditional layout' },
]

const DEAL_PILLS: Array<LabeledValue<number>> = [
	{ value: 3, label: 'Deal 3x3'},
	{ value: 2, label: 'Deal 1x1'},
	{ value: 1, label: 'Deal 3'},
	{ value: 0, label: 'Deal 1'},
]

function getNote(mode: Mode, dealFlag: number) {
	if (mode === 'spiderette') {
		return 'Traditional mode greatly increases the difficulty.'
	}

	if (mode === 'klondike') {
		const perDeal = dealFlag % 2 ? 3 : 1
		const hasDealLimit = dealFlag > 1
		const [cards, times] = perDeal === 1 ? ['card', 'once'] : ['cards', 'thrice']

		let note = `Deal ${perDeal} ${cards} at a time`

		if (hasDealLimit) {
			note += `, ${times} through the deck`
		}
	
		return note + '.'
	}
}

export function ConfigForm({ mode, state, onChange, onRetry, submitLabel }: ConfigFormProps) {
	const isKlondike = mode === 'klondike'
	const note = getNote(mode, state.dealFlag)

	return (
		<>
			<Pills value={mode} onChange={m => onChange(m)} options={MODE_PILLS} />
			<Pills value={state.suitCount} onChange={suitCount => onChange(mode, { suitCount })} options={SUIT_PILLS} />
			<div>
				{isKlondike ? (
					<Pills value={state.dealFlag} onChange={dealFlag => onChange(mode, { dealFlag })} options={DEAL_PILLS} />
				) : (
					<Pills
						value={state.hasExtraSpace}
						onChange={hasExtraSpace => onChange(mode, { hasExtraSpace })}
						options={SPACE_PILLS}
						className={mode !== 'spiderette' ? 'hidden' : ''}
					/>
				)}
				<div className={concat('note', !note && 'hidden')}>
					{note || ':)'}
				</div>
			</div>
			<div className="controls">
				{onRetry && (
					<Button isBig isBlack onClick={onRetry}>
						<Rewind size="1em" />
						Retry Game
					</Button>
				)}
				<Button type="submit" isBig isRed>
					{submitLabel}
					{onRetry ? (<FastForward size="1em" />) : (<Play size="1em" />)}
				</Button>
			</div>
		</>
	)
}