// others: suits

type GameDef = {
	name: string;

	/// SETUP ///
	decks: 1 | 2;
	piles: 5 | 6 | 7 | 8 | 9 | 10;
	/** -1=skip one+rest down, 0-5=some down+rest up, 9=all down */
	down: -1 | 0 | 1 | 2 | 3 | 4 | 5 | 99;
	reps: -1 | 0 | 1 | 2 | 3 | 4 | 5 | 99;
	up: -1 | 0 | 1 | 2 | 3 | 4 | 5 | 99;
	bonus: 'none' | 'filled' | 'empty'

	/// RULES ///
	/** 0=stacks, 1=foundations, 2=foundations+prefill */
	goal: 'stacks' | 'foundations' | 'foundations_2'
	build: 'simple' | 'alternating' | 'suited';
	order: 'descending' | 'either';
	move: 'single' | 'any' | 'alternating' | 'suited';

	/// PLAY ///
	cells: 0 | 1 | 2 | 3 | 4 | 5 | 6;
	empty: 'none' | 'kings' | 'any';
	/** 0=to piles, 1-3=some to waste */
	deal: 0 | 1 | 2 | 3;
	limit: 0 | 1 | 2 | 3 | 4 | 5;
	recant: boolean;
}

export const klondike: GameDef = {
	name: 'Klondike',
	decks: 1,
	piles: 7,
	down: -1,
	reps: -1,
	up: 1,
	bonus: 'none',
	goal: 'foundations',
	build: 'alternating',
	order: 'descending',
	move: 'alternating',
	cells: 0,
	empty: 'kings',
	deal: 3,
	limit: 0,
	recant: false,
}

export const spider: GameDef = {
	name: 'Spider',
	decks: 2,
	piles: 10,
	down: 99,
	reps: 99,
	up: 1,
	bonus: 'none',
	goal: 'stacks',
	build: 'simple',
	order: 'descending',
	move: 'suited',
	cells: 0,
	empty: 'any',
	deal: 0,
	limit: 5,
	recant: false,
}


/*
[favorite]

[classic]
freecell
klondike
spider
yukon

[standard]
autumn
beleaguered
easthaven-2
incompat
scorpion

[variant]
bakers
fortress
easthaven
klondike-2
russian
simple
spider-1
wasp
willowisp

*/
