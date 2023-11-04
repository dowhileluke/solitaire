import { concat } from '../functions/concat'
import { useAppState } from '../hooks/use-app-state'
import { DndArea } from './dnd-area'
import { Export } from './export'
import { Tableau } from './tableau'
import { Zones } from './zones'
import classes from './layout.module.css'
import responsive from './responsive.module.css'
import { Menu } from './menu'

const layoutClass = `full-height overflow-hidden ${classes.layout}`

export function Layout() {
	const [state] = useAppState()
	const { isTowers, layoutMode, buildRestriction, groupRestriction } = state.config
	const isTwoColored = buildRestriction === 'alt-color' || groupRestriction === 'alt-color'

	if (state.isExporting) return <Export />
	if (state.isMenuOpen) return <Menu />

	return (
		<main className={concat(
			!isTwoColored && 'four-color',
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
