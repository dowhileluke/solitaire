import { ReactNode } from 'react'
import { X } from '@phosphor-icons/react'
import { split, tail } from '@dowhileluke/fns'
import { GameDef } from '../games2'
import { useAppState } from '../hooks/use-app-state'
import { Foundations } from './foundations'
import { PileGroup } from './pile-group'
import { Pile } from './pile'
import classes from './tableau.module.css'
import { concat } from '../functions/concat'

const nodes: Record<GameDef['emptyRestriction'], ReactNode> = {
	none: null,
	kings: 'K',
	blocked: <X />,
}

export function Tableau() {
	const [{ config, history, layoutMode }] = useAppState()
	const emptyNode = nodes[config.emptyRestriction]
	const emptyClass = concat(config.emptyRestriction === 'blocked' && 'fade')
	const { tableau } = tail(history)
	const isMassive = tableau.length > 10

	if (layoutMode === 'horizontal') {
		return (
			<PileGroup>
				{tableau.map((pile, x) => (
					<Pile
						key={x}
						toPos={y => ({ zone: 'tableau', x, y })}
						emptyNode={emptyNode}
						placeholderClass={emptyClass}
						{...pile}
					/>
				))}
			</PileGroup>
		)
	}

	const half = Math.ceil(tableau.length / 2)
	const [left, right] = split(tableau, half)

	return (
		<div className={concat(classes.multi, isMassive && classes.massive)}>
			<PileGroup vertical={!isMassive}>
				{left.map((pile, x) => (
					<Pile
						key={x}
						toPos={y => ({ zone: 'tableau', x, y })}
						emptyNode={emptyNode}
						placeholderClass={emptyClass}
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
						placeholderClass={emptyClass}
						angle={isMassive ? 'S' : 'E'}
						{...pile}
					/>
				))}
			</PileGroup>
		</div>
	)
}
