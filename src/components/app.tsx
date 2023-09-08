import { useState } from 'react'
import classes from './app.module.css'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import { tail } from '@dowhileluke/fns'
import { toSelectedCards } from '../functions/to-selected-cards'
import { useAppState } from '../hooks/use-app-state'
import { CascadeState, Location } from '../types'
import { Card } from './card'
import { Tableau } from './tableau'

export function App() {
	const [state, setState, actions] = useAppState()
	const currentLayout = tail(state.history)

	function handleDragStart(e: DragStartEvent) {
		actions.setSelection(e.active.data.current as Location)
	}

	function handleDragCancel() {
		actions.setSelection(null)
	}

	function handleDragEnd(e: DragEndEvent) {
		const target = e.over?.data.current as Location | undefined

		if (!target) return handleDragCancel()

		setState(prev => {
			if (!prev.selection || prev.selection.zone !== 'tableau' || target.zone !== 'tableau') {
				return prev
			}

			const { x: selectionX, y: selectionY } = prev.selection
			const current = tail(prev.history)
			const sourceCards = current.tableau[selectionX].cards.slice(selectionY)
			const tableau = current.tableau.map((cascade, x) => {
				if (x === target.x) {
					const result: CascadeState = {
						...cascade,
						cards: cascade.cards.concat(sourceCards),
					}

					return result
				}
				if (x === selectionX) {
					const result: CascadeState = {
						...cascade,
						cards: cascade.cards.slice(0, selectionY),
					}

					return result
				}

				return cascade
			})

			return {
				...prev,
				history: prev.history.concat({ ...current, tableau }),
				selection: null,
			}
		})
	}

	return (
		<DndContext onDragStart={handleDragStart} onDragCancel={handleDragCancel} onDragEnd={handleDragEnd}>
			<Tableau state={currentLayout.tableau} selection={state.selection} />
			<DragOverlay>
				{toSelectedCards(currentLayout, state.selection).map((value, i) => (
					<Card key={i} details={{ value, isDown: false, isConnected: true, isAvailable: true }} />
				))}
			</DragOverlay>
		</DndContext>
	)
}
