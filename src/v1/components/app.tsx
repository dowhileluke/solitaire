import { tail } from '@dowhileluke/fns'
import { useGameState } from '../hooks/use-game-state'
import { Tableau } from './tableau'
import classes from './app.module.css'

export function App() {
	const [state, game] = useGameState()
	const current = tail(state.history)
	const hasAnyEmpty = current.tableau.some(pile => pile.cards.length === 0)

	return (
		<div className={classes.app}>
			<button disabled={hasAnyEmpty || current.stock.length === 0} onClick={game.deal}>Deal</button>
			<button disabled={state.history.length < 2} onClick={game.rewind}>Undo</button>
			<Tableau
				state={state}
				onHighlight={game.setHighlight}
				onSelect={game.setSelection}
				onMove={game.moveSelection}
			/>
		</div>
	)
}
