import { deal } from '../functions/deal'
import { GameState } from '../types'
import { Tableau } from './tableau'
import classes from './app.module.css'
import { useState } from 'react'

const start = deal()

start.tableau.unshift({ cards: [], down: 0, })

const initState: GameState = {
	history: [start],
	highlight: null,
	isSelected: false,
}

export function App() {
	const [state, setState] = useState(initState)

	console.log(state.highlight)

	return (
		<div className={classes.app}>
			<Tableau
				state={state}
				onHighlight={highlight => setState(prev => ({ ...prev, highlight, }))}
			/>
		</div>
	)
}
