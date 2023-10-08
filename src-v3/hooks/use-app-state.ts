import { createContext, useContext } from 'react'
import { AppActions, AppState } from '../types'

export const AppContext = createContext<null | readonly [AppState, AppActions]>(null)

export function useAppState() {
	const ctx = useContext(AppContext)

	if (!ctx) throw new Error('No context provider!')

	return ctx
}
