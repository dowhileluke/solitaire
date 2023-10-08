import { useMemo, useState } from 'react'
import { AppActions, AppState } from '../types'
import { useForever } from './use-forever'
import { v3test } from './use-v3-state'
import { toRules } from '../functions/to-rules'
import { GAME_CATALOG } from '../games'

const initialState: Omit<AppState, 'rules'> = {
	history: [],
	selection: null,
	gameKey: 'klondike',
}

export function useAppInternalState() {
	const [state, setState] = useState(initialState)
	const rules = useMemo(() => toRules(GAME_CATALOG[state.gameKey]), [state.gameKey])
	const appState = useMemo((): AppState => ({ ...state, rules }), [state, rules])

	const actions = useForever<AppActions>({
		launchGame() {
			const { tableau, stock } = v3test()

			setState(prev => ({
				...prev,
				history: [
					{ tableau, stock, foundations: [], cells: [], waste: null, pass: 0, }
				],
			}))
		},
		setSelection(selection) {
			setState(prev => ({ ...prev, selection, }))
		},
	})

	return [appState, actions] as const
}
