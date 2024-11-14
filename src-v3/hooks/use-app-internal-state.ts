import { useEffect, useMemo, useState } from 'react'
import { objectFilter, tail } from '@dowhileluke/fns'
import { setPersistedState, getPersistedState } from '../functions/persist'
import { toInitialState } from '../functions/to-initial-state'
import { toRules } from '../functions/to-rules'
import { AppActions, AppState, BaseAppState } from '../types'
import { useForever } from './use-forever'
import { isGameComplete } from '../functions/is-game-complete'
import { getConfig, getPrefs, getRules } from '../functions/internal'
import { concludeSelection } from '../functions/conclude-selection'

function getInitialState() {
	const state = getPersistedState()
	const {
		history = [],
		gameKey = 'klondike',
		gamePrefs = {},
		prefs = {},
		isMenuFiltered = false,
		isFourColorEnabled = true,
	} = state

	// convert legacy value
	const colorMode = state.colorMode ?? (isFourColorEnabled && 'rummi')
	const result: BaseAppState = {
		history,
		selection: null,
		merciX: null,
		gameKey,
		gamePrefs,
		isPrefsOpen: false,
		isMenuOpen: false,
		isMenuFiltered,
		colorMode,
		menuKey: gameKey,
		prefs,
	}

	return result
}

export function useAppInternalState() {
	const [state, setState] = useState(getInitialState)
	const { history, gameKey, gamePrefs, prefs, isMenuFiltered, colorMode } = state
	const config = useMemo(() => getConfig({ gameKey, gamePrefs }), [gameKey, gamePrefs])
	const rules = useMemo(() => toRules(config), [config])
	const layoutMode = prefs[gameKey]?.layoutMode ?? config.layoutMode
	const isComplete = history.length > 0 && isGameComplete(tail(history), config)
	const isMerciActive = state.merciX !== null
	const appState: AppState = {
		...state,
		config,
		rules,
		layoutMode,
		isComplete,
		isMerciActive,
	}

	useEffect(() => {
		setPersistedState({ history, gameKey, gamePrefs, prefs, isMenuFiltered, colorMode })
	}, [history, gameKey, gamePrefs, prefs, isMenuFiltered, colorMode])

	const actions = useForever<AppActions>({
		launchGame(isRepeat) {
			setState(prev => {
				const prefs = getPrefs(prev, isRepeat)

				return {
					...prev,
					...prefs,
					isMenuOpen: false,
					history: [toInitialState(getConfig(prefs))],
				}
			})
		},
		setSelection(selection) {
			setState(prev => ({ ...prev, selection, }))
		},
		moveCards(to) {
			setState(prev => concludeSelection(prev, to))
		},
		undo() {
			setState(prev => {
				if (prev.merciX !== null) return { ...prev, merciX: null, }
				if (prev.history.length < 2) return prev

				return {
					...prev,
					history: prev.history.slice(0, -1),
					selection: null,
					merci: null,
				}
			})
		},
		undoAll() {
			setState(prev => ({
				...prev,
				history: prev.history.slice(0, 1),
				selection: null,
				merci: null,
				isMenuOpen: false,
			}))
		},
		deal() {
			setState(prev => {
				const { dealStock, finalizeState } = getRules(prev)
				const nextGameState = dealStock(tail(prev.history))

				if (!nextGameState) return prev

				return {
					...prev,
					history: prev.history.concat(finalizeState(nextGameState)),
					selection: null,
				}
			})
		},
		fastForward(x) {
			setState(prev => {
				if (prev.selection) return prev

				return concludeSelection({ ...prev, selection: { zone: 'foundation', x } })
			})
		},
		togglePrefs() {
			setState(prev => ({ ...prev, isPrefsOpen: !prev.isPrefsOpen }))
		},
		toggleMenu(isMenuOpen: boolean) {
			setState(prev => ({ ...prev, isMenuOpen, menuKey: prev.gameKey, }))
		},
		toggleFilter() {
			setState(prev => {
				const isMenuFiltered = !prev.isMenuFiltered
				const isKeyVisible = prev.prefs[prev.menuKey]?.isFavorite || prev.menuKey === prev.gameKey
				const menuKey = isKeyVisible || !isMenuFiltered ? prev.menuKey : prev.gameKey

				return { ...prev, isMenuFiltered, menuKey, }
			})
		},
		setColorMode(colorMode) {
			setState(prev => ({ ...prev, colorMode, }))
		},
		setMenuKey(menuKey) {
			setState(prev => ({ ...prev, menuKey, }))
		},
		setGamePref(gameKey, prefKey, prefValue) {
			setState(prev => {
				const standardConfig = getConfig({ gameKey, gamePrefs: {} })
				const { [gameKey]: prefsForKey = {}, ...otherPrefs } = prev.prefs
				const otherPrefsForKey = objectFilter(prefsForKey, (_, key) => key !== prefKey)

				if (prefValue !== standardConfig[prefKey]) {
					(otherPrefsForKey)[prefKey] = prefValue
				}

				const isStandard = Object.keys(otherPrefsForKey).length === 0
				const isUnfavorite = prev.isMenuFiltered && gameKey === prev.menuKey && !otherPrefsForKey.isFavorite

				return {
					...prev,
					prefs: isStandard ? otherPrefs : { ...otherPrefs, [gameKey]: { ...otherPrefsForKey, }, },
					menuKey: isUnfavorite ? prev.gameKey : prev.menuKey,
				}
			})
		},
	})

	return [appState, actions] as const
}
