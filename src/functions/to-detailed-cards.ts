import { split } from '@dowhileluke/fns'
import { CardValue, CascadeState, DetailedCard } from '../types'

function isSequential(card: CardValue, nextCard: CardValue) {
	return card + 1 === nextCard
}

export function toDetailedCards({ cards, down }: CascadeState) {
	const [downCards, upCards] = split(cards, down)
	const result = downCards.map((value): DetailedCard => ({ value, isDown: true, isConnected: false, isAvailable: false }))

	upCards.reverse()

	const upResults: DetailedCard[] = []
	let isAvailable = true

	for (const [index, value] of upCards.entries()) {
		const nextCard = upCards[index + 1]

		if (typeof nextCard === 'number' && isSequential(value, nextCard)) {
			upResults.push({ value, isDown: false, isConnected: true, isAvailable })
		} else {
			upResults.push({ value, isDown: false, isConnected: false, isAvailable })

			isAvailable = false
		}
	}

	return result.concat(upResults.reverse())
}
