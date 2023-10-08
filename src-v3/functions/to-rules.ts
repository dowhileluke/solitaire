import { CARD_DATA } from '../data';
import { GameDef } from '../games';
import { Card, CardId, PileCard, Rules } from '../types'

export function toRules(def: GameDef) {
	function isSequential(source: Card, target: Card) {
		const delta = target.rank - source.rank

		if (def.buildDirection === 'descending') return delta === 1

		return Math.abs(delta) === 1
	}

	function isConnected(source: Card, target: Card) {
		if (!isSequential(source, target)) return false
		if (def.groupRestriction === 'suit') return source.suit === target.suit
		if (def.groupRestriction === 'alt-color') return source.isRed !== source.isRed
		if (def.groupRestriction === 'none') return true

		// else use supermove logic
		if (def.buildRestriction === 'suit') return source.suit === target.suit
		if (def.buildRestriction === 'alt-color') return source.isRed !== source.isRed

		return true
	}

	/** not to include face-down cards */
	function toPileCards(cardIds: CardId[]) {
		const cards = cardIds.map(id => CARD_DATA[id]).reverse()
		const result: PileCard[] = []

		let available = 0
		let isAvailable = true
	
		for (const [i, card] of cards.entries()) {
			const nextCard = cards[i + 1]
	
			if (isAvailable) {
				available += 1
			}
	
			if (nextCard && isConnected(card, nextCard)) {
				result.push({ ...card, isConnected: true, isAvailable })
			} else {
				result.push({ ...card, isConnected: false, isAvailable })
	
				isAvailable = false
			}
		}

		return result.reverse()
	}

	const result: Rules = {
		isConnected,
		toPileCards,
	}

	return result
}
