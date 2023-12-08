import { truthy } from '@dowhileluke/fns'
import { CARD_DATA } from '../data'
import { useAppState } from '../hooks/use-app-state'
import { Button } from './interactive'

export function Export() {
	const [{ history }, { toggleExport }] = useAppState()

	if (history.length === 0) return null

	const fcText = history[0].cells.filter(x => x !== null).map(id => CARD_DATA[id!].initials).join(' ')

	const text = truthy([
		fcText && `FC: ${fcText}`,
		history[0].tableau.map(t => t.cardIds.map(id => CARD_DATA[id].initials).join(' ')).join('\n')
	]).join('\n').toUpperCase()

	return (
		<>
			<textarea value={text} />
			<Button onClick={toggleExport}>
				Cancel
			</Button>
		</>
	)
}
