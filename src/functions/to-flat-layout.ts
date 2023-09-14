import { generateArray } from '@dowhileluke/fns'
import { CardId, Pile } from '../types'

export function toFlatLayout(cards: CardId[], pileCount: number, isUp = false) {
	const minHeight = Math.floor(cards.length / pileCount)
	const minIndex = cards.length % pileCount
	const tableau: Pile[] = []
	let index = 0

	for (const i of generateArray(pileCount)) {
		const height = i < minIndex ? minHeight + 1 : minHeight
		const cardIds = cards.slice(index, index + height)

		tableau.push({
			cardIds,
			down: isUp ? 0 : height - 1,
		})

		index += height
	}

	return tableau
}
