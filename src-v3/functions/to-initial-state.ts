import { categorize, generateArray, split } from '@dowhileluke/fns'
import { CARD_DATA } from '../data'
import { GameDef } from '../games'
import { CardId, GameState } from '../types'
import { generateDeck } from './generate-deck'
import { shuffle } from './shuffle'
import { toPile } from './to-pile'

function toTableau(
	allCards: CardId[],
	{
		wasteRate = 0, dealLimit = 0, invert,
		baseRowEmpty = 0, baseRowUp, baseRowDown, baseRowRepeat, upperWidth = 0, upperRepeat = 0,
	}: GameDef,
) {
	const baseRowWidth = baseRowUp + baseRowDown
	const tableauWidth = baseRowEmpty + baseRowWidth

	// determine which groups have a preferred number of cards
	const isUpperFixed = upperWidth > 0 && (0 < upperRepeat && upperRepeat < 999)
	const isBaseFixed = (0 < baseRowRepeat && baseRowRepeat < 999)
	const isStockFixed = wasteRate === 0 && (0 < dealLimit && dealLimit < 999)

	// preferentially assign cards to groups
	let [lowerCards, upperCards] = isUpperFixed ? split(allCards, -upperWidth * upperRepeat) : [allCards, []]
	let [stock, baseCards] = isBaseFixed
		? split(lowerCards, -baseRowWidth * baseRowRepeat)
		: (isStockFixed ? split(lowerCards, -baseRowWidth * dealLimit) : [[], lowerCards])

	// assign baseCards to piles
	let index = 0
	const basePileCardIds = generateArray<CardId[]>(tableauWidth, () => [])

	if (baseRowRepeat === -1) {
		for (let rowIndex = 0; rowIndex < baseRowWidth; rowIndex++) {
			const rowWidth = baseRowWidth - rowIndex
			const rowCards = baseCards.slice(index, index + rowWidth)
			const offset = tableauWidth - rowCards.length // might not be the full rowWidth

			for (let j = 0; j < rowCards.length; j++) {
				basePileCardIds[j + offset].push(rowCards[j])
			}

			index += rowWidth
		}

		stock = baseCards.slice(index).concat(stock)
	} else {
		for (let i = 0; i < baseCards.length; i++) {
			const x = baseRowEmpty + (i % baseRowWidth) // baseRowEmpty === offset
			const y = Math.floor(i / baseRowWidth)

			basePileCardIds[x][y] = baseCards[i]
		}
	}

	// calculate `down` value for each pile before adding upper rows
	const basePileDown = generateArray(tableauWidth, i => {
		if (baseRowRepeat === -1) {
			return Math.max(0, basePileCardIds[i].length - baseRowUp)
		}

		return i < (tableauWidth - baseRowDown) ? 0 : basePileCardIds[i].length
	})

	// add upper cards
	if (upperWidth > 0 && upperRepeat > 0) {
		if (upperRepeat === 999) {
			upperCards = stock
			stock = []
		}

		const offset = tableauWidth - upperWidth

		for (let i = 0; i < upperCards.length; i++) {
			basePileCardIds[offset + (i % upperWidth)].push(upperCards[i])
		}
	}

	// convert to a final array of piles
	const tableau = generateArray(tableauWidth, (i) => toPile(basePileCardIds[i], basePileDown[i]))

	if (invert) tableau.reverse()

	const result: Pick<GameState, 'tableau' | 'stock'> = { tableau, stock }

	return result
}

export function toInitialState(def: GameDef) {
	const { decks, suits = 4, goal, wasteRate = 0, emptyCells = 0, filledCells = 0 } = def
	const d = generateDeck(suits)
	const allCards = shuffle(decks === 1 ? d : d.concat(d))

	// foundations
	const [aces, stock_1] = goal === 'foundation@2' 
		? categorize(allCards, id => CARD_DATA[id].rank === 0)
		: [[], allCards]
	const foundations = goal === 'foundation' ? generateArray(decks * 4, () => null) : aces

	// cells
	const cells = generateArray<CardId | null>(filledCells, i => stock_1[i])
		.concat(generateArray(emptyCells, () => null))
	
	const stock_2 = stock_1.slice(filledCells)

	const result: GameState = {
		foundations,
		cells,
		...toTableau(stock_2, def),
		waste: wasteRate > 0 ? { cardIds: [], down: 0 } : null,
		pass: 1,
	}

	return result
}
