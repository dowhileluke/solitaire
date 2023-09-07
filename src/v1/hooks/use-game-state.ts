import { useState } from 'react'
import { split, tail } from '@dowhileluke/fns'
import { deal } from '../functions/deal'
import { appendToPile, truncatePile } from '../functions/pile'
import { Coordinates, GameState } from '../types'

const start = deal()

start.tableau.unshift({ cards: [], down: 0, })

const initState: GameState = {
	history: [start],
	highlight: null,
	selection: null,
}

export function useGameState() {
	const [state, setState] = useState(initState)

	const actions = {
		setHighlight(highlight: Coordinates | null) {
			setState(prev => ({ ...prev, highlight, }))
		},
		setSelection(selection: Coordinates | null) {
			setState(prev => ({ ...prev, selection, highlight: selection, }))
		},
		moveSelection(x: number) {
			setState(prev => {
				const nevermind: GameState = { ...prev, highlight: null, selection: null, }

				if (!prev.selection) return nevermind

				const current = tail(prev.history)
				const sourcePile = current.tableau[prev.selection.x]
				const selectedY = prev.selection.y
				const selectedCard = sourcePile.cards[selectedY]
				const targetPile = current.tableau[x]
				const targetCard = targetPile.cards.length > 0 ? tail(targetPile.cards) : null

				// sanity check
				if (targetCard && targetCard.rank !== selectedCard.rank + 1) return nevermind

				const nextTableau = current.tableau.map(pile => {
					if (pile === targetPile) {
						return appendToPile(pile, sourcePile.cards.slice(selectedY))
					} else if (pile === sourcePile) {
						return truncatePile(pile, selectedY)
					} else {
						return pile
					}
				})

				const result: GameState = {
					...prev,
					history: prev.history.concat({ tableau: nextTableau, stock: current.stock, }),
					selection: null,
					highlight: null,
				}

				return result
			})
		},
		deal() {
			setState(prev => {
				const current = tail(prev.history)
				// const pileCount = current.tableau.length
				const [incoming, stock] = split(current.stock, current.tableau.length)
				const [receiving, unchanged] = split(current.tableau, incoming.length)
				const tableau = receiving.map((pile, i) => appendToPile(pile, incoming[i])).concat(unchanged)
				const result: GameState = {
					...prev,
					history: prev.history.concat({ tableau, stock }),
					highlight: null,
					selection: null,
				}

				return result
			})
		},
		rewind() {
			setState(prev => {
				const history = prev.history.slice(0, -1)

				if (history.length === 0) return prev

				const result: GameState = { history, highlight: null, selection: null, }

				return result
			})
		},
	}

	return [state, actions] as const
}
