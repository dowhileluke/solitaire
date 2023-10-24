import { DndArea } from './dnd-area'
import { Tableau } from './tableau'
import { Zones } from './zones'
import classes from './layout.module.css'
import responsive from './responsive.module.css'

const layoutClass = `full-height overflow-hidden ${classes.layout} ${responsive.layout}`

export function Layout() {
	return (
		<DndArea>
			<main className={layoutClass}>
				<Zones />
				<Tableau />
			</main>
		</DndArea>
	)
}
