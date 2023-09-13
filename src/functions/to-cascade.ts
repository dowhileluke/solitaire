import { split } from '@dowhileluke/fns'
import { CARD_DATA } from '../data'
import { Card, Cascade, CascadeCard, GameConfig, IsConnectedFn, Pile } from '../types'

function toDownCard(card: Card) {
	const result: CascadeCard = {
		...card,
		isDown: true,
		isConnected: false,
		isAvailable: false,
	}

	return result
}

export function toCascade({ cardIds, down }: Pile, isConnected: IsConnectedFn, config: GameConfig) {
	const [downCards, upCards] = split(cardIds.map(id => CARD_DATA[id]), down)

	upCards.reverse()

	const upResults: CascadeCard[] = []
	let available = 0
	let isAvailable = true

	for (const [i, card] of upCards.entries()) {
		const nextCard = upCards[i + 1]

		if (isAvailable) {
			available += 1
		}

		if (nextCard && isConnected(card, nextCard, config)) {
			upResults.push({ ...card, isDown: false, isConnected: true, isAvailable })
		} else {
			upResults.push({ ...card, isDown: false, isConnected: false, isAvailable })

			isAvailable = false
		}
	}

	const result: Cascade = {
		cards: downCards.map(toDownCard).concat(upResults.reverse()),
		down,
		available,
	}

	return result
}
