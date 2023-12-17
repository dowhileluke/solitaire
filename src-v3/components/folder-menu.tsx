import { useEffect, useRef } from 'react'
import { ArrowElbowDownRight, FolderOpen, FolderSimple, Star } from '@phosphor-icons/react'
import { GameFamily, GAME_FAMILIES, GAME_CATALOG, GAMES_BY_FAMILY } from '../games2'
import { useAppState } from '../hooks/use-app-state'
import { concat } from '../functions/concat'
import classes from './folder-menu.module.css'

type FolderProps = {
	family: GameFamily;
}

function GameFolder({ family }: FolderProps) {
	const [state, actions] = useAppState()
	// const listRef = useRef<HTMLUListElement>(null)
	// const selectedGame = state.menuKey ? GAME_CATALOG[state.menuKey] : null
	// const isExpanded = selectedGame?.family === family
	// const FolderIcon = isExpanded ? FolderOpen : FolderSimple
	const folderGames = GAMES_BY_FAMILY[family] ?? []

	// function handleFolderClick() {
	// 	if (isExpanded || folderGames.length === 0) {
	// 		actions.setMenuKey(null)
	// 	} else {
	// 		actions.setMenuKey(folderGames[0].key)
	// 	}
	// }

	return (
		<>
			<h6 className={concat(classes.heading)} >
				<div className={classes.line} />
				{family}
			</h6>
			<ul>
				{folderGames.map(def => {
					const isSelected = def.key === state.menuKey

					return (
						<li
							key={def.key}
							className={concat(classes.item, isSelected && classes.selected)}
							onClick={() => actions.setMenuKey(def.key)}
						>
							<Star />
							<div>
								{isSelected ? (
									<>
										<div>{def.name}</div>
										<div className={classes.note}>{def.shortRules}</div>
									</>
								) : def.name}
							</div>
						</li>
					)
				})}
			</ul>
		</>
	)
}

export function FolderMenu() {
	return (
		<div>
			{GAME_FAMILIES.map(f => (
				<GameFolder key={f} family={f} />
			))}
		</div>
	)
}
