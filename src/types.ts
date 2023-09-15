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
	foundations: CardId[][];
	stock?: CardId[];
	waste?: Pile;
	cells?: Array<CardId | null>;
	pass?: number;
}

export type Location = 
	| { zone: 'tableau', x: number, y: number }
	| { zone: 'foundation', x: number, y: number }
	| { zone: 'cell', x: number }
	| { zone: 'waste', y: number }

export type AppState = {
	history: GameState[];
	selection: Location | null;
	mode: Mode;
	config: GameConfig;
	isMenuOpen: boolean;
	menuMode: Mode;
	preferences: Record<Mode, GameConfig>;
}

export type AppActions = {
	launchGame: () => void;
	setSelection: (selection: Location | null) => void;
	moveCards: (to?: Location | null) => void;
	deal: () => void;
	undo: () => void;
	restart: () => void;
	playAnother: () => void;
	openMenu: (clearHistory?: boolean) => void;
	dismissMenu: () => void;
	setMenuMode: (menuMode: Mode) => void;
	updatePreferences: (changeset: Partial<GameConfig>) => void;
}

export type GameConfig = {
	suitCount: number;
	deckCount: number;
	modeFlags: number;
}

export type IsConnectedFn = (low: Card, high: Card, config: GameConfig) => boolean

export type Rules = {
	v: 1,
	init: (config: GameConfig) => GameState;
	deal: (config: GameConfig, state: GameState) => GameState | null;
	move: (config: GameConfig, state: GameState, from: Location, to: Location) => GameState | null;
	autoMove?: (config: GameConfig, state: GameState, from: Location) => Location | null;
	isConnected: IsConnectedFn;
}

// movingCards are validated before the rule functions are called
export type RulesV2 = {
	v: 2,
	init: (config: GameConfig) => GameState;
	deal: (config: GameConfig, state: GameState) => GameState | null;
	isConnected: IsConnectedFn;
	isValidTarget: (config: GameConfig, state: GameState, movingCards: Card[], to: Location) => boolean;
	validateState?: (state: GameState) => GameState;
	guessMove: (config: GameConfig, state: GameState, movingCards: Card[], from: Location) => Location | null;
}
