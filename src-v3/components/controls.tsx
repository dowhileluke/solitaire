import { ArrowCounterClockwise, List } from '@phosphor-icons/react'
import { useAppState } from '../hooks/use-app-state'
import { GAME_CATALOG } from '../games2'
import { Button } from './interactive'
import classes from './controls.module.css'
import responsive from './responsive.module.css'

const ctrlClass = `${classes.ctrl} ${responsive.ctrl}`

export function Controls() {
	const [state, actions] = useAppState()
	const gameName = GAME_CATALOG[state.config.key].name

	return (
		<nav className={ctrlClass}>
			<Button thin onClick={() => actions.toggleMenu(true)} disabled={state.isMenuOpen}>
				<List />
				<span className={responsive.hide}>
					{state.history.length > 0 ? gameName : 'Menu'}
				</span>
			</Button>
			<Button thin onClick={actions.undo} disabled={state.isMenuOpen || (state.history.length < 2 && state.merciX === null)}>
				<ArrowCounterClockwise />
				<span className={responsive.hide}>Undo</span>
			</Button>
		</nav>
	)
}
