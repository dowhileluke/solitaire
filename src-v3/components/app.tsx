import { AppStateProvider } from './app-state-provider'
import { Controls } from './controls'
import { Layout } from './layout'
import classes from './app.module.css'

const appClass = `viewport-height overflow-hidden ${classes.app}`

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
