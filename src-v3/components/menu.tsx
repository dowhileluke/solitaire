import { ChangeEvent } from 'react'
import { Play, SkipBack } from '@phosphor-icons/react'
import { GAME_CATALOG, LayoutMode } from '../games2'
import { useAppState } from '../hooks/use-app-state'
import { Button } from './interactive'
import { Modal } from './modal'
import { MenuTabs } from './menu-tabs'
import classes from './menu.module.css'

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
			<section className="flex-center">
				{state.menuKey && (
					<select value={state.prefs[state.menuKey]?.suits ?? 4} onChange={handleSuits}>
						<option value="1">One Suit</option>
						<option value="2">Two Suits</option>
						<option value="3">Three Suits</option>
						<option value="4">Four Suits</option>
					</select>
				)}
				{state.menuKey && selectedGame && selectedGame.layoutMode === 'vertical' && (
					<select value={state.prefs[state.menuKey]?.layoutMode || 'vertical'} onChange={handleLayout}>
						<option value="vertical">Wide</option>
						<option value="horizontal">Tall</option>
					</select>
				)}
			</section>
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
