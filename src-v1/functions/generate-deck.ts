import { generateArray } from '@dowhileluke/fns'
import { CardId } from '../types'

export function generateDeck(suitCount = 4) {
	return generateArray(52, (n): CardId => n % (13 * suitCount))
}
