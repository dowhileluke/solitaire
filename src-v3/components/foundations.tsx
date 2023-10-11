import { tail } from '@dowhileluke/fns'
import { useAppState } from '../hooks/use-app-state'
import { PileGroup } from './pile-group'
import { Pile } from './pile'
import { CARD_DATA } from '../data'
import { CardId } from '../types'

function mockCardIds(id: CardId | null) {
	if (id === null) return []

	const card = CARD_DATA[id]

	if (card.rank === 0) return [id]

	return [id - 1, id]
}

export function Foundations() {
	const [{ history }] = useAppState()

	return (
		<PileGroup>
			{tail(history).foundations.map((id, x) => (
				<Pile
					key={x}
					toPos={(_, card) => ({ zone: 'foundation', x, y: card?.rank })}
					emptyNode="A"
					cardIds={mockCardIds(id)}
					maxDepth={1}
				/>
			))}
		</PileGroup>
	)
}
