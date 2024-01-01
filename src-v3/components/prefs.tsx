import { GAME_CATALOG, GameDef, LayoutMode, toFullDef } from '../games2'
import { useAppState } from '../hooks/use-app-state'
import { LabeledPicker, LabeledValue } from './interactive'

const suitOpts: Array<LabeledValue<1 | 2 | 3 | 4>> = [
	{ value: 1, label: '1 suit', },
	{ value: 2, label: '2 suits', },
	{ value: 3, label: '3 suits', },
	{ value: 4, label: '4 suits', },
]

const DEAL_THREE = 1
const LIMITED = 2
const dealOpts: Array<LabeledValue<number>> = [
	{ value: LIMITED, label: '1 card, 1 deal', },
	{ value: 0, label: '1 card, no limit', },
	{ value: DEAL_THREE, label: '3 cards, no limit', },
	{ value: DEAL_THREE | LIMITED, label: '3 cards, 3 deals', },
]

const moveOpts: Array<LabeledValue<GameDef['moveRestriction']>> = [
	{ value: 'strict', label: 'Strict', },
	{ value: 'relaxed', label: 'Relaxed', },
]

const layoutOpts: Array<LabeledValue<LayoutMode>> = [
	{ value: 'horizontal', label: 'Tall', },
	{ value: 'vertical', label: 'Wide', },
]

const boolOpts: Array<LabeledValue<number>> = [
	{ value: 0, label: 'No', },
	{ value: 1, label: 'Yes', }
]

function getDealMode(def: Required<GameDef>) {
	return (def.wasteRate === 3 ? DEAL_THREE : 0) | (def.dealLimit === 0 ? 0 : LIMITED)
}

export function Prefs() {
	const [state, actions] = useAppState()
	const def = GAME_CATALOG[state.menuKey]
	const prefs = state.prefs[state.menuKey] ?? {}
	const original = toFullDef(def, state.menuKey)
	const current = toFullDef({ ...def, ...prefs }, state.menuKey)
	const dealMode = getDealMode(current)

	function handleDeal(flags: number) {
		const wasteRate = flags & DEAL_THREE ? 3 : 1
		const dealLimit = flags & LIMITED ? wasteRate : 0

		actions.setGamePref(state.menuKey, 'wasteRate', wasteRate)
		actions.setGamePref(state.menuKey, 'dealLimit', dealLimit)
	}

	return (
		<div className="flex-center ui-gap">
			<LabeledPicker
				label="Suits per Deck"
				value={current.suits}
				options={suitOpts}
				onChange={n => actions.setGamePref(state.menuKey, 'suits', n)}
				isModified={current.suits !== 4}
			/>
			{original.wasteRate > 0 && def.family === 'Klondike' && (
				<>
					<LabeledPicker
						label="Deal Speed / Limit"
						value={dealMode}
						options={dealOpts}
						onChange={handleDeal}
						isModified={dealMode !== getDealMode(original)}
					/>
				</>
			)}
			{def.moveRestriction === 'strict' && def.family === 'FreeCell' && (
				<LabeledPicker
					label="Sequence Movement"
					value={current.moveRestriction}
					options={moveOpts}
					onChange={mode => actions.setGamePref(state.menuKey, 'moveRestriction', mode)}
					isModified={current.moveRestriction !== original.moveRestriction}
				/>
			)}
			{def.layoutMode === 'vertical' && (
				<LabeledPicker
					label="Layout"
					value={current.layoutMode}
					options={layoutOpts}
					onChange={mode => actions.setGamePref(state.menuKey, 'layoutMode', mode)}
					isModified={current.layoutMode !== original.layoutMode}
				/>
			)}
			{state.menuKey === 'spiderette' && (
				<LabeledPicker
					label="Extra Space"
					value={current.emptyPiles}
					options={boolOpts}
					onChange={n => actions.setGamePref(state.menuKey, 'emptyPiles', n)}
					isModified={current.emptyPiles !== original.emptyPiles}
				/>
			)}
		</div>
	)
}
