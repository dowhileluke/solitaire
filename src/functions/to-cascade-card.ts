import { CARD_DATA } from '../data'
import { Card, CardId, CascadeCard } from '../types'

export function toCascadeCard(
	cardOrId: Card | CardId | null, isDown: boolean, isConnected: boolean, isAvailable: boolean
) {
	if (cardOrId === null) return null

	const card = typeof cardOrId === 'number' ? CARD_DATA[cardOrId] : cardOrId
	const result: CascadeCard = {
		...card,
		isDown,
		isConnected,
		isAvailable,
	}

	return result
}
