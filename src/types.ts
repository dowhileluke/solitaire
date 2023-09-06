export type Card = {
	rank: number;
	suit: number;
}

export type DetailedCard = Card & {
	isAvailable?: boolean;
	isConnected?: boolean;
	isDown?: boolean;
}

export type Pile = {
	cards: Card[];
	down: number;
}

export type DeckState = {
	stock: Card[];
	tableau: Pile[];
}

export type Coordinates = {
	x: number;
	y: number;
}

export type GameState = {
	history: DeckState[];
	highlight: Coordinates | null;
	selection: Coordinates | null;
}
