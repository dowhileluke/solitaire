import { FormEvent, useRef, useState } from 'react'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import { ArrowCounterClockwise, CrownSimple, List, Play, Smiley } from '@phosphor-icons/react'
import { tail } from '@dowhileluke/fns'
import { CARD_DATA } from '../data'
import { concat, toSelectedCards } from '../functions'
import { useAppState } from '../hooks/use-app-state'
import { MODES, MODE_LABELS } from '../rules'
import { FLAG_SUITED_ONLY } from '../rules/freecell'
import { GameConfig, GameState, Location, Mode } from '../types'
import { Button } from './button'
import { Card } from './card'
import { Cells } from './cells'
import { ConfigForm } from './config-form'
import { Foundations } from './foundations'
import { Modal } from './modal'
import { LabeledValue, Pills } from './pills'
import { Rules } from './rules'
import { Stock } from './stock'
import { Tableau } from './tableau'
import { Waste } from './waste'
import classes from './app.module.css'
import { CardContextProvider } from '../hooks/use-card-context'

function isGameOver({ tableau, stock, waste, cells }: GameState) {
	const isTableauEmpty = tableau.every(pile => pile.cardIds.length === 0)
	const isCellsEmpty = !cells || cells.every(c => c === null)

	return isTableauEmpty && isCellsEmpty && [stock?.length ?? 0, waste?.cardIds.length ?? 0].every(n => n === 0)
}

function getVariantName(mode: Mode, { deckCount, modeFlags }: GameConfig) {
	if (mode === 'spiderette' && deckCount === 1) return 'Spiderette'
	if (mode === 'freecell' && modeFlags & FLAG_SUITED_ONLY) return "Baker's Game"
	if (mode === 'yukon' && modeFlags & FLAG_SUITED_ONLY) return 'Russian'

	return MODE_LABELS[mode]
}

const MODE_OPTIONS = MODES.map((value): LabeledValue<Mode> => ({
	value, label: MODE_LABELS[value],
}))

export function App() {
	const [state, actions] = useAppState()
	const layout = tail(state.history)
	const timestampRef = useRef(0)
	const [isRulesVisible, setIsRulesVisible] = useState(false)

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

	function handleSubmit(e: FormEvent) {
		e.preventDefault()

		actions.launchGame()
	}

	const isDone = Boolean(layout) && isGameOver(layout)
	const isNew = state.history.length < 2
	const modePills = (<Pills value={state.menuMode} onChange={actions.setMenuMode} options={MODE_OPTIONS} />)
	const configForm = isRulesVisible ? (
			<Rules mode={state.menuMode} onDone={layout ? null : () => setIsRulesVisible(false)} />
	) : (
		<ConfigForm
			mode={state.menuMode}
			state={state.preferences[state.menuMode]}
			onChange={actions.updatePreferences}
			onInfo={() => setIsRulesVisible(true)}
			onRetry={isNew ? null : actions.restart}
			submitLabel={layout ? 'New' : 'Start'}
		/>
	)

	return (
		<CardContextProvider value={state.isFaces}>
			<DndContext onDragStart={handleDragStart} onDragCancel={handleDragCancel} onDragEnd={handleDragEnd}>
				<div className={concat('viewport-height', classes.app)}>
					<nav className={classes.menu}>
						<div className={concat('controls', state.isMenuOpen && 'fade')}>
							<Button disabled={!layout} onClick={() => actions.openMenu()}>
								<List />
								{layout ? getVariantName(state.mode, state.config) : 'Menu'}
							</Button>
							<Button onClick={actions.undo} disabled={isNew && !state.isMenuOpen}>
								<ArrowCounterClockwise />
								Undo
							</Button>
						</div>
					</nav>
					{layout ? (
						<main className={concat(classes.layout, 'full-height overflow-hidden', state.isMenuOpen && 'fade')}>
							<div className={concat(classes.zones, 'overflow-hidden')}>
								{(layout.stock || layout.waste) && (
									<div className={classes.wasteland}>
										<Stock
											state={layout}
											onClick={actions.deal}
											mode={state.mode}
											modeFlags={state.config.modeFlags}
										/>
										{layout.waste && (<Waste state={layout.waste} selection={state.selection} />)}
									</div>
								)}
								<Cells state={layout} location={state.selection} />
								<Foundations state={layout} selection={state.selection} mode={state.mode} />
							</div>
							<div className="full-height overflow-hidden">
								<Tableau
									state={layout.tableau}
									config={state.config}
									selection={state.selection}
									mode={state.mode}
									isDone={isDone}
								/>
								{isDone && (
									<div>
										<h1>Game Complete!</h1>
										<div className="controls">
											<Button isBig isRed onClick={actions.playAnother}>
												New Game
												<Play weight="fill" />
											</Button>
										</div>
									</div>
								)}
							</div>
						</main>
					) : (
						<>
							<div>
								<form onSubmit={handleSubmit} className={concat(classes.init, 'grid-form')}>
									{modePills}
									{configForm}
								</form>
							</div>
							<footer className={concat(classes.foot, 'note')}>Add me to your home screen for offline mode!</footer>
						</>
					)}
				</div>
				<DragOverlay className={concat('cascade', classes.overlay)}>
					{layout && toSelectedCards(layout, state.selection).map((id, i) => (
						<Card key={i} details={{ ...CARD_DATA[id], isDown: false, isConnected: i > 0, isAvailable: true }} />
					))}
				</DragOverlay>
				<Modal
					isOpen={state.isMenuOpen}
					onClose={isRulesVisible ? () => setIsRulesVisible(false) : actions.dismissMenu}
					onSubmit={handleSubmit}
					title={isRulesVisible ? null : 'Game Settings'}
					headerNode={
						<Button isRed isHollow onClick={actions.toggleFaces}>
							<CrownSimple weight={state.isFaces ? 'regular' : 'fill'} />
						</Button>
					}
				>
					{modePills}
					{configForm}
				</Modal>
			</DndContext>
		</CardContextProvider>
	)
}
