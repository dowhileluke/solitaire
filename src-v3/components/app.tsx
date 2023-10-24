import { AppStateProvider } from './app-state-provider'
import { Controls } from './controls'
import { Layout } from './layout'
import responsive from './responsive.module.css'

const appClass = `viewport-height overflow-hidden ${responsive.app}`

export function App() {
	return (
		<AppStateProvider>
			<div className={appClass}>
				<Controls />
				<Layout />
			</div>
		</AppStateProvider>
	)
}
