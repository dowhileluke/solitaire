import { useState } from 'react'
import { AppActions, AppState } from '../types'
import { useForever } from './use-forever'
import { v3test } from './use-v3-state'
import { toRules } from '../functions/to-rules'

const initialState: AppState = {
	history: [],
	selection: null,
	rules: toRules({
		buildDirection: 'descending',
		buildRestriction: 'suit',
		groupRestriction: 'restricted',
	})
}

export function useAppInternalState() {
	const [state, setState] = useState(initialState)

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

	return [state, actions] as const
}
