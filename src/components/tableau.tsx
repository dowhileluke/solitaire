import { generateArray, tail } from '@dowhileluke/fns'
import { Coordinates, GameState } from '../types'
import { toDetailedCards } from '../functions/to-detailed-cards'
import { Card, CardTarget } from './card'
import classes from './tableau.module.css'

type TableauProps = {
	state: GameState;
	onHighlight: (highlight: Coordinates | null) => void;
	onSelect: (selection: Coordinates | null) => void;
	onMove: (x: number) => void;
}

export function Tableau({ state, onHighlight, onSelect, onMove }: TableauProps) {
	const current = tail(state.history)
	const pos = state.selection || state.highlight
	const selectedCard = state.selection && current.tableau[state.selection.x].cards[state.selection.y]
	const selectedRank = selectedCard?.rank ?? 999

	return (
		<div className={classes.tableau} onClick={() => onSelect(null)}>
			{current.tableau.map((pile, x) => (
				<div key={x} className={classes.pile}>
					{toDetailedCards(pile).map((c, y) => (
						<Card
							key={y}
							{...c}
							isFirstUp={y === pile.down}
							isFull={y + 1 === pile.cards.length}
							isHighlighted={pos ? pos.x === x && pos.y <= y : false}
							onHover={() => onHighlight(c.isAvailable ? { x, y } : null)}
							onBlur={() => onHighlight(null)}
							onClick={() => onSelect(c.isAvailable && (!pos || pos.x === x) ? { x, y } : null)}
						/>
					))}
					<CardTarget
						isEmpty={pile.cards.length === 0}
						isHighlighted={state.selection ? (pile.cards.length === 0 || tail(pile.cards).rank === selectedRank + 1) : false}
						onClick={() => onMove(x)}
					/>
				</div>
			))}
		</div>
	)
}
