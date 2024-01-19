import { generateArray } from '@dowhileluke/fns'
import { Card, CardId } from './types'

const SUITS = ['\u2660', '\u2665', '\u2666', '\u2663'].map(s => s + '\ufe0e')
const NAMED_RANKS: Record<number, string> = {
	0: 'A',
	9: '10',
	10: 'J',
	11: 'Q',
	12: 'K',
}

const RANK_INITIALS = 'a23456789tjqk'.split('')
const SUIT_INITIALS = 'shdc'.split('')

export function isRedIndex(suitIndex: number) {
	return suitIndex === 1 || suitIndex === 2
}

export const CARD_DATA: Record<CardId, Card> = Object.fromEntries(generateArray(52, (id: CardId) => {
	const rank = id % 13
	const suitIndex = Math.floor(id / 13)
	const suit = SUITS[suitIndex]
	const result: Card = {
		id,
		rank,
		name: (NAMED_RANKS[rank] || rank + 1).toString(),
		suit,
		suitIndex,
		isRed: isRedIndex(suitIndex),
		initials: RANK_INITIALS[rank] + SUIT_INITIALS[suitIndex],
	}

	return [id, result] as const
}))
