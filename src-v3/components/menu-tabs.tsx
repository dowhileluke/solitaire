import { Tab } from '@headlessui/react'
// import { CaretLeft } from '@phosphor-icons/react'
import classes from './menu-tabs.module.css'

export function MenuTabs() {
	return (
		<Tab.Group>
			<Tab.List className={classes.list}>
					<button className={classes.tab}>
						{/* <CaretLeft /> */}
						X
					</button>
					<Tab className={classes.tab}>Customize</Tab>
					<Tab className={classes.tab}>Rules & Tips</Tab>
					<Tab className={classes.tab}>Settings</Tab>
			</Tab.List>
			<Tab.Panels>
				<Tab.Panel>
					One
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
