import { useEffect, useMemo, useState } from 'react'
import { AppActions, AppState, Position } from '../types'
import { useForever } from './use-forever'
import { toRules } from '../functions/to-rules'
import { GAME_CATALOG } from '../games'
import { toInitialState } from '../functions/to-initial-state'
import { tail } from '@dowhileluke/fns'
import { toSelectedCardIds } from '../functions/to-selected-card-ids'
import { moveCardIds } from '../functions/move-card-ids'
import { setPersistedState, getPersistedState } from '../functions/persist'

const initialState: Omit<AppState, 'rules'> = {
	history: [],
	selection: null,
	gameKey: 'fortress',
	...getPersistedState(),
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
	const { history, gameKey } = state
	const rules = useMemo(() => toRules(GAME_CATALOG[state.gameKey]), [state.gameKey])
	const appState = useMemo((): AppState => ({ ...state, rules }), [state, rules])

	useEffect(() => {
		setPersistedState({ history, gameKey })
	}, [history, gameKey])

	const actions = useForever<AppActions>({
		launchGame() {
			setState(prev => ({
				...prev,
				history: [toInitialState(GAME_CATALOG[prev.gameKey])],
			}))
		},
		setSelection(selection) {
			setState(prev => ({ ...prev, selection, }))
		},
		moveCards(to) {
			setState(prev => {
				if (!prev.selection) return prev

				const NEVERMIND: typeof prev = { ...prev, selection: null }

				if (isSelfTargeting(prev.selection, to)) return NEVERMIND

				const GAME_STATE = tail(prev.history)
				const { isValidMove, finalizeState } = toRules(GAME_CATALOG[prev.gameKey])
				const selectedCardIds = toSelectedCardIds(GAME_STATE, prev.selection)

				if (selectedCardIds.length === 0) return NEVERMIND

				const validity = isValidMove(GAME_STATE, selectedCardIds, to)

				if (!validity) return NEVERMIND

				const nextState = finalizeState(moveCardIds(
					GAME_STATE,
					validity === 'invert' ? selectedCardIds.slice().reverse() : selectedCardIds,
					prev.selection,
					to,
				))

				return {
					...prev,
					history: prev.history.concat(nextState),
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
	})

	return [appState, actions] as const
}
