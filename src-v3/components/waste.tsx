import { tail } from '@dowhileluke/fns'
import { useAppState } from '../hooks/use-app-state'
import { Pile } from './pile'
import { PileGroup } from './pile-group'
import { CSSProperties } from 'react'
import classes from './waste.module.css'

export function Waste() {
	const [{ history, config }] = useAppState()
	const { waste } = tail(history)

	if (!waste || (waste.cardIds.length === 0 && config.wasteRate < 1)) return null

	const size = {
		'--size': (config.wasteRate + 1) / 2,
		justifyContent: 'start',
	} as CSSProperties

	return (
		<PileGroup style={size} className={classes.waste}>
			<Pile
				angle={config.wasteRate > 1 ? 'E' : 'S'}
				toPos={y => ({ zone: 'waste', y })}
				maxDepth={Math.max(waste.cardIds.length - waste.down, 1)}
				placeholderClass={classes.void}
				isDragOnly
				{...waste}
			/>
		</PileGroup>
	)
}
