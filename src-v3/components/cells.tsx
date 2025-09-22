import { tail } from '@dowhileluke/fns'
import { concat } from '../functions/concat'
import { useAppState } from '../hooks/use-app-state'
import { CardId } from '../types'
import { PileGroup } from './pile-group'
import { Pile } from './pile'
import classes from './cells.module.css'

type SingleCellProps = {
	index: number;
	cardId: CardId | null;
}

export function SingleCell({ index, cardId }: SingleCellProps) {
	return (
		<Pile
			toPos={(_, card) => ({ zone: 'cell', x: index, y: card?.rank ?? null })}
			cardIds={cardId === null ? [] : [cardId]}
			maxDepth={1}
			placeholderClass={classes.cell}
		/>
	)
}

export function Cells() {
	const [{ config, history }] = useAppState()
	const { cells } = tail(history)
	const standardCells = cells.slice(0, config.cells)

	if (standardCells.length === 0) return null
	
	const { isTowers } = config

	return (
		<PileGroup className={concat(isTowers && classes.group)}>
			{standardCells.map((id, x) => (
				<SingleCell key={x} index={x} cardId={id} />
			))}
		</PileGroup>
	)
}
