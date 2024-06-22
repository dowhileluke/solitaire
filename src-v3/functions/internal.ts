import { toFullDef, GAME_CATALOG } from '../games2'
import { BaseAppState } from '../types'
import { toRules } from './to-rules'

type ConfigProps = Pick<BaseAppState, 'gameKey' | 'gamePrefs'>

export function getConfig({ gameKey, gamePrefs }: ConfigProps) {
	// ignore layoutMode
	const { layoutMode, ...rest } = gamePrefs

	return toFullDef({ ...GAME_CATALOG[gameKey], ...rest, }, gameKey)
}

export function getRules(props: ConfigProps) {
	return toRules(getConfig(props))
}

export function getPrefs(state: BaseAppState, isRepeat: boolean) {
	if (isRepeat) {
		const { gameKey, gamePrefs } = state
		const result: ConfigProps = {
			gameKey,
			gamePrefs,
		}

		return result
	}

	const gameKey = state.menuKey
	const prefsForGame = state.prefs[gameKey] ?? {}
	const result: ConfigProps = {
		gameKey,
		gamePrefs: { ...prefsForGame },
	}

	return result
}
