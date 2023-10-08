import { tail } from '@dowhileluke/fns'
import { useAppState } from '../hooks/use-app-state'
import { PileGroup } from './pile-group'
import { Pile } from './pile'

export function Tableau() {
	const [{ history }] = useAppState()

	return (
		<PileGroup>
			{tail(history).tableau.map((pile, x) => (
				<Pile key={x} zone="tableau" {...pile} />
			))}
		</PileGroup>
	)
}
