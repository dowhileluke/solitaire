import { concat } from '../functions/concat'
import { useAppState } from '../hooks/use-app-state'
import { CardId } from '../types'
import { Card } from './card'
import classes from './card-pile.module.css'

type CardPileProps = {
	cardIds: CardId[];
	angle?: 'W' | 'E' | 'S';
}

export function CardPile({ cardIds, angle = 'S' }: CardPileProps) {
	const [{ rules }] = useAppState()

	return (
		<ul className={concat(
			classes.pile,
			angle !== 'S' && classes.horizontal,
			angle === 'W' && classes.west,
		)}>
			<Card details={null} />
			{rules.toPileCards(cardIds).map(x => (
				<Card details={x} />
			))}
		</ul>
	)
}
