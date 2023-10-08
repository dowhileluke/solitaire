export type GameDef = {
	buildDirection: 'descending' | 'either';
	buildRestriction: 'none' | 'alt-color' | 'suit';
	groupRestriction: 'none' | 'alt-color' | 'suit' | 'restricted';
	emptyRestriction: 'none' | 'kings';
}

const klondike: GameDef = {
	buildDirection: 'descending',
	buildRestriction: 'alt-color',
	groupRestriction: 'alt-color',
	emptyRestriction: 'kings',
}

const freecell: GameDef = {
	buildDirection: 'descending',
	buildRestriction: 'alt-color',
	groupRestriction: 'restricted',
	emptyRestriction: 'none',
}

export const GAME_CATALOG = {
	klondike,
	freecell,
}

export type GameKey = keyof typeof GAME_CATALOG
