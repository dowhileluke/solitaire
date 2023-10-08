import { useRef } from 'react'
import { DragStartEvent, DragEndEvent, DndContext, DragOverlay } from '@dnd-kit/core'
import { useAppState } from '../hooks/use-app-state'
import { Position } from '../types'
import { Tableau } from './tableau'

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
			console.log('actions.moveCards()')
		} else {
			actions.setSelection(null)
		}
	}

	function handleDragEnd(e: DragEndEvent) {
		const to = e.over?.data.current as Position | undefined

		if (!to) return handleDragCancel()

		// TODO: implement moves
		console.log('actions.moveCards(to)')
		handleDragCancel()
	}

	return (
		<DndContext onDragStart={handleDragStart} onDragCancel={handleDragCancel} onDragEnd={handleDragEnd}>
			<main>
				<Tableau />
			</main>
			<DragOverlay>
				{/* render selected cards */}
			</DragOverlay>
		</DndContext>
	)
}
