import { useState } from 'react'
import { getInitialState } from '../functions/get-initial-state'
import { AppActions, AppState, LayoutState, Location } from '../types'
import { useForever } from './use-forever'
import { tail } from '@dowhileluke/fns'

const initState: AppState = {
	history: [getInitialState()],
	selection: null,
}

export function useAppState() {
	const [state, setState] = useState(initState)

	const actions = useForever<AppActions>({
		setSelection(selection) {
			setState(prev => ({ ...prev, selection }))
		},
		moveCards(destination) {
			// setState(prev => {
			// 	const isTableauSource = prev.selection?.zone === 'tableau'
			// 	const isTableauDestination = destination.zone === 'tableau'
			// 	const changes: Partial<LayoutState> = {}

			// 	if (isTableauSource || isTableauDestination) {
			// 		const prevTableau = tail(prev.history).tableau
			// 		const nextTableau = prevTableau.map((cascade, x) => {
			// 			if ()
			// 		})
			// 	}
			// })
		},
	})

	return [state, setState, actions] as const
}
