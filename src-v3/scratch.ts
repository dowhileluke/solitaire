export type GameDef = {
	name: string;
	decks: 1 | 2;
	piles: 5 | 6 | 7 | 8 | 9 | 10;

	/** 8 = unlimited, 10+ = ramp up */
	up: 1 | 2 | 3 | 4 | 5 | 8 | 11 | 12 | 13;

	/** 8 = unlimited, 10+ = ramp up */
	down: 0 | 1 | 2 | 3 | 4 | 5 | 8 | 10 | 11 | 12 | 13;

	/** none | empty | one card */
	extra: -1 | 0 | 1;
	cells: 0 | 1 | 2 | 3 | 4 | 5 | 6;

	/** A-K foundations | 2-K foundations | K-A stacks */
	goal: 0 | 1 | 9;

	/** descending | both directions */
	order: 1 | 2;

	/** unrestricted | alternate color | matching suit */
	build: 0 | 1 | 2;

	/** unrestricted | alternate color | matching suit | single card */
	move: 0 | 1 | 2 | 9;

	/** anything on spaces | kings only */
	kings: 0 | 1;

	/** N cards to Waste, 10+ deals 1 to Tableau piles */
	deal: 1 | 2 | 3 | 10 | 11;
	limit: 0 | 1 | 2 | 3 | 4 | 5;
}

export type GameDef2 = {
	name: string;
	decks: 1 | 2;
	piles: 5 | 6 | 7 | 8 | 9 | 10;
	shape: 'squared' | 'tapered';
	down: 0 | 1 | 2 | 3 | 4 | 5 | 'auto';
	up: 1 | 2 | 3 | 4 | 5 | 'all';
	extra: null | 0 | 1;
}
