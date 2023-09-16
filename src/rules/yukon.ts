import { generateArray, tail } from '@dowhileluke/fns'
import { CARD_DATA } from '../data'
import { generateDeck, isAllConnected, shuffle, toAscendingLayout } from '../functions'
import { GameConfig, IsValidTargetFn, Rules } from '../types'
import { FLAG_SUITED_ONLY, toGuessMoveFn, isConnected, validateState } from './freecell'

const isValidTarget: IsValidTargetFn = (config, state, movingCards, to) => {
	if (to.zone === 'tableau') {
		const targetPile = state.tableau[to.x]

		if (targetPile.cardIds.length === 0) return movingCards[0].rank === 12

		return isConnected(movingCards[0], CARD_DATA[tail(targetPile.cardIds)], config)
	}

	if (to.zone === 'foundation') {
		const suitedConfig: GameConfig = { ...config, modeFlags: config.modeFlags | FLAG_SUITED_ONLY }
		const isSuited = isAllConnected(movingCards, isConnected, suitedConfig)

		if (!isSuited) return false

		const target = state.foundations[to.x]
		const smallestMoving = tail(movingCards)

		if (target.length === 0) return smallestMoving.rank === 0

		const targetCard = CARD_DATA[tail(target)]

		return smallestMoving.suit === targetCard.suit && smallestMoving.rank === targetCard.rank + 1
	}

	return false
}

export const yukon: Rules = {
	init({ suitCount }) {
		const deck = shuffle(generateDeck(suitCount))
		const { tableau, stock } = toAscendingLayout(deck, 6, 6, 5)

		tableau.unshift({ cardIds: stock, down: 0 })

		return {
			tableau,
			foundations: generateArray(4, () => []),
		}
	},
	deal(_, state) {
		return state
	},
	isConnected() {
		return true
	},
	isValidTarget,
	validateState,
	guessMove: toGuessMoveFn(isValidTarget),
}
