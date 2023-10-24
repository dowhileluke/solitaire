import { tail } from '@dowhileluke/fns'
import { GAME_CATALOG } from '../games'
import { useAppState } from '../hooks/use-app-state'
import { PileGroup } from './pile-group'
import { Pile } from './pile'
import classes from './tableau.module.css'

export function Tableau() {
	const [{ history, gameKey }] = useAppState()

	return (
		<PileGroup className={classes.tableau}>
			{tail(history).tableau.map((pile, x) => (
				<Pile
					key={x}
					toPos={y => ({ zone: 'tableau', x, y })}
					emptyNode={GAME_CATALOG[gameKey].emptyRestriction === 'kings' ? 'K' : null}
					{...pile}
				/>
			))}
		</PileGroup>
	)
}
