import { generateArray } from '@dowhileluke/fns'
import { Card } from './types'

const namedRanks: Record<number, string> = {
	0: 'A',
	10: 'J',
	11: 'Q',
	12: 'K',
}

export const SUITS = ['\u2660', '\u2665', '\u2666', '\u2663']
export const SUITS_OUTLINE = ['\u2664', '\u2661', '\u2662', '\u2667']
export const RANKS = generateArray(13, n => namedRanks[n] ?? n + 1)
export const RANKS_DESC = RANKS.slice().reverse()
export const DECK = generateArray(52, n => {
	const rank = n % 13
	const result: Card = {
		suit: Math.floor(n / 13),
		rank,
	}

	return result
})
