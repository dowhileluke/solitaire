import { Export as ExportIcon, Play, SkipBack } from '@phosphor-icons/react'
import { useAppState } from '../hooks/use-app-state'
import { FolderMenu } from './folder-menu'
import { Button } from './interactive'
// import { MenuTabs } from './menu-tabs'
import { Modal } from './modal'
import classes from './menu.module.css'
import { Export } from './export'
import { ChangeEvent } from 'react'

const footClass = `flex-center ${classes.foot}`

export function Menu() {
	const [state, actions] = useAppState()

	// return (
	// 	<div>
	// 		<MenuTabs />
	// 	</div>
	// )

	function handleSuits(e: ChangeEvent<HTMLSelectElement>) {
		if (!state.menuKey) return

		const n = Number(e.target.value) as 1 | 2 | 3 | 4

		actions.setGamePref(state.menuKey, 'suits', n)
	}

	return (
		<Modal isOpen={state.isMenuOpen} onClose={() => actions.toggleMenu(false)}>
			{state.isExporting ? (<Export />) : (<FolderMenu />)}
			<section className="flex-center">
				{state.menuKey && (
					<select value={state.prefs[state.menuKey]?.suits ?? 4} onChange={handleSuits}>
						<option value="1">One Suit</option>
						<option value="2">Two Suits</option>
						<option value="3">Three Suits</option>
						<option value="4">Four Suits</option>
					</select>
				)}
			</section>
			<footer className={footClass}>
				<Button accented onClick={actions.undoAll} disabled={state.history.length < 2}>
					<SkipBack /> Retry
				</Button>
				<Button accented onClick={actions.toggleExport}>
					<ExportIcon /> Export
				</Button>
				<Button accented onClick={actions.launchGame} disabled={state.menuKey === null}>
					New Game <Play />
				</Button>
			</footer>
		</Modal>
	)
}
