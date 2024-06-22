import { tail } from '@dowhileluke/fns'
import { BaseAppState, GameState, Position } from '../types'
import { getConfig } from './internal'
import { swapMerciCardIds, moveCardIds } from './move-card-ids'
import { toRules } from './to-rules'
import { toSelectedCardIds } from './to-selected-card-ids'

function isSelfTargeting(source: Position, target: Position) {
	if (source.zone === 'foundation' && target.zone === 'foundation') {
		return source.x === target.x
	}

	if (source.zone === 'tableau' && target.zone === 'tableau') {
		return source.x === target.x
	}

	return false
}

export function concludeSelection(prev: BaseAppState, to?: Position | undefined) {
	if (!prev.selection) return prev

	const NEVERMIND: typeof prev = { ...prev, selection: null }

	if (to && prev.merciX === null && isSelfTargeting(prev.selection, to)) return NEVERMIND
	if (to && to.zone === 'merci') {
		if (prev.selection.zone !== 'tableau') return NEVERMIND
		if (prev.merciX === null) return { ...prev, selection: null, merciX: prev.selection.x, }
	}

	const GAME_STATE = tail(prev.history)
	const config = getConfig(prev)
	const { isValidMove, guessMove, finalizeState, advanceState } = toRules(config)
	let nextGameState: GameState | null = null

	if (prev.merciX !== null) {
		if (to && to.zone !== 'merci') {
			if (to.zone !== 'tableau' || to.x !== prev.merciX) return NEVERMIND
		}

		nextGameState = finalizeState(swapMerciCardIds(GAME_STATE, prev.merciX, prev.selection))
	} else if (!to && prev.selection.zone === 'foundation') {
		nextGameState = advanceState(GAME_STATE)

		if (nextGameState === null && !config.allowRecant) return NEVERMIND
	}

	const selectedCardIds = toSelectedCardIds(GAME_STATE, prev.selection)

	if (nextGameState === null) {
		if (selectedCardIds.length === 0) return NEVERMIND

		let target: Position | null = to ?? null
		let invert = false

		if (to) {
			const validity = isValidMove(GAME_STATE, selectedCardIds, to)

			if (!validity) return NEVERMIND

			invert = validity === 'invert'
		} else {
			const guess = guessMove(GAME_STATE, selectedCardIds, prev.selection)

			target = guess
			invert = Boolean(guess?.invert)
		}

		if (!target) return NEVERMIND

		nextGameState = finalizeState(moveCardIds(
			GAME_STATE,
			invert ? selectedCardIds.slice().reverse() : selectedCardIds,
			prev.selection,
			target,
		))
	}

	if (!nextGameState) return NEVERMIND

	return {
		...prev,
		history: prev.history.concat(nextGameState),
		selection: null,
		merciX: null,
	}
}
