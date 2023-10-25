import { concat } from '../functions/concat'
import { useAppState } from '../hooks/use-app-state'
import { DndArea } from './dnd-area'
import { Export } from './export'
import { Tableau } from './tableau'
import { Zones } from './zones'
import classes from './layout.module.css'
import responsive from './responsive.module.css'

const layoutClass = `full-height overflow-hidden ${classes.layout}`

export function Layout() {
	const [state] = useAppState()
	const { foundationGroups = 1 } = state.config

	if (state.isExporting) return <Export />

	return (
		<main className={concat(
			'four-color',
			layoutClass,
			responsive.layout,
			foundationGroups < 2 && responsive.layout2,
		)}>
			<DndArea>
					<Zones />
					<Tableau />
			</DndArea>
		</main>
	)
}
