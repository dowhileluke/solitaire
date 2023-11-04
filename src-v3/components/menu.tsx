import { GAME_LIST, GameKey } from '../games2'
import { useAppState } from '../hooks/use-app-state'
import { Button } from './interactive'

const options = GAME_LIST.map(g => (
	<option key={g.key} value={g.key}>{g.name}</option>
))

export function Menu() {
	const [state, actions] = useAppState()

	return (
		<div>
			<select value={state.menuKey} onChange={e => actions.setMenuKey(e.target.value as GameKey)}>
				{options}
			</select>
			<Button onClick={actions.toggleExport}>Export</Button>
			<Button onClick={actions.launchGame}>Launch</Button>
		</div>
	)
}
