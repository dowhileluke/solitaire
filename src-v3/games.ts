export type GameDef = {
	name: string;
	winRate?: number;

	// deck & stock
	decks: 1 | 2;
	suits?: 1 | 2 | 3 | 4;
	goal: 'sequence' | 'foundation' | 'foundation@2';
	wasteRate?: number;
	dealLimit?: number;
	emptyCells?: number;
	filledCells?: number;

	// layout
	invert?: boolean;
	baseRowEmpty?: number;
	baseRowUp: number;
	baseRowDown: number;
	baseRowRepeat: number; // -1 for indent
	upperWidth?: number;
	upperRepeat?: number;

	// gameplay
	buildDirection: 'descending' | 'either';
	buildRestriction: 'none' | 'alt-color' | 'suit';
	groupRestriction: 'none' | 'alt-color' | 'suit' | 'restricted';
	emptyRestriction: 'none' | 'kings';
	allowRecant?: boolean;
}

const klondike: GameDef = {
	name: 'Klondike',
	decks: 1,
	goal: 'foundation',
	wasteRate: 3,
	baseRowUp: 1,
	baseRowDown: 6,
	baseRowRepeat: -1,
	buildDirection: 'descending',
	buildRestriction: 'alt-color',
	groupRestriction: 'alt-color',
	emptyRestriction: 'kings',
}

const klondike2: GameDef = {
	...klondike,
	name: 'Klondike (2 decks)',
	decks: 2,
	baseRowDown: 8,
}

const easthaven: GameDef = {
	...klondike,
	name: 'Easthaven',
	baseRowUp: 0,
	baseRowDown: 7,
	baseRowRepeat: 2,
	upperWidth: 7,
	upperRepeat: 1,
	wasteRate: 0,
}

const easthaven2: GameDef = {
	...easthaven,
	name: 'Easthaven (2 decks)',
	decks: 2,
	baseRowDown: 8,
	upperWidth: 8,
}

const yukon: GameDef = {
	...klondike,
	name: 'Yukon',
	wasteRate: 0,
	upperWidth: 6,
	upperRepeat: 4,
	groupRestriction: 'none',
}

const russian: GameDef = {
	...yukon,
	name: 'Russian',
	buildRestriction: 'suit',
}

const freecell: GameDef = {
	name: 'FreeCell',
	winRate: 99,
	decks: 1,
	goal: 'foundation',
	emptyCells: 4,
	baseRowUp: 8,
	baseRowDown: 0,
	baseRowRepeat: 999,
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

const forecell: GameDef = {
	...freecell,
	name: 'ForeCell',
	winRate: 85,
	emptyCells: 0,
	filledCells: 4,
	emptyRestriction: 'kings',
}

const fortress: GameDef = {
	...freecell,
	name: 'Fortress',
	winRate: 20,
	emptyCells: 0,
	baseRowUp: 10,
	buildDirection: 'either',
	buildRestriction: 'suit',
}

const beleaguered: GameDef = {
	...freecell,
	name: 'Beleaguered',
	winRate: 68,
	goal: 'foundation@2',
	emptyCells: 0,
	buildRestriction: 'none',
}

const canister: GameDef = {
	...freecell,
	name: 'Canister',
	emptyCells: 0,
	buildDirection: 'either',
	emptyRestriction: 'kings',
}

const spiderette: GameDef = {
	...klondike,
	name: 'Spiderette',
	goal: 'sequence',
	wasteRate: 0,
	buildRestriction: 'none',
	groupRestriction: 'suit',
	emptyRestriction: 'none',
}

const spider: GameDef = {
	...spiderette,
	name: 'Spider',
	decks: 2,
	dealLimit: 5,
	baseRowDown: 10,
	baseRowUp: 0,
	baseRowRepeat: 999,
	upperWidth: 10,
	upperRepeat: 1,
}

const willo: GameDef = {
	...spiderette,
	name: "Will o' the Wisp",
	baseRowDown: 7,
	baseRowUp: 0,
	baseRowRepeat: 2,
	upperWidth: 7, 
	upperRepeat: 1,
}

const kiev: GameDef = {
	...willo,
	name: 'Kiev',
	baseRowRepeat: 3,
	buildRestriction: 'suit',
	groupRestriction: 'none',
}

const simple: GameDef = {
	...spiderette,
	name: 'Simple Simon',
	winRate: 97,
	baseRowUp: 10,
	baseRowDown: 0,
}

const scorpion: GameDef = {
	...yukon,
	name: 'Scorpion',
	goal: 'sequence',
	invert: true,
	baseRowDown: 4,
	baseRowUp: 3,
	baseRowRepeat: 3,
	upperWidth: 7,
	upperRepeat: 4,
	buildRestriction: 'suit',
}

const thieves: GameDef = {
	name: 'Forty Thieves',
	decks: 2,
	goal: 'foundation',
	wasteRate: 1,
	dealLimit: 1,
	baseRowUp: 10,
	baseRowDown: 0,
	baseRowRepeat: 4,
	buildDirection: 'descending',
	buildRestriction: 'suit',
	groupRestriction: 'restricted',
	emptyRestriction: 'none',
}

const forty_eight: GameDef = {
	...thieves,
	name: 'Forty and Eight',
	dealLimit: 2,
	baseRowUp: 8,
	baseRowRepeat: 5,
}

export const GAME_CATALOG = {
	bakers,
	beleaguered,
	canister,
	easthaven,
	easthaven2,
	forecell,
	fortress,
	forty_eight,
	freecell,
	kiev,
	klondike,
	klondike2,
	russian,
	scorpion,
	simple,
	spider,
	spiderette,
	thieves,
	willo,
	yukon,
}

export type GameKey = keyof typeof GAME_CATALOG
