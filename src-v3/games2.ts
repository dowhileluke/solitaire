import { categorize } from '@dowhileluke/fns'

export const GAME_FAMILIES = ['Klondike', 'Spider', 'FreeCell', 'Yukon', 'Castle', 'Forty'] as const

export type GameKey = keyof typeof GAME_CATALOG
export type GameFamily = typeof GAME_FAMILIES[number]
export type GameGoal = 'foundation' | 'foundation@2' | 'sequence-in' | 'sequence-out'
export type LayoutMode = 'horizontal' | 'vertical'
export type GameDef = {
	key?: GameKey;
	name: string;
	family: GameFamily;
	goal: GameGoal;
	layoutMode?: LayoutMode;
	isTowers?: boolean;
	winRate?: number;

	// deck & stock
	decks?: 1 | 2;
	suits?: 1 | 2 | 3 | 4;
	wasteRate?: number;
	dealLimit?: number;

	// layout
	piles: number;
	upPiles?: number | true;
	emptyPiles?: number;
	pileHeight: number;
	overHeight?: number;
	cells?: number;
	filledCells?: number;

	// gameplay
	buildDirection: 'descending' | 'either';
	buildRestriction: 'none' | 'alt-color' | 'suit';
	groupRestriction: 'none' | 'alt-color' | 'suit' | 'restricted';
	emptyRestriction: 'none' | 'kings';
	allowRecant?: boolean;
}

export function toFullDef(def: GameDef, key: GameKey) {
	const result: Required<GameDef> = {
		key,
		layoutMode: 'horizontal',
		isTowers: false,
		winRate: 0,

		decks: 1,
		suits: 4,
		wasteRate: 0,
		dealLimit: 0,

		upPiles: 0,
		emptyPiles: 0,
		overHeight: 0,
		cells: 0,
		filledCells: 0,

		allowRecant: false,

		...def,
	}

	return result
}

const klondike: GameDef = {
	name: 'Klondike',
	family: 'Klondike',
	goal: 'foundation',

	decks: 1,
	wasteRate: 1,
	dealLimit: 1,

	piles: 7,
	pileHeight: -1,

	buildDirection: 'descending',
	buildRestriction: 'alt-color',
	groupRestriction: 'alt-color',
	emptyRestriction: 'kings',
}

const klondike2: GameDef = {
	...klondike,
	name: 'Klondike (2 decks)',
	decks: 2,
	piles: 9,
}

const westcliff: GameDef = {
	...klondike,
	name: 'Westcliff',
	pileHeight: 3,
}

const easthaven: GameDef = {
	...westcliff,
	name: 'Easthaven',
	wasteRate: 0,
	emptyRestriction: 'none',
	allowRecant: true,
}

const easthaven2: GameDef = {
	...easthaven,
	name: 'Easthaven (2 decks)',
	decks: 2,
	piles: 8,
}

const spider: GameDef = {
	name: 'Spider',
	family: 'Spider',
	goal: 'sequence-out',

	decks: 2,
	wasteRate: -1,
	dealLimit: 5,

	piles: 10,
	pileHeight: 999,

	buildDirection: 'descending',
	buildRestriction: 'none',
	groupRestriction: 'suit',
	emptyRestriction: 'none',
}

const will: GameDef = {
	...spider,
	name: "Will o' the Wisp",

	decks: 1,
	dealLimit: 0,

	piles: 7,
	pileHeight: 3,
}

const spiderette: GameDef = {
	...will,
	name: 'Spiderette',

	pileHeight: -1,
}

const simple: GameDef = {
	...spiderette,
	name: 'Simple Simon',
	goal: 'sequence-in',
	winRate: 97,

	piles: 10,
	upPiles: true,
}

const freecell: GameDef = {
	name: 'FreeCell',
	family: 'FreeCell',
	goal: 'foundation',
	winRate: 99,

	piles: 8,
	upPiles: true,
	pileHeight: 999,
	cells: 4,

	buildDirection: 'descending',
	buildRestriction: 'alt-color',
	groupRestriction: 'restricted',
	emptyRestriction: 'none',
}

const bakers: GameDef = {
	...freecell,
	name: "Baker's Game",
	winRate: 75,

	buildRestriction: 'suit',
}

const seahaven: GameDef = {
	...bakers,
	name: 'Seahaven Towers',
	isTowers: true,
	winRate: 89,

	piles: 10,
	filledCells: 2,

	emptyRestriction: 'kings',
}

const forecell: GameDef = {
	...freecell,
	name: 'ForeCell',
	winRate: 85,

	filledCells: 4,
	emptyRestriction: 'kings',
}

const yukon: GameDef = {
	...klondike,
	name: 'Yukon',
	family: 'Yukon',

	wasteRate: 0,
	dealLimit: 0,

	overHeight: 4,

	groupRestriction: 'none',
}

const russian: GameDef = {
	...yukon,
	name: 'Russian',

	buildRestriction: 'suit',
}

const scorpion: GameDef = {
	...russian,
	name: 'Scorpion',
	goal: 'sequence-out',

	upPiles: 3,
	pileHeight: 4,
	overHeight: 3,
}

const wasp: GameDef = {
	...scorpion,
	name: 'Wasp',

	emptyRestriction: 'none',
}

const beleaguered: GameDef = {
	...freecell,
	name: 'Beleaguered Castle',
	family: 'Castle',
	goal: 'foundation@2',
	layoutMode: 'vertical',
	winRate: 68,

	cells: 0,
	buildRestriction: 'none',
}

const fortress: GameDef = {
	...bakers,
	name: 'Fortress',
	family: 'Castle',
	layoutMode: 'vertical',
	winRate: 20,

	piles: 10,
	cells: 0,

	buildDirection: 'either',
}

const thieves: GameDef = {
	name: 'Forty Thieves',
	family: 'Forty',
	goal: 'foundation',

	decks: 2,
	wasteRate: 1,
	dealLimit: 1,

	piles: 10,
	upPiles: true,
	pileHeight: 4,

	buildDirection: 'descending',
	buildRestriction: 'suit',
	groupRestriction: 'restricted',
	emptyRestriction: 'none',
}

const eight: GameDef = {
	...thieves,
	name: 'Forty and Eight',
	
	dealLimit: 2,

	piles: 8,
	pileHeight: 5,
}

export const GAME_CATALOG = {
	klondike, westcliff, easthaven, klondike2, easthaven2,
	spider, spiderette, will, simple,
	freecell, bakers, seahaven, forecell,
	yukon, russian, scorpion, wasp,
	beleaguered, fortress,
	thieves, eight,
}
export const GAME_LIST = (Object.keys(GAME_CATALOG) as Array<GameKey>).map(k => toFullDef(GAME_CATALOG[k], k))
export const GAMES_BY_FAMILY = categorize(GAME_LIST, g => g.key)
