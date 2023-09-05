import { split } from '@dowhileluke/fns'
import { DetailedCard, Pile } from '../types'

const DOWN_CARD: DetailedCard = { suit: 0, rank: 0, isAvailable: false, isConnected: false, isDown: true, }

export function toDetailedCards({ cards, down }: Pile) {
	const [downCards, upCards] = split(cards, down)
	const result = downCards.map(card => ({ ...DOWN_CARD, ...card, }))

	upCards.reverse()

	const temp: DetailedCard[] = []
	let isAvailable = true

	for (const [index, card] of upCards.entries()) {
		const nextCard = upCards[index + 1]

		if (nextCard && nextCard.suit === card.suit && nextCard.rank === card.rank + 1) {
			temp.push({ ...card, isAvailable, isConnected: true, isDown: false, })
		} else {
			temp.push({ ...card, isAvailable, isConnected: false, isDown: false, })

			isAvailable = false
		}
	}

	return result.concat(temp.reverse())
}
