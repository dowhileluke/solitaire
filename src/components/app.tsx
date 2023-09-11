import { useRef } from 'react'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import { tail } from '@dowhileluke/fns'
import { concat, toSelectedCards } from '../functions'
import { useAppState } from '../hooks/use-app-state'
import { GameState, Location } from '../types'
import { Card } from './card'
import { Tableau } from './tableau'
import classes from './app.module.css'
import { Stock } from './stock'
import { Foundations } from './foundations'
import { Button } from './button'
import { Layers, Rewind, RotateCcw, Shuffle } from 'react-feather'

function isGameOver({ tableau, stock, waste, cells }: GameState) {
	const isTableauEmpty = tableau.every(pile => pile.cardIds.length === 0)
	const isCellsEmpty = !cells || cells.every(c => c === null)

	return isTableauEmpty && isCellsEmpty && [stock?.length ?? 0, waste?.length ?? 0].every(n => n === 0)
}

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

	const isDone = Boolean(layout) && isGameOver(layout)
	const isNew = state.history.length < 2

	return (
		<DndContext onDragStart={handleDragStart} onDragCancel={handleDragCancel} onDragEnd={handleDragEnd}>
			<div className={concat('viewport-height', classes.app)}>
				<nav className={classes.controls}>
					{layout ? (
						<>
							<Button onClick={actions.restart} disabled={isNew}>
								<Rewind size="1em" />
								Restart
							</Button>
							<Button onClick={actions.undo} disabled={isNew}>
								<RotateCcw size="1em" />
								Undo
							</Button>
							<Button onClick={actions.playAnother}>
								<Shuffle size="1em" />
								New Game
							</Button>
						</>
					) : (
						<Button onClick={() => actions.launchGame('spiderette', { suitCount: 2, hasExtraSpace: true })}>
							Launch!
						</Button>
					)}
				</nav>
				{layout && (
					<main className={concat(classes.layout, 'full-height overflow-hidden')}>
						<div className={classes.zones}>
							<Stock state={layout} onClick={actions.deal} mode={state.mode} />
							<div className={classes.space} />
							<Foundations state={layout} />
						</div>
						{isDone && (
							<h1>Game Complete!</h1>
						)}
						<Tableau
							state={layout.tableau}
							selection={state.selection}
							mode={state.mode}
							isHidden={isDone}
						/>
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
