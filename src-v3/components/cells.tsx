import { tail } from '@dowhileluke/fns'
import { useAppState } from '../hooks/use-app-state'
import { PileGroup } from './pile-group'
import { Pile } from './pile'
import classes from './cells.module.css'

export function Cells() {
	const [{ history }] = useAppState()

	if (history[0].cells.length === 0) return null

	return (
		<PileGroup>
			{tail(history).cells.map((id, x) => (
				<Pile
					key={x}
					toPos={(_, card) => ({ zone: 'cell', x, y: card?.rank ?? null })}
					cardIds={id === null ? [] : [id]}
					maxDepth={1}
					placeholderClass={classes.cell}
				/>
			))}
		</PileGroup>
	)
}
