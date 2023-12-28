import { useEffect, useMemo, useState } from 'react'
import { tail } from '@dowhileluke/fns'
import { GAME_CATALOG, GameDef, toFullDef } from '../games2'
import { moveCardIds } from '../functions/move-card-ids'
import { setPersistedState, getPersistedState } from '../functions/persist'
import { toInitialState } from '../functions/to-initial-state'
import { toRules } from '../functions/to-rules'
import { toSelectedCardIds } from '../functions/to-selected-card-ids'
import { AppActions, AppState, BaseAppState, GameState, Position } from '../types'
import { useForever } from './use-forever'
import { isGameComplete } from '../functions/is-game-complete'

function getInitialState() {
	const state = getPersistedState()
	const { history = [], gameKey = 'klondike', gamePrefs = {}, prefs = {}, isMenuFiltered = false, } = state
	const result: BaseAppState = {
		history,
		selection: null,
		gameKey,
		gamePrefs,
		isExporting: false,
		isMenuOpen: false,
		isMenuFiltered,
		menuKey: gameKey,
		prefs,
	}

	return result
}

type ConfigProps = Pick<BaseAppState, 'gameKey' | 'gamePrefs'>

function getConfig({ gameKey, gamePrefs }: ConfigProps) {
	// ignore layoutMode
	const { layoutMode, ...rest } = gamePrefs

	return toFullDef({ ...GAME_CATALOG[gameKey], ...rest, }, gameKey)
}

function getRules(props: ConfigProps) {
	return toRules(getConfig(props))
}

function isSelfTargeting(source: Position, target: Position) {
	if (source.zone === 'foundation' && target.zone === 'foundation') {
		return source.x === target.x
	}

	if (source.zone === 'tableau' && target.zone === 'tableau') {
		return source.x === target.x
	}

	return false
}

function getPrefs(state: BaseAppState, isRepeat = false) {
	if (isRepeat) return state

	const gameKey = state.menuKey
	const gamePrefs = state.prefs[gameKey] ?? {}
	const result: ConfigProps = {
		gameKey,
		gamePrefs,
	}

	return result
}

export function useAppInternalState() {
	const [state, setState] = useState(getInitialState)
	const { history, gameKey, gamePrefs, prefs } = state
	const config = useMemo(() => getConfig({ gameKey, gamePrefs }), [gameKey, gamePrefs])
	const rules = useMemo(() => toRules(config), [config])
	const layoutMode = prefs[gameKey]?.layoutMode ?? config.layoutMode
	const isComplete = history.length > 0 && isGameComplete(tail(history))
	const appState: AppState = {
		...state,
		config,
		rules,
		layoutMode,
		isComplete,
	}

	useEffect(() => {
		setPersistedState({ history, gameKey, gamePrefs, prefs })
	}, [history, gameKey, gamePrefs, prefs])

	const actions = useForever<AppActions>({
		launchGame(isRepeat) {
			setState(prev => {
				return {
					...prev,
					gameKey,
					gamePrefs,
					isMenuOpen: false,
					history: [toInitialState(getConfig(getPrefs(prev, isRepeat)))],
				}
			})
		},
		setSelection(selection) {
			setState(prev => ({ ...prev, selection, }))
		},
		moveCards(to) {
			setState(prev => {
				if (!prev.selection) return prev

				const NEVERMIND: typeof prev = { ...prev, selection: null }

				if (to && isSelfTargeting(prev.selection, to)) return NEVERMIND

				const GAME_STATE = tail(prev.history)
				const { isValidMove, guessMove, finalizeState, advanceState } = getRules(prev)
				const selectedCardIds = toSelectedCardIds(GAME_STATE, prev.selection)

				if (selectedCardIds.length === 0) return NEVERMIND

				let nextGameState: GameState | null = null

				if (!to && prev.selection.zone === 'foundation') {
					nextGameState = advanceState(GAME_STATE)
				}
				
				if (nextGameState === null) {
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
		undoAll() {
			setState(prev => ({
				...prev,
				history: prev.history.slice(0, 1),
				selection: null,
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
		fastForward() {
			setState(prev => {
				if (prev.selection) return prev

				const GAME_STATE = tail(prev.history)
				const { advanceState } = getRules(prev)
				const nextState = advanceState(GAME_STATE)

				if (!nextState) return prev

				return {
					...prev,
					history: prev.history.concat(nextState),
				}
			})
		},
		toggleExport() {
			setState(prev => ({ ...prev, isExporting: !prev.isExporting }))
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
		setMenuKey(menuKey) {
			setState(prev => ({ ...prev, menuKey, }))
		},
		setGamePref(gameKey, prefKey, prefValue) {
			setState(prev => {
				const { [gameKey]: prefsForKey = {}, ...otherPrefs } = prev.prefs

				prefsForKey[prefKey] = prefValue

				const standardConfig = getConfig({ gameKey, gamePrefs: {} })
				const prefKeys = Object.keys(prefsForKey) as Array<keyof GameDef>
				const isStandard = prefKeys.every(k => prefsForKey[k] === standardConfig[k])

				return {
					...prev,
					prefs: isStandard ? otherPrefs : { ...otherPrefs, [gameKey]: prefsForKey, }
				}
			})
		},
	})

	return [appState, actions] as const
}
