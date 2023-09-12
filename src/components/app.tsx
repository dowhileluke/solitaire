import { FormEvent, useRef } from 'react'
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
import { Menu, Play, Rewind, RotateCcw, Shuffle } from 'react-feather'
import { Modal } from './modal'
import { useDraftState } from '../hooks/use-draft-state'
import { ConfigForm, ConfigFormFn } from './config-form'
import { Mode } from '../rules'

function isGameOver({ tableau, stock, waste, cells }: GameState) {
	const isTableauEmpty = tableau.every(pile => pile.cardIds.length === 0)
	const isCellsEmpty = !cells || cells.every(c => c === null)

	return isTableauEmpty && isCellsEmpty && [stock?.length ?? 0, waste?.length ?? 0].every(n => n === 0)
}

export function App() {
	const [state, actions] = useAppState()
	const layout = tail(state.history)
	const timestampRef = useRef(0)
	const [draftMode, setDraftMode] = useDraftState(state.mode)
	const [draftConfig, setDraftConfig] = useDraftState(state.config)

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

	const handleChange: ConfigFormFn = (mode, config) => {
		setDraftMode(mode)

		if (config) {
			setDraftConfig(prev => ({ ...prev, ...config }))
		}
	}

	function handleSubmit(e: FormEvent) {
		e.preventDefault()

		actions.launchGame(draftMode, draftConfig)
	}

	const isDone = !false || Boolean(layout) && isGameOver(layout)
	const isNew = state.history.length < 2
	const configForm = (
		<ConfigForm
			mode={draftMode}
			state={draftConfig}
			onChange={handleChange}
			onRetry={isNew ? null : actions.restart}
			submitLabel={layout ? 'New Game' : 'Start'}
		/>
	)

	return (
		<DndContext onDragStart={handleDragStart} onDragCancel={handleDragCancel} onDragEnd={handleDragEnd}>
			<div className={concat('viewport-height', classes.app)}>
				<nav className={classes.red}>
					<div className={concat('controls', state.isMenuOpen && 'fade')}>
						<Button disabled={!layout} onClick={() => actions.setIsMenuOpen(true)}>
							<Menu size="1em" />
							Menu
						</Button>
						<Button onClick={actions.undo} disabled={isNew && !state.isMenuOpen}>
							<RotateCcw size="1em" />
							Undo
						</Button>
					</div>
				</nav>
				{layout ? (
					<main className={concat(classes.layout, 'full-height overflow-hidden', state.isMenuOpen && 'fade')}>
						<div className={classes.zones}>
							<Stock state={layout} onClick={actions.deal} mode={state.mode} />
							<div className={classes.space} />
							<Foundations state={layout} />
						</div>
						{isDone && (
							<div>
								<h1>Game Complete!</h1>
								<div className="controls">
									<Button isBig isRed onClick={actions.playAnother}>New Game <Play size="1em" /></Button>
								</div>
							</div>
						)}
						<Tableau
							state={layout.tableau}
							selection={state.selection}
							mode={state.mode}
							isHidden={isDone}
						/>
					</main>
				) : (
					<div className="center">
						<form onSubmit={handleSubmit} className={concat(classes.init, 'grid-form')}>
							{configForm}
						</form>
					</div>
				)}
			</div>
			<DragOverlay className={concat('cascade', classes.overlay)}>
				{layout && toSelectedCards(layout, state.selection).map((card, i) => (
					<Card key={i} details={{ ...card, isDown: false, isConnected: i > 0, isAvailable: true }} />
				))}
			</DragOverlay>
			<Modal
				isOpen={state.isMenuOpen}
				onClose={() => actions.setIsMenuOpen(false)}
				title="Game Settings"
				onSubmit={handleSubmit}
			>
				{configForm}
			</Modal>
		</DndContext>
	)
}
