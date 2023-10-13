import { tail } from '@dowhileluke/fns'
import { CARD_DATA } from '../data'
import { useAppState } from '../hooks/use-app-state'
import { CardId } from '../types'
import { PileGroup } from './pile-group'
import { Pile } from './pile'
import classes from './foundations.module.css'

function mockCardIds(id: CardId | null) {
	if (id === null) return []

	const card = CARD_DATA[id]

	if (card.rank === 0) return [id]

	return [id - 1, id]
}

export function Foundations() {
	const [{ history, config }] = useAppState()

	return (
		<PileGroup className={classes.foundations}>
			{tail(history).foundations.map((id, x) => (
				<Pile
					key={x}
					toPos={(_, card) => ({ zone: 'foundation', x, y: card?.rank ?? null })}
					emptyNode="A"
					cardIds={mockCardIds(id)}
					maxDepth={1}
					isDropOnly={!config.allowRecant}
				/>
			))}
		</PileGroup>
	)
}
