import { GameKey } from "./games";

export type CardId = number

export type Pile = {
	cardIds: CardId[];
	down: number;
}

export type Card = {
	id?: CardId;
	rank: number;
	suit: string;
	isRed: boolean;
	label: string;
	initials: string;
}

export type PileCard = Card & {
	isAvailable: boolean;
	isConnected: boolean;
}

export type GameState = {
	stock: CardId[];
	tableau: Pile[];
	foundations: Array<CardId | null>;
	waste: Pile | null;
	cells: Array<CardId | null>;
	pass: number;
}

export type Position =
	| { zone: 'tableau'; x: number; y: number }
	| { zone: 'foundation'; x: number; }

export type Rules = {
	isConnected: (low: Card, high: Card) => boolean;
	toPileCards: (cardIds: CardId[]) => PileCard[];
}
	
export type AppState = {
	history: GameState[];
	selection: Position | null;
	gameKey: GameKey;
	rules: Rules;
}

export type AppActions = {
	launchGame: () => void;
	setSelection: (pos: Position | null) => void;
}
