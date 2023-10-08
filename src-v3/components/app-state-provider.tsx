import { PropsWithChildren } from 'react'
import { AppContext } from '../hooks/use-app-state'
import { useAppInternalState } from '../hooks/use-app-internal-state'

export function AppStateProvider({ children }: PropsWithChildren) {
	const state = useAppInternalState()

	return (
		<AppContext.Provider value={state}>
			{children}
		</AppContext.Provider>
	)
}
