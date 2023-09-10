import { useRef } from 'react'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import { tail } from '@dowhileluke/fns'
import { concat, toSelectedCards } from '../functions'
import { useAppState } from '../hooks/use-app-state'
import { Location } from '../types'
import { Card } from './card'
import { Tableau } from './tableau'
import classes from './app.module.css'
import { Stock } from './stock'

export function App() {
	const [state, actions] = useAppState()
	const layout = tail(state.history)
	const timestampRef = useRef(0)
	
	function handleDragStart(e: DragStartEvent) {
		timestampRef.current = Date.now()

		actions.setSelection(e.active.data.current as Location)
	}

	function handleDragCancel() {
		const isImmediate = Date.now() - timestampRef.current < 200

		if (isImmediate) {
			actions.moveCards()
		} else {
			actions.setSelection(null)
		}
	}

	function handleDragEnd(e: DragEndEvent) {
		const to = e.over?.data.current as Location | undefined

		if (!to) return handleDragCancel()

		actions.moveCards(to)
	}

	return (
		<DndContext onDragStart={handleDragStart} onDragCancel={handleDragCancel} onDragEnd={handleDragEnd}>
			<div className={concat('viewport-height', classes.app)}>
				<nav className={classes.controls}>
					{layout ? (
						<button type="button" onClick={actions.undo}>Undo</button>
					) : (
						<button
							type="button"
							onClick={() => actions.launchGame('spiderette', { suitCount: 2, hasExtraSpace: false })}
						>
							Launch!
						</button>
					)}
				</nav>
				{layout && (
					<main className={concat(classes.layout, 'full-height overflow-hidden')}>
						<div className={classes.zones}>
							<Stock state={layout} onClick={actions.deal} mode={state.mode} />
						</div>
						<Tableau state={layout.tableau} selection={state.selection} mode={state.mode} />
					</main>
				)}
			</div>
			<DragOverlay className={concat('cascade', classes.overlay)}>
				{layout && toSelectedCards(layout, state.selection).map((card, i) => (
					<Card key={i} details={{ ...card, isDown: false, isConnected: i > 0, isAvailable: true }} />
				))}
			</DragOverlay>
		</DndContext>
	)
}
