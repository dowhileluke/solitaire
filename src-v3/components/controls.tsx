import { useAppState } from '../hooks/use-app-state'

export function Controls() {
	const [, actions] = useAppState()

	return (
		<nav>
			<button onClick={actions.launchGame}>Launch</button>
			<button onClick={actions.undo}>Undo</button>
		</nav>
	)
}
