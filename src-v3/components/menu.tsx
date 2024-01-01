import { Tab } from '@headlessui/react'
import { CaretUp, FadersHorizontal, Gear, Play, SkipBack, Star } from '@phosphor-icons/react'
import { GAME_CATALOG } from '../games2'
import { useAppState } from '../hooks/use-app-state'
import { FolderMenu } from './folder-menu'
import { Button } from './interactive'
import { Modal } from './modal'
import { Prefs } from './prefs'
import { Rules } from './rules'
import { Settings } from './settings'
import classes from './menu.module.css'

const growTab = `${classes.tab} ${classes.grow}`
const panelClass = "full-height overflow-hidden"
const footClass = "flex-center ui-pad ui-gap"

export function Menu() {
	const [state, actions] = useAppState()
	const gameName = GAME_CATALOG[state.menuKey].name
	const userPrefs = state.prefs[state.menuKey]
	const hasUserPrefs = userPrefs && Object.keys(userPrefs).some((prop, i) => prop !== 'isFavorite' || i > 0)

	return (
		<Modal isOpen={state.isMenuOpen} onClose={() => actions.toggleMenu(false)}>
			<Tab.Group>
				<Tab.List className={classes.list}>
					<button className={classes.tab} onClick={actions.toggleFilter}>
						<Star weight={state.isMenuFiltered ? 'fill' : 'regular'} />
					</button>
					<Tab className={classes.tab}>Game List</Tab>
					<Tab className={classes.tab}>How to Play</Tab>
					<button className={growTab} />
					<Tab className={classes.tab}>
						{({ selected }) => (<Gear weight={selected ? 'fill' : 'regular'} />)}
					</Tab>
				</Tab.List>
				<Tab.Panels className={classes.panels}>
					<Tab.Panel className={panelClass}>
						<FolderMenu />
						<footer className={footClass}>
							{state.isPrefsOpen && (<Prefs />)}
							<div className="flex-center ui-gap">
								<Button big accented onClick={actions.undoAll} disabled={state.history.length < 2}>
									<SkipBack /> Retry
								</Button>
								<Button big blue={hasUserPrefs} accented outlined onClick={actions.togglePrefs}>
									{state.isPrefsOpen ? (<CaretUp />) : (<FadersHorizontal />)}
								</Button>
								<Button big accented onClick={() => actions.launchGame(false)}>
									New Game <Play />
								</Button>
							</div>
						</footer>
					</Tab.Panel>
					<Tab.Panel className={panelClass}>
						<Rules />
						<footer className={footClass}>
							<Button big accented onClick={() => actions.launchGame(false)}>
								Play {gameName} <Play />
							</Button>
						</footer>
					</Tab.Panel>
					<Tab.Panel className={panelClass}>
						<Settings />
					</Tab.Panel>
				</Tab.Panels>
			</Tab.Group>
		</Modal>
	)
}
