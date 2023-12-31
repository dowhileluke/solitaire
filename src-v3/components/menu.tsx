import { ChangeEvent } from 'react'
import { Play, SkipBack } from '@phosphor-icons/react'
import { GAME_CATALOG, LayoutMode } from '../games2'
import { useAppState } from '../hooks/use-app-state'
import { Button } from './interactive'
import { Modal } from './modal'
import { MenuTabs } from './menu-tabs'
import classes from './menu.module.css'
import { Prefs } from './prefs'

const footClass = `flex-center ${classes.foot}`

export function Menu() {
	const [state, actions] = useAppState()
	const selectedGame = state.menuKey ? GAME_CATALOG[state.menuKey] : null

	// return (
	// 	<div>
	// 		<MenuTabs />
	// 	</div>
	// )

	function handleSuits(e: ChangeEvent<HTMLSelectElement>) {
		const n = Number(e.target.value) as 1 | 2 | 3 | 4

		actions.setGamePref(state.menuKey, 'suits', n)
	}

	function handleLayout(e: ChangeEvent<HTMLSelectElement>) {
		actions.setGamePref(state.menuKey, 'layoutMode', e.target.value as LayoutMode)
	}

	return (
		<Modal isOpen={state.isMenuOpen} onClose={() => actions.toggleMenu(false)}>
			<MenuTabs />
			<Prefs />
			<footer className={footClass}>
				<Button big accented onClick={actions.undoAll} disabled={state.history.length < 2}>
					<SkipBack /> Retry
				</Button>
				<Button big accented onClick={() => actions.launchGame(false)}>
					New Game <Play />
				</Button>
			</footer>
		</Modal>
	)
}
