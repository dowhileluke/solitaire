import { split, tail } from '@dowhileluke/fns'
import { Card, Pile } from '../types'

function cleanPile({ cards, down }: Pile) {
	const result: Pile = {
		cards,
		down: down > 0 && down >= cards.length ? cards.length - 1 : down,
	}

	return result
}

export function truncatePile({ cards, down }: Pile, length: number) {
	return cleanPile({
		cards: cards.slice(0, length),
		down,
	})
}

export function appendToPile({ cards, down }: Pile, incoming: Card | Card[]) {
	const joined = cards.concat(incoming)
	const [rest, last13] = split(joined, -13)
	const seqSuit = tail(joined).suit
	const isSequence = last13.length === 13 && last13.every(c => c.suit === seqSuit)

	return cleanPile({
		cards: isSequence ? rest : joined,
		down,
	})
}
