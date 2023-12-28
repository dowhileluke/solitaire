import { useAppState } from '../hooks/use-app-state'
import { Play } from '@phosphor-icons/react'
import { concat } from '../functions/concat'
import { Button } from './interactive'
import responsive from './responsive.module.css'

const doneClass = `${responsive.done} flex-center`

export function Completion() {
	const [state, actions] = useAppState()

	if (!state.isComplete) return null

	return (
		<div className={concat(doneClass, !state.isMenuOpen && 'blur')}>
			<h1>
				Game Complete!
			</h1>
			<Button accented onClick={() => actions.launchGame(true)}>
				New Game
				<Play />
			</Button>
		</div>
	)
}
