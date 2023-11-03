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
	const { isTowers, layoutMode } = state.config

	if (state.isExporting) return <Export />

	return (
		<main className={concat(
			// 'four-color',
			layoutClass,
			responsive.layout,
			!isTowers && responsive.layout2,
			layoutMode === 'vertical' && responsive.layout3,
		)}>
			<DndArea>
					<Zones />
					<Tableau />
			</DndArea>
		</main>
	)
}
