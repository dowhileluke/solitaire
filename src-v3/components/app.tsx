import { PropsWithChildren, useEffect } from 'react'
import { concat } from '../functions/concat'
import { useAppState } from '../hooks/use-app-state'
import { AppStateProvider } from './app-state-provider'
import { Completion } from './completion'
import { Controls } from './controls'
import { Layout } from './layout'
import { Menu } from './menu'
import responsive from './responsive.module.css'
import { ThemeMode } from '../types'

const appClass = `viewport-height overflow-hidden ${responsive.app}`

const themeColors: Partial<Record<ThemeMode & string, string>> = {
	grass: '#231',
	sand: 'saddlebrown',
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
