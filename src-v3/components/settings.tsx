import { useMemo } from 'react'
import { Export } from '@phosphor-icons/react'
import { generateArray } from '@dowhileluke/fns'
import { isOpenGame } from '../functions/is-open-game'
import { toPlaintext } from '../functions/to-plaintext'
import { useAppState } from '../hooks/use-app-state'
import { ColorMode, ThemeMode } from '../types'
import { VERSION, LATEST_VERSION } from '../version'
import { Button, LabeledPicker, LabeledValue } from './interactive'
import { Pile, PileProps } from './pile'
import classes from './settings.module.css'
import pileClasses from './card-pile.module.css'
import interactiveClasses from './interactive.module.css'

const colorModes: Array<LabeledValue<ColorMode>> = [
	{ label: 'Never', value: false, },
	{ label: 'Orange/Blue', value: 'rummi', },
	{ label: 'Blue/Green', value: 'poli', },
	{ label: 'Vivid', value: 'copa', },
]

const themeModes: Array<LabeledValue<ThemeMode>> = [
	{ label: 'Standard', value: false, },
	{ label: 'Chalk', value: 'chalk', },
	{ label: 'Grass', value: 'grass', },
	{ label: 'Sand', value: 'sand', },
]

const settingsClass = `ui-pad ui-gap overflow-hidden ${classes.settings}`
const splitClass = `${classes.split} overflow-hidden`
const panelClass = `${classes.panel} justify-center overflow-hidden`
const labelClass = `${interactiveClasses.labeled} overflow-hidden`
const previewClass = `${classes.preview} noise overflow-hidden`

// [[27, 0], [25, 50], [33], []]
const previewPiles: PileProps[] = [
	{ cardIds: [27, 0], down: 0, toPos: null, },
	{ cardIds: [0, 25, 50], down: 1, toPos: null, },
	{ cardIds: [], down: 0, toPos: () => ({ zone: 'merci' }), },
	{ cardIds: [0, 0, 0, 0], down: 4, toPos: null, },
]

const panel = (
	<div className={panelClass}>
		<div className={labelClass}>
			<div>Preview</div>
			<div className={previewClass}>
				<div className={classes.piles}>
				{previewPiles.map((props, index) => {
					return (
						<ul key={index} className={pileClasses.pile}>
							<Pile {...props} />
						</ul>
					)
				})}
				</div>
			</div>
		</div>
	</div>
)

export function Settings() {
	const [{ config, history, colorMode, themeMode }, { setColorMode, setThemeMode }] = useAppState()
	const isOpen = useMemo(() => isOpenGame(config), [config])

	function handleExport() {
		if (history.length === 0) return

		const txt = toPlaintext(history[0])

		if (navigator.clipboard.write) {
			navigator.clipboard.write([
				new ClipboardItem({
					'text/plain': txt,
				})
			])
		} else {
			navigator.clipboard.writeText(txt)
		}

	}

	return (
		<div className={settingsClass}>
			<div className={splitClass}>
				<div>
					<LabeledPicker
						label="Four Color Mode"
						value={colorMode}
						onChange={mode => setColorMode(mode)}
						options={colorModes}
					/>
					<br />
					<LabeledPicker
						label="Theme"
						value={themeMode}
						onChange={mode => setThemeMode(mode)}
						options={themeModes}
					/>
					<br />
					<br />
					{isOpen && (
						<Button accented onClick={handleExport}>
							<Export />
							Export Board
						</Button>
					)}
				</div>
				{panel}
			</div>
			<div className={classes.note}>v{VERSION} - {LATEST_VERSION.name}</div>
		</div>
	)
}
