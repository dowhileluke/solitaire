import { GameDef, GameKey } from "./games2";

export type CardId = number

export type Pile = {
	cardIds: CardId[];
	down: number;
}

export type Card = {
	id: CardId;
	rank: number;
	name: string;
	suit: string;
	suitIndex: number;
	isRed: boolean;
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
	| { zone: 'foundation'; x: number; y?: number | null }
	| { zone: 'waste'; y?: number | null; }
	| { zone: 'cell'; x: number; y?: number | null }

export type GuessedPosition = Position & { invert?: boolean }

export type MoveValidation = 'invert' | 'simple' | false

export type Rules = {
	isConnected: (low: Card, high: Card) => boolean;
	finalizeState: (state: GameState) => GameState;
	isValidMove: (state: GameState, movingCardIds: CardId[], to: Position) => MoveValidation;
	guessMove: (state: GameState, movingCardIds: CardId[], from: Position) => GuessedPosition | null;
	dealStock: (state: GameState) => GameState | null;
	advanceState: (state: GameState) => GameState | null;

	/** only for face-up cards */
	toPileCards: (cardIds: CardId[]) => PileCard[];
}

export type BaseAppState = {
	history: GameState[];
	selection: Position | null;
	gameKey: GameKey;
	isExporting: boolean;
	isMenuOpen: boolean;
	menuKey: GameKey;
}

export type AppState = BaseAppState & {
	config: Required<GameDef>;
	rules: Rules;
}

export type AppActions = {
	launchGame: () => void;
	setSelection: (pos: Position | null) => void;
	moveCards: (pos?: Position) => void;
	undo: () => void;
	deal: () => void;
	fastForward: () => void;
	toggleExport: () => void;
	toggleMenu: () => void;
	setMenuKey: (key: GameKey) => void;
}

export type LayoutMode = 'generic' | 'castle' | 'towers'
