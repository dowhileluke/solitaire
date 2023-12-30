import { useMemo } from 'react'
import { Export } from '@phosphor-icons/react'
import { tail } from '@dowhileluke/fns'
import { isOpenGame } from '../functions/is-open-game'
import { toPlaintext } from '../functions/to-plaintext'
import { useAppState } from '../hooks/use-app-state'
import { Button } from './interactive'
import { ScrollArea } from './scroll-area'

export function Settings() {
	const [{ config, history }] = useAppState()
	const isOpen = useMemo(() => isOpenGame(config), [config])

	function handleExport() {
		if (history.length === 0) return

		navigator.clipboard.writeText(toPlaintext(tail(history)))
	}

	return (
		<ScrollArea>
			{isOpen && (
				<Button accented onClick={handleExport}>
					<Export />
					Export Board
				</Button>
			)}
		</ScrollArea>
	)
}
