export type Card = {
	rank: number;
	suit: number;
}

export type DealtCard = Card & {
	isKnown: boolean;
}
