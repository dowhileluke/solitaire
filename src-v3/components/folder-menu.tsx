import { ArrowElbowDownRight, FolderOpen, FolderSimple } from '@phosphor-icons/react'
import { GameFamily, GAME_FAMILIES, GAME_CATALOG, GAMES_BY_FAMILY } from '../games2'
import { useAppState } from '../hooks/use-app-state'
import { concat } from '../functions/concat'
import classes from './folder-menu.module.css'

type FolderProps = {
	family: GameFamily;
}

function GameFolder({ family }: FolderProps) {
	const [state, actions] = useAppState()
	const selectedGame = state.menuKey ? GAME_CATALOG[state.menuKey] : null
	const isExpanded = selectedGame?.family === family
	const FolderIcon = isExpanded ? FolderOpen : FolderSimple
	const folderGames = GAMES_BY_FAMILY[family] ?? []

	function handleFolderClick() {
		if (isExpanded || folderGames.length === 0) {
			actions.setMenuKey(null)
		} else {
			actions.setMenuKey(folderGames[0].key)
		}
	}

	return (
		<>
			<h2
				className={concat(classes.label, classes.heading)}
				onClick={handleFolderClick}
			>
				<FolderIcon />
				{family}
			</h2>
			{isExpanded && (
				<div>
					{folderGames.map(def => (
						<div
							key={def.key}
							className={concat(
								classes.label,
								def.key === state.menuKey && classes.selected,
							)}
							onClick={() => actions.setMenuKey(def.key)}
						>
							<ArrowElbowDownRight />
							{def.name}
						</div>
					))}
				</div>
			)}
		</>
	)
}

export function FolderMenu() {
	return (
		<div className={classes.menu}>
			{GAME_FAMILIES.map(family => (
				<GameFolder key={family.key} family={family.key} />
			))}
		</div>
	)
}
