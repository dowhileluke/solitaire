import { concat } from '../functions/concat'
import { useAppState } from '../hooks/use-app-state'
import { DndArea } from './dnd-area'
import { Tableau } from './tableau'
import { Zones } from './zones'
import classes from './layout.module.css'
import responsive from './responsive.module.css'

const layoutClass = `full-height overflow-hidden ${classes.layout}`

export function Layout() {
	const [state] = useAppState()
	const { isTowers, buildRestriction, groupRestriction } = state.config
	const isTwoColored = buildRestriction === 'alt-color' || groupRestriction === 'alt-color'

	return (
		<main className={concat(
			!isTwoColored && 'four-color',
			layoutClass,
			responsive.layout,
			!isTowers && responsive.layout2,
			state.layoutMode === 'vertical' && responsive.layout3,
			(state.isMenuOpen || state.isComplete) && 'fade',
		)}>
			<DndArea>
					<Zones />
					<Tableau />
			</DndArea>
		</main>
	)
}
