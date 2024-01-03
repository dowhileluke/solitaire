import { useMemo } from 'react'
import { Export } from '@phosphor-icons/react'
import { isOpenGame } from '../functions/is-open-game'
import { toPlaintext } from '../functions/to-plaintext'
import { useAppState } from '../hooks/use-app-state'
import { Button, LabeledPicker, LabeledValue } from './interactive'
import classes from './settings.module.css'

type Version = {
	v: string;
	name: string;
	isMajor?: boolean;
}

const VERSION_2: Version = { v: '2', name: 'Version 2', isMajor: true, }
const VERSION_HISTORY: Version[] = [
	{ v: '2.2', name: 'Whitehead & Irmgard', isMajor: true, },
	{ v: '2.1', name: 'Spider fix', isMajor: true, },
]

export const LATEST_VERSION = VERSION_HISTORY.find(v => v.isMajor) ?? VERSION_2

const enabledOpts: Array<LabeledValue<boolean>> = [
	{ label: 'Allow', value: true, },
	{ label: 'Disabled', value: false, },
]

const settingsClass = `ui-pad ui-gap ${classes.settings}`

export function Settings() {
	const [{ config, history, isFourColorEnabled }, { toggleFourColors }] = useAppState()
	const isOpen = useMemo(() => isOpenGame(config), [config])

	function handleExport() {
		if (history.length === 0) return

		navigator.clipboard.writeText(toPlaintext(history[0]))
	}

	return (
		<div className={settingsClass}>
			<div>
				<LabeledPicker
					label="Four Color Deck"
					value={isFourColorEnabled}
					onChange={yes => toggleFourColors(yes)}
					options={enabledOpts}
				/>
				<br />
				{isOpen && (
					<Button accented onClick={handleExport}>
						<Export />
						Export Board
					</Button>
				)}
			</div>
			<div className={classes.note}>v{LATEST_VERSION.v} - {LATEST_VERSION.name}</div>
		</div>
	)
}
