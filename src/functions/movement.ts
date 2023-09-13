import { CardId, GameState, Location, Pile } from '../types'

function sanitize(pile: Pile) {
	if (pile.cardIds.length === 0 || pile.cardIds.length > pile.down) return pile

	return {
		...pile,
		down: pile.cardIds.length - 1,
	}
}

function truncatePile({ cardIds, down }: Pile, size: number) {
	return sanitize({ cardIds: cardIds.slice(0, size), down })
}

function extendPile(pile: Pile, incomingIds: CardId[]) {
	if (incomingIds.length === 0) return pile

	return {
		...pile,
		cardIds: pile.cardIds.concat(incomingIds),
	}
}

export function removeAtLocation(state: GameState, loc: Location) {
	const result: GameState = { ...state }

	if (loc.zone === 'tableau') {
		result.tableau = state.tableau.map((pile, x) => x === loc.x ? truncatePile(pile, loc.y) : pile)

		return result
	}

	if (loc.zone === 'waste') {
		if (!state.waste) return state

		result.waste = truncatePile(state.waste, state.waste.cardIds.length - 1)

		return result
	}

	if (loc.zone === 'cell') {
		if (!state.cells) return state

		result.cells = state.cells.map((cardId, x) => loc.x === x ? null : cardId)

		return result
	}

	if (loc.zone === 'foundation') {
		if (!state.foundations) return state

		result.foundations = state.foundations.map((cardIds, x) => loc.x === x ? cardIds.slice(0, -1) : cardIds)

		return result
	}

	return state
}

export function appendAtLocation(state: GameState, loc: Location, cardIds: CardId[]) {
	const result: GameState = { ...state }

	if (loc.zone === 'tableau') {
		result.tableau = state.tableau.map((pile, x) => loc.x === x ? extendPile(pile, cardIds) : pile)

		return result
	}

	if (loc.zone === 'foundation') {
		result.foundations = state.foundations?.map((ids, x) => loc.x === x ? ids.concat(cardIds) : ids)

		return result
	}

	if (loc.zone === 'cell') {
		result.cells = state.cells?.map((id, x) => loc.x === x ? cardIds[0] : id)

		return result
	}

	return state
}
