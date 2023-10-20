import { concat } from '../functions/concat'
import { useAppState } from '../hooks/use-app-state'
import { CardId } from '../types'
import { Card } from './card2'
import classes from './card-pile.module.css'

type CardPileProps = {
	cardIds: CardId[]
}

export function CardPile({ cardIds }: CardPileProps) {
	const [{ rules }] = useAppState()

	return (
		<ul className={concat(classes.pile, classes.horizontal, classes.west)}>
			<Card details={null} />
			{rules.toPileCards(cardIds).map(x => (
				<Card details={x} />
			))}
		</ul>
	)
}
