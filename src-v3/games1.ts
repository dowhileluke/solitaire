import { GameDef } from '../src/types'

export const klondike: GameDef = {
	name: 'Klondike',
	decks: 1,
	piles: 7,
	up: 1,
	down: 10,
	extra: -1,
	cells: 0,
	goal: 1,
	order: 1,
	build: 1,
	move: 1,
	kings: 1,
	deal: 3,
	limit: 0,
}

export const spiderette: GameDef = {
	...klondike,
	name: 'Spiderette',
	goal: 9,
	build: 0,
	move: 2,
	kings: 0,
	deal: 10,
}

export const spider: GameDef = {
	...spiderette,
	name: 'Spider',
	decks: 2,
	piles: 10,
	down: 8,
	limit: 5,
}

export const freecell: GameDef = {
	name: 'FreeCell',
	decks: 1,
	piles: 8,
	up: 8,
	down: 0,
	extra: -1,
	cells: 4,
	goal: 0,
	order: 1,
	build: 1,
	move: 9,
	kings: 0,
	deal: 10,
	limit: 0,
}

export const bakers: GameDef = {
	...freecell,
	name: "Baker's Game",
	build: 2,
}

export const yukon: GameDef = {
	...klondike,
	name: 'Yukon',
	piles: 6,
	up: 5,
	down: 11,
	extra: 1,
	move: 0,
	deal: 10,
}

export const russian: GameDef = {
	...yukon,
	name: 'Russian',
	move: 2,
}
