import { useEffect, useState } from 'react'
import { tail } from '@dowhileluke/fns'
import { CARD_DATA } from '../data'
import { isAllConnected, toSelectedCards } from '../functions'
import { moveCardIds } from '../functions/movement'
import { getPersistedState, setPersistedState } from '../functions/persist'
import { RULES } from '../rules'
import { FLAG_DEAL_LIMIT, FLAG_DEAL_TRIPLE } from '../rules/klondike'
import { AppActions, AppState, GameState, Location } from '../types'
import { useForever } from './use-forever'

const DEFAULT_PREFERENCES: AppState['preferences'] = {
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
	},
	yukon: {
		suitCount: 4,
		deckCount: 1,
		modeFlags: 0,
	},
}

const persistedState = getPersistedState()
const mode = persistedState.mode ?? 'spiderette'
const config = persistedState.config ?? DEFAULT_PREFERENCES[mode]

const initState: AppState = {
	history: [],
	...persistedState,
	preferences: { ...DEFAULT_PREFERENCES, ...persistedState.preferences },
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

function isSourceVisible(state: GameState, source: Location) {
	if (source.zone === 'tableau') {
		return source.y >= state.tableau[source.x].down
	} else if (source.zone === 'waste') {
		if (!state.waste) return false
		
		return source.y >= state.waste.down
	}

	return true
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
				const { isConnected, isValidTarget, guessMove, validateState } = RULES[prev.mode]
				const layout = tail(prev.history)

				if (!isSourceVisible(layout, prev.selection)) return NEVERMIND

				const movingCardIds = toSelectedCards(layout, prev.selection)
				const movingCards = movingCardIds.map(id => CARD_DATA[id])

				if (movingCards.length === 0 || !isAllConnected(movingCards, isConnected, prev.config)) {
					return NEVERMIND
				}

				let target = to && isValidTarget(prev.config, layout, movingCards, to) ? to : null

				if (!to && guessMove) {
					target = guessMove(prev.config, layout, movingCards, prev.selection)
				}

				if (!target) return NEVERMIND
				
				const roughLayout = moveCardIds(layout, movingCardIds, prev.selection, target)
				const finalLayout = validateState?.(roughLayout) ?? roughLayout

				return {
					...prev,
					history: prev.history.concat(finalLayout),
					selection: null,
				}
			})
		},
		deal() {
			setState(prev => {
				const rules = RULES[prev.mode]
				const roughLayout = rules.deal(prev.config, tail(prev.history))

				if (!roughLayout) return prev

				const finalLayout = rules.validateState?.(roughLayout) || roughLayout

				return {
					...prev,
					history: prev.history.concat(finalLayout),
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
