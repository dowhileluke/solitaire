import { PropsWithChildren, useRef } from 'react'
import { DragStartEvent, DragEndEvent, DndContext, DragOverlay } from '@dnd-kit/core'
import { tail } from '@dowhileluke/fns'
import { toSelectedCardIds } from '../functions/to-selected-card-ids'
import { useAppState } from '../hooks/use-app-state'
import { Position } from '../types'
import { Pile } from './pile'
import { Tableau } from './tableau'
import { Foundations } from './foundations'
import { Cells } from './cells'
import { Stock } from './stock'
import { Waste } from './waste'
import classes from './layout.module.css'
import pileClasses from './pile.module.css'

const layoutClass = `full-height overflow-hidden ${classes.layout}`
const zonesClass = `overflow-hidden ${classes.zones}`

function Zones({ children }: PropsWithChildren) {
	return (
		<section className={zonesClass}>
			{children}
		</section>
	)
}

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
			<main className={layoutClass}>
				<Zones>
					<Stock />
					<Waste />
					<Cells />
					<Foundations />
				</Zones>
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
