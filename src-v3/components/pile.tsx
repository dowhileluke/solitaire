import { Pile as PileDef, Position } from '../types'
import { useAppState } from '../hooks/use-app-state'
import { truthy } from '@dowhileluke/fns'

type PileProps = PileDef & Pick<Position, 'zone'>

export function Pile({ cardIds, down }: PileProps) {
	const [{ rules }] = useAppState()
	const upCards = rules.toPileCards(cardIds.slice(down))

	function toLabel(index: number) {
		if (index < down) return 'down'

		const curr = upCards[index - down]

		return curr.label + ':' + truthy(curr.isAvailable && 'available', curr.isConnected && 'connected').join(', ')
	}

	return (
		<ul>
			{cardIds.map((id, index) => (
				<li key={index}>
					{id} {toLabel(index)}
				</li>
			))}
		</ul>
	)
}
