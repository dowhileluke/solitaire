import { tail } from '@dowhileluke/fns'
import { useAppState } from '../hooks/use-app-state'
import { PileGroup } from './pile-group'
import { Pile } from './pile'
import { GAME_CATALOG } from '../games'

export function Tableau() {
	const [{ history, gameKey }] = useAppState()

	return (
		<PileGroup>
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
