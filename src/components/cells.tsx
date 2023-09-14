import { toCascadeCard } from '../functions';
import { GameState, Location } from '../types'
import { DndCard } from './card';
import classes from './cells.module.css'

type CellsProps = {
	state: GameState;
	location: Location | null;
}

export function Cells({ state, location }: CellsProps) {
	if (!state.cells) return null

	const isAnySelected = location?.zone === 'cell'

	return (
		<div className={classes.cells}>
			{state.cells.map((cardId, x) => {
				const isSelected = isAnySelected && location.x === x
				const details = isSelected ? null : toCascadeCard(cardId, false, false, true)

				return (
					<DndCard
						key={x}
						details={details}
						location={{ zone: 'cell', x }}
						mode={cardId !== null ? 'drag' : 'drop'}
						className={details === null ? classes.dotted : ''}
					/>
				)
			})}
		</div>
	)
}
