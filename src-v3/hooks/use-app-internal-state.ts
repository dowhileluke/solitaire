import { useEffect, useMemo, useState } from 'react'
import { AppActions, AppState, BaseAppState, GameState, Position } from '../types'
import { useForever } from './use-forever'
import { toRules } from '../functions/to-rules'
import { GAME_CATALOG, GameKey, toFullDef } from '../games2'
import { toInitialState } from '../functions/to-initial-state'
import { tail } from '@dowhileluke/fns'
import { toSelectedCardIds } from '../functions/to-selected-card-ids'
import { moveCardIds } from '../functions/move-card-ids'
import { setPersistedState, getPersistedState } from '../functions/persist'

const initialState: BaseAppState = {
	history: [],
	selection: null,
	gameKey: 'easthaven',
	...getPersistedState(),
	isExporting: false,
}

function test(gameKey: GameKey) {
	return toFullDef(GAME_CATALOG[gameKey], gameKey)
}

function isSelfTargeting(source: Position, target: Position) {
	if (source.zone === 'foundation' && target.zone === 'foundation') {
		return source.x === target.x
	}

	if (source.zone === 'tableau' && target.zone === 'tableau') {
		return source.x === target.x
	}

	return false
}

export function useAppInternalState() {
	const [state, setState] = useState(initialState)
	const { history } = state
	const config = useMemo(() => test(state.gameKey), [state.gameKey])
	const rules = useMemo(() => toRules(config), [config])
	const appState: AppState = {
		...state,
		config,
		rules,
	}

	useEffect(() => {
		setPersistedState({ history })
	}, [history])

	const actions = useForever<AppActions>({
		launchGame() {
			setState(prev => ({
				...prev,
				history: [toInitialState(test(prev.gameKey))],
			}))
		},
		setSelection(selection) {
			setState(prev => ({ ...prev, selection, }))
		},
		moveCards(to) {
			setState(prev => {
				if (!prev.selection) return prev

				const NEVERMIND: typeof prev = { ...prev, selection: null }

				if (to && isSelfTargeting(prev.selection, to)) return NEVERMIND

				const GAME_STATE = tail(prev.history)
				const { isValidMove, guessMove, finalizeState, advanceState } = toRules(test(prev.gameKey))
				const selectedCardIds = toSelectedCardIds(GAME_STATE, prev.selection)

				if (selectedCardIds.length === 0) return NEVERMIND

				let nextGameState: GameState | null = null

				if (!to && prev.selection.zone === 'foundation') {
					nextGameState = advanceState(GAME_STATE)
				} else {
					let target: Position | null = to ?? null
					let invert = false
	
					if (to) {
						const validity = isValidMove(GAME_STATE, selectedCardIds, to)
	
						if (!validity) return NEVERMIND
	
						invert = validity === 'invert'
					} else {
						const guess = guessMove(GAME_STATE, selectedCardIds, prev.selection)
	
						target = guess
						invert = Boolean(guess?.invert)
					}
	
					if (!target) return NEVERMIND
	
					nextGameState = finalizeState(moveCardIds(
						GAME_STATE,
						invert ? selectedCardIds.slice().reverse() : selectedCardIds,
						prev.selection,
						target,
					))
				}

				if (!nextGameState) return NEVERMIND

				return {
					...prev,
					history: prev.history.concat(nextGameState),
					selection: null,
				}
			})
		},
		undo() {
			setState(prev => {
				if (prev.history.length < 2) return prev

				return {
					...prev,
					history: prev.history.slice(0, -1),
					selection: null,
				}
			})
		},
		deal() {
			setState(prev => {
				const { dealStock, finalizeState } = toRules(test(prev.gameKey))
				const nextGameState = dealStock(tail(prev.history))

				if (!nextGameState) return prev

				return {
					...prev,
					history: prev.history.concat(finalizeState(nextGameState)),
					selection: null,
				}
			})
		},
		fastForward() {
			setState(prev => {
				if (prev.selection) return prev

				const GAME_STATE = tail(prev.history)
				const { advanceState } = toRules(test(prev.gameKey))
				const nextState = advanceState(GAME_STATE)

				if (!nextState) return prev

				return {
					...prev,
					history: prev.history.concat(nextState),
				}
			})
		},
		toggleExport() {
			setState(prev => ({ ...prev, isExporting: !prev.isExporting }))
		},
	})

	return [appState, actions] as const
}
