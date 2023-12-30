import { useMemo } from 'react'
import { Export } from '@phosphor-icons/react'
import { tail } from '@dowhileluke/fns'
import { isOpenGame } from '../functions/is-open-game'
import { toPlaintext } from '../functions/to-plaintext'
import { useAppState } from '../hooks/use-app-state'
import { Button, LabeledPicker, LabeledValue } from './interactive'
import { ScrollArea } from './scroll-area'

const enabledOpts: Array<LabeledValue<boolean>> = [
	{ label: 'Allow', value: true, },
	{ label: 'Disabled', value: false, },
]

export function Settings() {
	const [{ config, history, isFourColorEnabled }, { toggleFourColors }] = useAppState()
	const isOpen = useMemo(() => isOpenGame(config), [config])

	function handleExport() {
		if (history.length === 0) return

		navigator.clipboard.writeText(toPlaintext(tail(history)))
	}

	return (
		<ScrollArea>
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
		</ScrollArea>
	)
}
