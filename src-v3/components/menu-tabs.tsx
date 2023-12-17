import { Tab } from '@headlessui/react'
import { CaretLeft, Gear } from '@phosphor-icons/react'
import classes from './menu-tabs.module.css'
import { FolderMenu } from './folder-menu'

const growTab = `${classes.tab} ${classes.grow}`

export function MenuTabs() {
	return (
		<Tab.Group>
			<Tab.List className={classes.list}>
					<button className={classes.tab}>
						<CaretLeft />
					</button>
					<Tab className={classes.tab}>Game List</Tab>
					<Tab className={classes.tab}>Rules & Tips</Tab>
					<button className={growTab} />
					<Tab className={classes.tab}>
						<Gear />
					</Tab>
			</Tab.List>
			<Tab.Panels className={classes.panels}>
				<Tab.Panel>
					<FolderMenu />
				</Tab.Panel>
				<Tab.Panel>
					Two
				</Tab.Panel>
				<Tab.Panel>
					Three
				</Tab.Panel>
			</Tab.Panels>
		</Tab.Group>
	)
}
