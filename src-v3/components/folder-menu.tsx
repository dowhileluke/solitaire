import { useEffect, useRef } from 'react'
import { ArrowElbowDownRight, FolderOpen, FolderSimple, Star } from '@phosphor-icons/react'
import { GameFamily, GAME_FAMILIES, GAME_CATALOG, GAMES_BY_FAMILY } from '../games2'
import { useAppState } from '../hooks/use-app-state'
import { concat } from '../functions/concat'
import classes from './folder-menu.module.css'
import { ScrollArea } from './scroll-area'

type FolderFamily = GameFamily | 'Starred'
type FolderProps = {
	family: FolderFamily;
}

function getGameList(family: FolderFamily) {
	if (family === 'Starred') return []

	return GAMES_BY_FAMILY[family] ?? []
}

function GameFolder({ family }: FolderProps) {
	const [state, actions] = useAppState()
	const itemRef = useRef<HTMLLIElement>(null)
	// const listRef = useRef<HTMLUListElement>(null)
	// const selectedGame = state.menuKey ? GAME_CATALOG[state.menuKey] : null
	// const isExpanded = selectedGame?.family === family
	// const FolderIcon = isExpanded ? FolderOpen : FolderSimple
	const gameList = getGameList(family)
	const filteredList = state.isMenuFiltered
		? gameList.filter(x => state.prefs[x.key]?.isFavorite || state.gameKey === x.key)
		: gameList

	// function handleFolderClick() {
	// 	if (isExpanded || folderGames.length === 0) {
	// 		actions.setMenuKey(null)
	// 	} else {
	// 		actions.setMenuKey(folderGames[0].key)
	// 	}
	// }

	useEffect(() => {
		if (itemRef.current) {
			itemRef.current.scrollIntoView({ block: 'center' })
		}
	}, [state.isMenuFiltered])

	return (
		<>
			{(family === 'Starred' || !state.isMenuFiltered) && (
				<h6 className={concat(classes.heading)} >
					<div className={classes.line} />
					{family}
				</h6>
			)}
			{filteredList.length > 0 && (
				<ul>
					{filteredList.map(def => {
						const isSelected = def.key === state.menuKey
						const isFavorite = state.prefs[def.key]?.isFavorite ?? false

						return (
							<li
								key={def.key}
								ref={isSelected ? itemRef : null}
								className={concat(classes.item, isSelected && classes.selected)}
							>
								<button
									className={classes.star}
									onClick={() => actions.setGamePref(def.key, 'isFavorite', !isFavorite)}
								>
									<Star weight={isFavorite ? 'fill' : 'regular'} />
								</button>
								<div className={classes.label} onClick={() => actions.setMenuKey(def.key)}>
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
			)}
		</>
	)
}

export function FolderMenu() {
	const [state] = useAppState()

	return (
		<ScrollArea>
			{state.isMenuFiltered && (
				<GameFolder family="Starred" />
			)}
			{GAME_FAMILIES.map(f => (
				<GameFolder key={f} family={f} />
			))}
		</ScrollArea>
	)
}
