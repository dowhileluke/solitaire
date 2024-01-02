import { FlowerLotus, List } from '@phosphor-icons/react'
import { concat } from '../functions/concat'
import { useAppState } from '../hooks/use-app-state'
import { DndArea } from './dnd-area'
import { Button } from './interactive'
import { VERSION } from './settings'
import { Tableau } from './tableau'
import { Zones } from './zones'
import classes from './layout.module.css'
import responsive from './responsive.module.css'

const welcomeClass = `full-height ${classes.welcome}`

const feats = [
	'More than a dozen new games',
	'Improvements to UI clarity & layout',
	'Auto-complete [tap a foundation]',
]

const miniCard = (
	<div className={classes.mini}>
		<FlowerLotus />
	</div>
)

function FirstRun() {
	const [, actions] = useAppState()

	// empty first div for grid placement
	return (
		<>
			<div />
			<div className={welcomeClass}>
				<h2>Welcome to Solitaire {VERSION}!</h2>
				<ul className={classes.feats}>
					{feats.map(f => (
						<li key={f}>{miniCard} {f}</li>
					))}
				</ul>
				<div className={classes.start}>
					<Button big outlined onClick={() => actions.toggleMenu(true)}>
						<List />
						Get Started
					</Button>
				</div>
				<footer className={classes.foot}>
					Add me to your Home screen for an offline app experience!
				</footer>
			</div>
		</>
	)
}

const layoutClass = `full-height overflow-hidden ${classes.layout}`

export function Layout() {
	const [state] = useAppState()
	const { isTowers, buildRestriction } = state.config
	const isFirstRun = state.history.length === 0
	const isTwoColored = buildRestriction === 'alt-color' 

	return (
		<main className={concat(
			!isTwoColored && state.isFourColorEnabled && 'four-color',
			layoutClass,
			responsive.layout,
			!isTowers && responsive.layout2,
			state.layoutMode === 'vertical' && responsive.layout3,
			(state.isMenuOpen || state.isComplete) && 'fade',
		)}>
			{isFirstRun && (<FirstRun />)}
			<DndArea>
					<Zones />
					<Tableau />
			</DndArea>
		</main>
	)
}
