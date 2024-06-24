import { useMemo } from 'react'
import { Export } from '@phosphor-icons/react'
import { isOpenGame } from '../functions/is-open-game'
import { toPlaintext } from '../functions/to-plaintext'
import { useAppState } from '../hooks/use-app-state'
import { ColorMode } from '../types'
import { VERSION, LATEST_VERSION } from '../version'
import { Button, LabeledPicker, LabeledValue } from './interactive'
import classes from './settings.module.css'

const colorModes: Array<LabeledValue<ColorMode>> = [
	{ label: 'Disabled', value: false, },
	{ label: 'Enabled', value: 'rummi', },
	// { label: 'Blue/Green', value: 'poli', },
]

const settingsClass = `ui-pad ui-gap ${classes.settings}`

export function Settings() {
	const [{ config, history, colorMode }, { setColorMode }] = useAppState()
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
			<div>
				<LabeledPicker
					label="Four Color Mode"
					value={colorMode}
					onChange={mode => setColorMode(mode)}
					options={colorModes}
				/>
				<br />
				{isOpen && (
					<Button accented onClick={handleExport}>
						<Export />
						Export Board
					</Button>
				)}
			</div>
			<div className={classes.note}>v{VERSION} - {LATEST_VERSION.name}</div>
		</div>
	)
}
