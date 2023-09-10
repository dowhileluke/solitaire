import { generateArray } from '@dowhileluke/fns';

export function generateDeck(suitCount: number) {
	return generateArray(52, n => n % (13 * suitCount))
}
