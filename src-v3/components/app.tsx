import { PropsWithChildren, useEffect } from 'react'
import { useAppState } from '../hooks/use-app-state'
import { AppStateProvider } from './app-state-provider'
import { Completion } from './completion'
import { Controls } from './controls'
import { Layout } from './layout'
import { Menu } from './menu'
import { ThemeMode } from '../types'
import responsive from './responsive.module.css'

const appClass = `viewport-height overflow-hidden ${responsive.app}`

const themeColors: Partial<Record<ThemeMode & string, string>> = {
	grass: '#231',
	sand: 'saddlebrown',
}

export function SvgFilters() {
	return (
		<svg width="0" height="0">
			<defs>
				<filter id="black" color-interpolation-filters="sRGB">
					<feColorMatrix type="matrix" values="0.2 0.2 0.2 0 0
														0.2 0.2 0.2 0 0
														0.2 0.2 0.2 0 0
														0 0 0 1 0"/>
				</filter>
				<filter id="red" color-interpolation-filters="sRGB">
					<feColorMatrix type="matrix" values="0.7 0.35 0.35 0 0
														0.1333 0.0666 0.0666 0 0
														0.1333 0.0666 0.0666 0 0
														0 0 0 1 0"/>
				</filter>
				<filter id="orange" color-interpolation-filters="sRGB">
					<feColorMatrix type="matrix" values="0.98 0.5 0.5 0 0
														0.5 0.25 0.25 0 0
														0.447 0.22 0.22 0 0
														0 0 0 1 0"/>
				</filter>
				<filter id="yellow" color-interpolation-filters="sRGB">
					<feColorMatrix type="matrix" values="0.855 0.427 0.427 0 0
														0.647 0.3235 0.3235 0 0
														0.1255 0.063 0.063 0 0
														0 0 0 1 0"/>
				</filter>
				<filter id="green" color-interpolation-filters="sRGB">
					<feColorMatrix type="matrix" values="0 0 0 0 0
														0.5 0.25 0.25 0 0
														0 0 0 0 0
														0 0 0 1 0"/>
				</filter>
				<filter id="blue" color-interpolation-filters="sRGB">
					<feColorMatrix type="matrix" values="0.2745 0.14 0.14 0 0
														0.51 0.25 0.25 0 0
														0.706 0.35 0.35 0 0
														0 0 0 1 0"/>
				</filter>
			</defs>
		</svg>
	)
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
			<SvgFilters />
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
