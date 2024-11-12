import { split, tail } from '@dowhileluke/fns'
import { useAppState } from '../hooks/use-app-state'
import { Foundations } from './foundations'
import { PileGroup } from './pile-group'
import { Pile } from './pile'
import classes from './tableau.module.css'
import { concat } from '../functions/concat'

export function Tableau() {
	const [{ config, history, layoutMode }] = useAppState()
	const emptyNode = config.emptyRestriction === 'kings' ? 'K' : null
	const { tableau } = tail(history)
	const isMassive = tableau.length > 10

	if (layoutMode === 'horizontal' && !isMassive) {
		return (
			<PileGroup>
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
		<div className={concat(classes.multi, isMassive && classes.vertical)}>
			<PileGroup vertical={!isMassive}>
				{left.map((pile, x) => (
					<Pile
						key={x}
						toPos={y => ({ zone: 'tableau', x, y })}
						emptyNode={emptyNode}
						angle={isMassive ? 'S' : 'W'}
						{...pile}
					/>
				))}
			</PileGroup>
			<Foundations groupIndex={0} vertical />
			<PileGroup vertical={!isMassive}>
				{right.map((pile, i) => (
					<Pile
						key={i}
						toPos={y => ({ zone: 'tableau', x: half + i, y })}
						emptyNode={emptyNode}
						angle={isMassive ? 'S' : 'E'}
						{...pile}
					/>
				))}
			</PileGroup>
		</div>
	)
}
