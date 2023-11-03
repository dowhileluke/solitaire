import { categorize, generateArray, split } from '@dowhileluke/fns'
import { CARD_DATA } from '../data'
import { GameDef } from '../games2'
import { CardId, GameState } from '../types'
import { generateDeck } from './generate-deck'
import { shuffle } from './shuffle'
import { toPile } from './pile'
import { rotateArray } from './rotate-array'

function setAside(cardIds: CardId[], n: number) {
	if (!n) return [cardIds, [] as number[]] as const

	return split(cardIds, -n)
}

function organizeCells(filledIds: Array<CardId | null>, total: number, isTowers: boolean) {
	const delta = total - filledIds.length
	const result = filledIds.concat(generateArray(delta, () => null))

	if (isTowers && delta > 0 && delta % 2 === 0) return rotateArray(result, delta >> 1)

	return result
}

function toTableau(
	cardIds: CardId[],
	{ wasteRate, dealLimit, piles, pileHeight, upPiles, overHeight, emptyPiles }: Required<GameDef>
) {
	const isFixedStock = wasteRate === 0 && 0 < dealLimit && dealLimit < 999
	const [deck, stockCards] = setAside(cardIds, isFixedStock ? piles * dealLimit : 0)

	const pileCardIds = generateArray<CardId[]>(piles, () => [])
	let deckIndex = 0

	if (pileHeight < 0) {
		for (let rowIndex = 0; rowIndex < piles && deckIndex < deck.length; rowIndex += 1) {
			const deckRemaining = deck.length - deckIndex
			const rowWidth = Math.min(piles - rowIndex, deckRemaining)
			const firstColIndex = piles - rowWidth

			for (let i = 0; i < rowWidth; i += 1) {
				pileCardIds[firstColIndex + i].push(deck[deckIndex + i])
			}

			deckIndex += rowWidth
		}
	} else {
		const cardsNeeded = Math.min(deck.length, piles * pileHeight)

		for (let i = 0; i < cardsNeeded; i += 1) {
			pileCardIds[i % piles].push(deck[i])
		}

		deckIndex = cardsNeeded
	}

	const pileDown = upPiles === true
		? generateArray(piles, () => 0)
		: pileCardIds.map((ids, index) => index < upPiles ? 0 : ids.length - 1).reverse()


	if (overHeight) {
		for (let colIndex = 0; colIndex < piles; colIndex += 1) {
			const deckRemaining = deck.length - deckIndex
			const colsFollowing = piles - colIndex - 1
			const reserved = colsFollowing * overHeight
			const colHeight = Math.min(deckRemaining - reserved, overHeight)

			if (colHeight > 0) {
				pileCardIds[colIndex] = pileCardIds[colIndex].concat(deck.slice(deckIndex, deckIndex + colHeight))

				deckIndex += colHeight
			}
		}
	}

	const tableau = generateArray(emptyPiles, () => toPile([]))
		.concat(pileCardIds.map((cardIds, index) => toPile(cardIds, pileDown[index])))
	const stock = deck.slice(deckIndex).concat(stockCards)

	return [tableau, stock] as const
}

export function toInitialState(def: Required<GameDef>) {
	const d = generateDeck(def.suits)
	const allCards = shuffle(def.decks === 1 ? d : d.concat(d))

	// foundations
	const [aces, stock_p1] = def.goal === 'foundation@2' 
		? categorize(allCards, id => CARD_DATA[id].rank === 0)
		: [[], allCards]
	const foundations = def.goal === 'foundation' ? generateArray(def.decks * 4, () => null) : aces

	// cells
	const cellsToFill = Math.min(def.cells, def.filledCells)
	const [stock_p2, cellCards] = setAside(stock_p1, cellsToFill)
	const cells = organizeCells(cellCards, def.cells, def.isTowers)

	const [tableau, stock] = toTableau(stock_p2, def)
	const result: GameState = {
		foundations,
		tableau,
		cells,
		stock,
		waste: def.wasteRate > 0 ? toPile([]) : null,
		pass: 1,
	}

	return result
}
