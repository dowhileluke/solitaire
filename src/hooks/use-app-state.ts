import { useEffect, useState } from 'react'
import { tail } from '@dowhileluke/fns'
import { getPersistedState, setPersistedState } from '../functions/persist'
import { RULES } from '../rules'
import { FLAG_DEAL_LIMIT, FLAG_DEAL_TRIPLE } from '../rules/klondike'
import { AppActions, AppState, GameConfig, GameState, IsConnectedFn, Location } from '../types'
import { useForever } from './use-forever'
import { toSelectedCards } from '../functions'
import { CARD_DATA } from '../data'

const preferences: AppState['preferences'] = {
	spiderette: {
		suitCount: 4,
		deckCount: 1,
		modeFlags: 0,
	},
	klondike: {
		suitCount: 4,
		deckCount: 1,
		modeFlags: FLAG_DEAL_TRIPLE | FLAG_DEAL_LIMIT,
	},
	freecell: {
		suitCount: 4,
		deckCount: 1,
		modeFlags: 0,
	}
}

const persistedState = getPersistedState()
const mode = persistedState.mode ?? 'spiderette'
const config = persistedState.config ?? preferences[mode]

const initState: AppState = {
	history: [],
	preferences,
	...persistedState,
	selection: null,
	mode,
	config,
	isMenuOpen: false,
	menuMode: mode,
}

function revertPrefs(state: AppState) {
	const result: AppState = {
		...state,
		isMenuOpen: false,
		menuMode: state.mode,
		preferences: { ...state.preferences, [state.mode]: state.config },
	}

	return result
}

function toValidCards(config: GameConfig, state: GameState, source: Location, isConnected: IsConnectedFn) {
	if (source.zone === 'tableau') {
		const pile = state.tableau[source.x]

		if (pile.down > source.y) return []

		const pileCards = pile.cardIds.slice(0, source.y).map(id => CARD_DATA[id])
		const isAvailable = pileCards.slice(0, -1).every((card, i) => isConnected(card, pileCards[i + 1], config))

		return isAvailable ? pileCards : []
	}

	return toSelectedCards(state, source)
}

export function useAppState() {
	const [state, setState] = useState(initState)
	const { history, preferences, mode, config } = state

	useEffect(() => {
		setPersistedState({
			history, preferences, mode, config,
		})
	}, [history, preferences, mode, config])

	const actions = useForever<AppActions>({
		launchGame() {
			setState(({ menuMode, preferences }) => {
				const config = preferences[menuMode]
				const layout = RULES[menuMode].init(config)

				return {
					history: [layout],
					selection: null,
					mode: menuMode,
					config,
					isMenuOpen: false,
					menuMode,
					preferences,
				}
			})
		},
		setSelection(selection) {
			setState(prev => ({ ...prev, selection }))
		},
		moveCards(to) {
			setState(prev => {
				if (!prev.selection) return prev
				
				const NEVERMIND: AppState = { ...prev, selection: null, }
				const rules = RULES[prev.mode]

				if (rules.v === 2) {
					const layout = tail(prev.history)
					const movingCardIds = toSelectedCards(layout, prev.selection)

					return NEVERMIND
				}

				const prevLayout = tail(prev.history)
				const { move, autoMove } = rules
				const whereTo = to ?? autoMove?.(prev.config, prevLayout, prev.selection) ?? null

				if (!whereTo) return NEVERMIND

				const nextLayout = move(prev.config, prevLayout, prev.selection, whereTo)

				if (!nextLayout) return NEVERMIND

				return {
					...prev,
					history: prev.history.concat(nextLayout),
					selection: null,
				}
			})
		},
		deal() {
			setState(prev => {
				const { deal } = RULES[prev.mode]
				const nextLayout = deal(prev.config, tail(prev.history))

				if (!nextLayout) return prev

				return {
					...prev,
					history: prev.history.concat(nextLayout),
				}
			})
		},
		undo() {
			setState(prev => {
				if (prev.history.length < 2) return prev

				return {
					...prev,
					history: prev.history.slice(0, -1),
					selection: null,
				}
			})
		},
		restart() {
			setState(prev => ({
				...revertPrefs(prev),
				history: prev.history.slice(0, 1),
				selection: null,
			}))
		},
		playAnother() {
			setState(prev => ({
				...revertPrefs(prev),
				history: [RULES[prev.mode].init(prev.config)],
				selection: null,
			}))
		},
		openMenu(clearHistory = false) {
			if (clearHistory) {
				setState(prev => ({ ...prev, history: [], menuMode: prev.mode }))
			} else {
				setState(prev => ({ ...prev, isMenuOpen: true, menuMode: prev.mode }))
			}
		},
		dismissMenu() {
			setState(revertPrefs)
		},
		setMenuMode(menuMode) {
			setState(prev => ({ ...prev, menuMode }))
		},
		updatePreferences(changeset) {
			setState(prev => {
				const combined = { ...prev.preferences[prev.menuMode], ...changeset }
				
				return {
				...prev,
				preferences: { ...prev.preferences, [prev.menuMode]: combined },
			}})
		},
	})

	return [state, actions] as const
}
