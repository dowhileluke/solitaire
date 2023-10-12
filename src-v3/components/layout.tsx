import { useRef } from 'react'
import { DragStartEvent, DragEndEvent, DndContext, DragOverlay } from '@dnd-kit/core'
import { tail } from '@dowhileluke/fns'
import { toSelectedCardIds } from '../functions/to-selected-card-ids'
import { useAppState } from '../hooks/use-app-state'
import { Position } from '../types'
import { Pile } from './pile'
import { Tableau } from './tableau'
import { Foundations } from './foundations'
import classes from './layout.module.css'
import pileClasses from './pile.module.css'
import { Cells } from './cells'
import { PileGroup } from './pile-group'
import { Stock } from './stock'
import { Waste } from './waste'

export function Layout() {
	const [state, actions] = useAppState()
	const timestampRef = useRef(0)

	if (!state.history.length) return null

	function handleDragStart(e: DragStartEvent) {
		timestampRef.current = Date.now()

		actions.setSelection(e.active.data.current as Position)
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
		const to = e.over?.data.current as Position | undefined

		if (!to) return handleDragCancel()

		actions.moveCards(to)
	}

	return (
		<DndContext onDragStart={handleDragStart} onDragCancel={handleDragCancel} onDragEnd={handleDragEnd}>
			<main className={classes.layout}>
				<PileGroup noPad>
					<Stock />
					<Waste />
					<Cells />
					<div className={classes.push} />
					<Foundations />
				</PileGroup>
				<Tableau />
			</main>
			<DragOverlay wrapperElement="ul" className={pileClasses.overlay}>
				{state.selection && (
					<Pile
						cardIds={toSelectedCardIds(tail(state.history), state.selection)}
						toPos={null}
					/>
				)}
			</DragOverlay>
		</DndContext>
	)
}
