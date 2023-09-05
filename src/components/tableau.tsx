import { Coordinates, GameState } from '../types'
import { toDetailedCards } from '../functions/to-detailed-cards'
import { Card, CardTarget } from './card'
import classes from './tableau.module.css'
import { tail } from '@dowhileluke/fns'

type TableauProps = {
	state: GameState;
	onHighlight: (pos: Coordinates | null) => void;
}

export function Tableau({ state, onHighlight }: TableauProps) {
	const current = tail(state.history)

	return (
		<div className={classes.tableau}>
			{current.tableau.map((pile, x) => (
				<div key={x} className={classes.pile}>
					{toDetailedCards(pile).map((c, y) => (
						<Card
							key={`${c.rank}${c.suit}`}
							{...c}
							isFull={y + 1 === pile.cards.length}
							isHighlighted={state.highlight ? state.highlight.x === x && state.highlight.y <= y : false}
							onHover={() => onHighlight(c.isAvailable ? { x, y } : null)}
							onBlur={() => onHighlight(null)}
						/>
					))}
					<CardTarget isEmpty={pile.cards.length === 0} isHighlighted={state.isSelected} />
				</div>
			))}
		</div>
	)
}
