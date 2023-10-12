import { tail } from '@dowhileluke/fns'
import { useAppState } from '../hooks/use-app-state'
import { Pile } from './pile'
import { PileGroup } from './pile-group'
import classes from './waste.module.css'
import { CSSProperties } from 'react'

export function Waste() {
	const [{ history, config }] = useAppState()
	const { waste } = tail(history)

	if (!waste) return null

	const size = { '--size': config.wasteRate ?? 1 } as CSSProperties

	return (
		<PileGroup style={size}>
			<Pile
				horizontal
				toPos={y => ({ zone: 'waste', y })}
				maxDepth={waste.cardIds.length - waste.down}
				placeholderClass={classes.void}
				isDragOnly
				{...waste}
			/>
		</PileGroup>
	)
}
