import { categorize } from '@dowhileluke/fns'

export type GameFamily = 'Klondike' | 'Spider' | 'FreeCell' | 'Yukon' | 'Castle' | 'Forty'
// export type FamilyDef = {
// 	key: GameFamily;
// 	desc: string;
// }
// export const GAME_FAMILIES: FamilyDef[] = [
// 	{ key: 'Klondike', desc: 'The ' },
// 	{ key: 'Spider', desc: 'Build sequences by suit to remove them from the tableau' },
// 	{ key: 'FreeCell', desc: 'Unravel ' },
// 	{ key: 'Yukon', desc: 'Move any card within the tableau' },
// 	{ key: 'Castle', desc: 'Unravel tableaus' },
// 	{ key: 'Forty', desc: '' },
// ]
export const GAME_FAMILIES: GameFamily[] = ['Klondike', 'Spider', 'FreeCell', 'Yukon', 'Castle', 'Forty']
export type GameKey = keyof typeof GAME_CATALOG
export type GameGoal = 'foundation' | 'foundation@2' | 'sequence-in' | 'sequence-out'
export type LayoutMode = 'horizontal' | 'vertical'
export type GameDef = {
	key?: GameKey;
	name: string;
	family: GameFamily;
	shortRules: string;
	goal: GameGoal;
	layoutMode?: LayoutMode;
	isTowers?: boolean;
	solveRate?: number;
	isFavorite?: boolean;

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
		layoutMode: 'horizontal',
		isTowers: false,
		solveRate: 0,
		isFavorite: false,

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
		key,
	}

	return result
}

const klondike: GameDef = {
	name: 'Klondike',
	family: 'Klondike',
	shortRules: 'Solitaire in its most famous form',
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
	name: 'Double Klondike',
	shortRules: 'Two-deck Klondike',
	decks: 2,
	piles: 9,
}

const westcliff: GameDef = {
	...klondike,
	name: 'Westcliff',
	shortRules: 'Klondike with a smaller starting tableau',
	pileHeight: 3,
}

const easthaven: GameDef = {
	...westcliff,
	name: 'Easthaven',
	shortRules: 'Klondike crossed with Spider',
	wasteRate: 0,
	emptyRestriction: 'none',
	allowRecant: true,
}

const easthaven2: GameDef = {
	...easthaven,
	name: 'Double Easthaven',
	shortRules: 'Two-deck Easthaven',
	decks: 2,
	piles: 8,
}

const spider: GameDef = {
	name: 'Spider',
	family: 'Spider',
	shortRules: 'Build suited sequences to remove them',
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
	shortRules: 'One-deck Spider, small tableau',

	decks: 1,
	dealLimit: 0,

	piles: 7,
	pileHeight: 3,
}

const spiderette: GameDef = {
	...will,
	name: 'Spiderette',
	shortRules: 'One-deck Spider, large tableau',

	pileHeight: -1,
}

const simple: GameDef = {
	...spiderette,
	name: 'Simple Simon',
	shortRules: 'One-deck Spider, all cards visible',
	goal: 'sequence-in',
	solveRate: 97,

	piles: 10,
	upPiles: true,
}

const freecell: GameDef = {
	name: 'FreeCell',
	family: 'FreeCell',
	shortRules: 'Move single cards with 4 spare cells',
	goal: 'foundation',
	solveRate: 99,

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
	shortRules: 'FreeCell using matching suits',
	solveRate: 75,

	buildRestriction: 'suit',
}

const seahaven: GameDef = {
	...bakers,
	name: 'Seahaven Towers',
	shortRules: "Baker's Game cleverly reimagined",
	isTowers: true,
	solveRate: 89,

	piles: 10,
	filledCells: 2,

	emptyRestriction: 'kings',
}

const forecell: GameDef = {
	...freecell,
	name: 'ForeCell',
	shortRules: "FreeCell's tougher predecessor",
	solveRate: 85,

	filledCells: 4,
	emptyRestriction: 'kings',
}

const yukon: GameDef = {
	...klondike,
	name: 'Yukon',
	family: 'Yukon',
	shortRules: 'Klondike spinoff; move any visible card',

	wasteRate: 0,
	dealLimit: 0,

	overHeight: 4,

	groupRestriction: 'none',
}

const russian: GameDef = {
	...yukon,
	name: 'Russian',
	shortRules: 'Yukon using matching suits',

	buildRestriction: 'suit',
}

const scorpion: GameDef = {
	...russian,
	name: 'Scorpion',
	shortRules: 'Construct K-A sequences by suit',
	goal: 'sequence-out',

	upPiles: 3,
	pileHeight: 4,
	overHeight: 3,
}

const wasp: GameDef = {
	...scorpion,
	shortRules: 'Scorpion without restricted empty spaces',
	name: 'Wasp',

	emptyRestriction: 'none',
}

const yukon2: GameDef = {
	...yukon,
	name: 'Double Yukon',
	shortRules: 'Two-deck Yukon',

	decks: 2,

	piles: 10,
	overHeight: 5,
}

const beleaguered: GameDef = {
	...freecell,
	name: 'Beleaguered Castle',
	family: 'Castle',
	shortRules: 'FreeCell without cells; no color restriction',
	goal: 'foundation@2',
	layoutMode: 'vertical',
	solveRate: 68,

	cells: 0,
	buildRestriction: 'none',
}

const fortress: GameDef = {
	...bakers,
	name: 'Fortress',
	family: 'Castle',
	shortRules: 'Build suited cards bidirectionally',
	layoutMode: 'vertical',
	solveRate: 20,

	piles: 10,
	cells: 0,

	buildDirection: 'either',
}

const alleys: GameDef = {
	...beleaguered,
	name: 'Streets & Alleys',
	shortRules: 'Beleaguered without prefilled Aces',
	goal: 'foundation',
	solveRate: 51,
}

const stronghold: GameDef = {
	...alleys,
	name: 'Stronghold',
	shortRules: 'Streets & Alleys with a singular cell',
	solveRate: 97,
	layoutMode: 'horizontal',

	cells: 1,
}

const canister: GameDef = {
	...forecell,
	name: 'Canister (sans Merci)',
	family: 'Castle',
	shortRules: 'Fortress using alternating colors',
	solveRate: 0,

	cells: 0,
	buildDirection: 'either',
}

const thieves: GameDef = {
	name: 'Forty Thieves',
	family: 'Forty',
	shortRules: '40-card tableau, single-card moves',
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
	shortRules: 'Forty Thieves with a redeal',
	
	dealLimit: 2,

	piles: 8,
	pileHeight: 5,
}

const alibaba: GameDef = {
	...thieves,
	name: 'Ali Baba',
	shortRules: 'One-deck variant, moveable sequences',
	goal: 'foundation@2',

	decks: 1,
	groupRestriction: 'suit',
}

export const GAME_CATALOG = {
	klondike, westcliff, easthaven, klondike2, easthaven2,
	spider, spiderette, will, simple,
	freecell, bakers, seahaven, forecell,
	yukon, russian, scorpion, wasp, yukon2,
	beleaguered, fortress, alleys, stronghold, canister,
	thieves, eight, alibaba,
}
export const GAME_LIST = (Object.keys(GAME_CATALOG) as Array<GameKey>).map(k => toFullDef(GAME_CATALOG[k], k))
export const GAMES_BY_FAMILY = categorize(GAME_LIST, g => g.family)
