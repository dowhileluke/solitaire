import { PropsWithChildren, useRef } from 'react'
import { DragStartEvent, DragEndEvent, DndContext, DragOverlay } from '@dnd-kit/core'
import { tail } from '@dowhileluke/fns'
import { concat } from '../functions/concat'
import { toSelectedCardIds } from '../functions/to-selected-card-ids'
import { useAppState } from '../hooks/use-app-state'
import { Position } from '../types'
import { Pile } from './pile'
import classes from './card-pile.module.css'

const overlayClass = `${classes.pile} ${classes.overpile}`

export function DndArea({ children }: PropsWithChildren) {
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

	const isVertical = state.layoutMode === 'vertical'
	const isPastHalf = isVertical && state.selection && state.selection.zone === 'tableau'
		&& state.selection.x >= state.history[0].tableau.length / 2
	const wrapperClass = concat(
		overlayClass,
		isVertical && classes.horizontal, // vertical groups -> horizontal piles
		!isPastHalf && classes.west,
	)
	return (
		<DndContext onDragStart={handleDragStart} onDragCancel={handleDragCancel} onDragEnd={handleDragEnd}>
			{children}
			<DragOverlay wrapperElement="ul" className={wrapperClass}>
				{state.selection && (
					<Pile
						cardIds={toSelectedCardIds(tail(state.history), state.selection)}
						toPos={null}
						angle={'E'}
					/>
				)}
			</DragOverlay>
		</DndContext>
	)
}
