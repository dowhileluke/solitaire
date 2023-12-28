import { useAppState } from '../hooks/use-app-state'
import { Button } from './interactive'
import classes from './completion.module.css'
import { Play } from '@phosphor-icons/react'
import { concat } from '../functions/concat'

const doneClass = `${classes.done} flex-center`

export function Completion() {
	const [state, actions] = useAppState()

	if (!state.isComplete) return null

	return (
		<div className={concat(doneClass, !state.isMenuOpen && 'blur')}>
			<h2>
				Game Complete!
			</h2>
			<Button accented onClick={() => actions.launchGame(true)}>
				New Game
				<Play />
			</Button>
		</div>
	)
}
