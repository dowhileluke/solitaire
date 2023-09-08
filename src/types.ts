export type Location = 
	| { zone: 'tableau', x: number, y: number }
	| { zone: 'foundation', x: number }
	| { zone: 'cell', x: number }
	| { zone: 'waste' }

// export type Zone = Location['zone']

export type CardValue = number

export type DetailedCard = {
	value: CardValue;
	isDown: boolean;
	isConnected: boolean;
	isAvailable: boolean;
}

export type CascadeState = {
	cards: CardValue[];
	down: number;
}

export type LayoutState = {
	tableau: CascadeState[];
	stock?: CardValue[];
}

export type AppState = {
	history: LayoutState[];
	selection: Location | null;
}

export type AppActions = {
	setSelection: (selection: Location | null) => void;
	moveCards: (destination: Location) => void;
}
