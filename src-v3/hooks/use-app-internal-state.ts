import { useMemo, useState } from 'react'
import { AppActions, AppState } from '../types'
import { useForever } from './use-forever'
import { toRules } from '../functions/to-rules'
import { GAME_CATALOG } from '../games'
import { toInitialState } from '../functions/to-initial-state'

const initialState: Omit<AppState, 'rules'> = {
	history: [],
	selection: null,
	gameKey: 'scorpion',
}

export function useAppInternalState() {
	const [state, setState] = useState(initialState)
	const rules = useMemo(() => toRules(GAME_CATALOG[state.gameKey]), [state.gameKey])
	const appState = useMemo((): AppState => ({ ...state, rules }), [state, rules])

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
	})

	return [appState, actions] as const
}
