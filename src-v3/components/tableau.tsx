import { split, tail } from '@dowhileluke/fns'
import { useAppState } from '../hooks/use-app-state'
import { PileGroup } from './pile-group'
import { Pile } from './pile'
import classes from './tableau.module.css'
import { Foundations } from './foundations'

export function Tableau() {
	const [{ config, history }] = useAppState()
	const { tableauGroups = 1 } = config
	const emptyNode = config.emptyRestriction === 'kings' ? 'K' : null
	const { tableau } = tail(history)

	if (tableauGroups === 1) {
		return (
			<PileGroup className={classes.tableau}>
				{tableau.map((pile, x) => (
					<Pile
						key={x}
						toPos={y => ({ zone: 'tableau', x, y })}
						emptyNode={emptyNode}
						{...pile}
					/>
				))}
			</PileGroup>
		)
	}

	const half = Math.ceil(tableau.length / 2)
	const [left, right] = split(tableau, half)

	return (
		<div className={classes.multi}>
			<PileGroup vertical>
				{left.map((pile, x) => (
					<Pile
						key={x}
						toPos={y => ({ zone: 'tableau', x, y })}
						emptyNode={emptyNode}
						angle='W'
						{...pile}
					/>
				))}
			</PileGroup>
			<Foundations groupIndex={0} vertical />
			<PileGroup vertical>
				{right.map((pile, i) => (
					<Pile
						key={i}
						toPos={y => ({ zone: 'tableau', x: half + i, y })}
						emptyNode={emptyNode}
						angle='E'
						{...pile}
					/>
				))}
			</PileGroup>
		</div>
	)
}
