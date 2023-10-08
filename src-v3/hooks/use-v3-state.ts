import { useState } from 'react'
import { generateArray } from '@dowhileluke/fns'
import { generateDeck, shuffle } from '../../src/functions'
import { CardId, Pile } from '../../src/types'
import { useForever } from '../../src/hooks/use-forever'

///////////////////////////////////////

type GameDef = {
	decks: 1 | 2;
	open: number;
	up: number;
	down: number;
	repeat: -1 | 0 | 1 | 2 | 3 | 4 | 5 | 99;
}

const beleaguered: GameDef = {
	decks: 1,
	open: 0,
	up: 8,
	down: 0,
	repeat: 99,
}

const klondike: GameDef = {
	decks: 1,
	open: 5,
	up: 1,
	down: 6,
	repeat: -1,
}

const spiderette: GameDef = {
	...klondike,
}

const GAME_CATALOG = {
	klondike,
	beleaguered,
	spiderette,
}

type GameKey = keyof typeof GAME_CATALOG

///////////////////////////////////////

type GameState = {
	stock: CardId[];
	tableau: Pile[];
	foundations: CardId[];
}

function toPile(cardIds: CardId[], down: number) {
	const result: Pile = { cardIds, down }

	return result
}

function toDeck(deckCount: 1 | 2) {
	let deck = generateDeck()

	if (deckCount === 2) deck = deck.concat(deck)

	return shuffle(deck)
}

function toInitialState(def: GameDef) {
	const { open, up, down, repeat } = def
	const pilesToFill = up + down
	const tableau = generateArray(open, () => toPile([], 0))

	let deck = toDeck(def.decks)
	let index = 0

	if (repeat === -1) {
		for (let h = 0; h < pilesToFill; h++) {
			const remaining = deck.length - index
			const maxHeight = Math.floor(remaining / (pilesToFill - h))
			const height = Math.min(h + 1, maxHeight)

			tableau.push({
				cardIds: deck.slice(index, index + height),
				down: up > height ? 0 : height - up,
			})

			index += height
		}

		deck = deck.slice(index)
	} else {
		for (let i = 0; i < pilesToFill; i++) {
			const remaining = deck.length - index
			const maxHeight = Math.ceil(remaining / (pilesToFill - i))
			const height = Math.min(repeat, maxHeight)

			tableau.push({
				cardIds: deck.slice(index, index + height),
				down: i < up ? 0 : height,
			})

			index += height
		}
	}

	deck = deck.slice(index)
	
	const result: GameState = {
		tableau,
		stock: deck,
		foundations: [],
	}

	return result
}

export function v3test() {
	return toInitialState(GAME_CATALOG['klondike'])
}

///////////////////////////////////////

type AppState = {
	gameKey: GameKey;
	history: GameState[];
}

const initState: AppState = {
	gameKey: 'klondike',
	history: [],
}

type AppActions = {
	begin: () => void;
}

export function useV3State() {
	const [state, setState] = useState(initState)

	const actions = useForever<AppActions>({
		begin() {
			setState(prev => prev)
		},
	})

	return [state, actions] as const
}
