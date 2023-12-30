import { Tab } from '@headlessui/react'
import { Gear, Star, X } from '@phosphor-icons/react'
import { useAppState } from '../hooks/use-app-state'
import { FolderMenu } from './folder-menu'
import { Rules } from './rules'
import { Settings } from './settings'
import classes from './menu-tabs.module.css'

const growTab = `${classes.tab} ${classes.grow}`
const panelClass = "full-height overflow-hidden"

export function MenuTabs() {
	const [state, actions] = useAppState()

	return (
		<Tab.Group>
			<Tab.List className={classes.list}>
					<button className={classes.tab} onClick={() => actions.toggleMenu(false)}>
						<X />
					</button>
					<Tab className={classes.tab}>Game List</Tab>
					<Tab className={classes.tab}>How to Play</Tab>
					<button className={growTab} />
					<button className={classes.tab} onClick={actions.toggleFilter}>
						<Star weight={state.isMenuFiltered ? 'fill' : 'regular'} />
					</button>
					<Tab className={classes.tab}>
						{({ selected }) => (<Gear weight={selected ? 'fill' : 'regular'} />)}
					</Tab>
			</Tab.List>
			<Tab.Panels className={classes.panels}>
				<Tab.Panel className={panelClass}>
					<FolderMenu />
				</Tab.Panel>
				<Tab.Panel className={panelClass}>
					<Rules />
				</Tab.Panel>
				<Tab.Panel className={panelClass}>
					<Settings />
				</Tab.Panel>
			</Tab.Panels>
		</Tab.Group>
	)
}
