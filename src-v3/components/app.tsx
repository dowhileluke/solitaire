import { PropsWithChildren, useEffect } from 'react'
import { useAppState } from '../hooks/use-app-state'
import { AppStateProvider } from './app-state-provider'
import { Completion } from './completion'
import { Controls } from './controls'
import { FilterDefs } from './filter-defs'
import { Layout } from './layout'
import { Menu } from './menu'
import { ThemeMode } from '../types'
import responsive from './responsive.module.css'

const appClass = `viewport-height overflow-hidden ${responsive.app}`

const themeColors: Partial<Record<ThemeMode & string, string>> = {
	grass: '#231',
	sand: 'saddlebrown',
	stars: 'black',
	arcade: 'darkviolet',
}

function ThemedApp({ children }: PropsWithChildren) {
	const [{ themeMode }] = useAppState()

	useEffect(() => {
		document.body.setAttribute('data-theme', themeMode || '')

		const metaTag = document.querySelector('meta[name=theme-color]')
		
		if (metaTag) {
			metaTag.setAttribute('content', themeMode && themeColors[themeMode] || 'firebrick')
		}
	}, [themeMode])

	return (
		<div className={appClass}>
			{children}
			<FilterDefs />
		</div>
	)
}

export function App() {
	return (
		<AppStateProvider>
			<ThemedApp>
				<Controls />
				<Layout />
				<Completion />
			</ThemedApp>
			<Menu />
		</AppStateProvider>
	)
}
