import { Mode } from "./rules";

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
}

export type CascadeCard = Card & {
	isDown: boolean;
	isConnected: boolean;
	isAvailable: boolean;
}

export type Cascade = {
	cards: CascadeCard[];
	down: number;
	available: number;
}

export type GameState = {
	tableau: Pile[];
	stock?: CardId[];
	waste?: CardId[];
	foundations?: CardId[][];
	cells?: Array<CardId | null>;
	pass?: number;
}

export type Location = 
	| { zone: 'tableau', x: number, y: number }
	| { zone: 'foundation', x: number }
	| { zone: 'cell', x: number }
	| { zone: 'waste' }

export type AppState = {
	history: GameState[];
	selection: Location | null;
	mode: Mode;
	config: GameConfig;
	isMenuOpen: boolean;
}

export type AppActions = {
	launchGame: (mode: Mode, config: GameConfig) => void;
	setSelection: (selection: Location | null) => void;
	moveCards: (to?: Location | null) => void;
	deal: () => void;
	undo: () => void;
	restart: () => void;
	playAnother: () => void;
	setIsMenuOpen: (isOpen: boolean) => void;
}

export type GameConfig = {
	suitCount: number;
	hasExtraSpace: boolean;
	dealFlag: number;
}

export type IsConnectedFn = (above: Card, below: Card) => boolean

export type Rules = {
	init: (config: GameConfig) => GameState;
	deal: (state: GameState) => GameState | null;
	move: (state: GameState, from: Location, to: Location) => GameState | null;
	autoMove?: (state: GameState, from: Location) => Location | null;
	isConnected: IsConnectedFn;
}
