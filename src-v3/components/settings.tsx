import { useMemo } from 'react'
import { Export } from '@phosphor-icons/react'
import { generateArray } from '@dowhileluke/fns'
import { isOpenGame } from '../functions/is-open-game'
import { toPlaintext } from '../functions/to-plaintext'
import { useAppState } from '../hooks/use-app-state'
import { ColorMode, ThemeMode } from '../types'
import { VERSION, LATEST_VERSION } from '../version'
import { Button, LabeledPicker, LabeledValue } from './interactive'
import { Pile } from './pile'
import classes from './settings.module.css'
import pileClasses from './card-pile.module.css'
import interactiveClasses from './interactive.module.css'

const colorModes: Array<LabeledValue<ColorMode>> = [
	{ label: 'Never', value: false, },
	{ label: 'Orange/Blue', value: 'rummi', },
	{ label: 'Blue/Green', value: 'poli', },
	{ label: 'Bright B/G', value: 'copa', },
]

const themeModes: Array<LabeledValue<ThemeMode>> = [
	{ label: 'Standard', value: false, },
	{ label: 'Green', value: 'green', },
]

const settingsClass = `ui-pad ui-gap overflow-hidden ${classes.settings}`
const splitClass = `${classes.split} overflow-hidden`
const panelClass = `${classes.panel} justify-center overflow-hidden`
const labelClass = `${interactiveClasses.labeled} overflow-hidden`
const previewClass = `${classes.preview} overflow-hidden`

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
				<div className={panelClass}>
					<div className={labelClass}>
						<div>Preview</div>
						<div className={previewClass}>
							<div className={classes.piles}>
							{[[27, 0], [25, 50], [33], [44]].map((cardIds, index) => {
								return (
									<ul className={pileClasses.pile}>
										<Pile cardIds={generateArray(index, () => 0).concat(cardIds)} down={index} toPos={null} />
									</ul>
								)
							})}
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className={classes.note}>v{VERSION} - {LATEST_VERSION.name}</div>
		</div>
	)
}
