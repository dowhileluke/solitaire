import { ArrowCounterClockwise, List } from '@phosphor-icons/react'
import { useAppState } from '../hooks/use-app-state'
import { GAME_CATALOG } from '../games2'
import { Button } from './interactive'
import classes from './controls.module.css'
import responsive from './responsive.module.css'

const ctrlClass = `${classes.ctrl} ${responsive.ctrl}`

export function Controls() {
	const [state, actions] = useAppState()

	return (
		<nav className={ctrlClass}>
			<Button thin onClick={() => actions.toggleMenu(true)} disabled={state.isMenuOpen}>
				<List />
				<span className={responsive.hide}>
					{GAME_CATALOG[state.config.key].name}
				</span>
			</Button>
			<Button thin onClick={actions.undo} disabled={state.isMenuOpen || state.history.length < 2}>
				<ArrowCounterClockwise />
				<span className={responsive.hide}>Undo</span>
			</Button>
		</nav>
	)
}
