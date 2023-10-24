import { ArrowCounterClockwise, List } from '@phosphor-icons/react'
import { useAppState } from '../hooks/use-app-state'
import { Button } from './interactive'
import classes from './controls.module.css'
import responsive from './responsive.module.css'

const ctrlClass = `${classes.ctrl} ${responsive.ctrl}`

export function Controls() {
	const [, actions] = useAppState()

	return (
		<nav className={ctrlClass}>
			<Button thin onClick={actions.launchGame}>
				<List />
				<span className={responsive.hide}>Launch</span>
			</Button>
			<Button thin onClick={actions.undo}>
				<ArrowCounterClockwise />
				<span className={responsive.hide}>Undo</span>
			</Button>
		</nav>
	)
}
