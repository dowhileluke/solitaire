import { AppState } from '../types'

const PERSIST_KEY = 'state'

export function setPersistedState(state: Partial<AppState>) {
	localStorage.setItem(PERSIST_KEY, JSON.stringify(state))
}

export function getPersistedState() {
	const state = localStorage.getItem(PERSIST_KEY)

	return (state ? JSON.parse(state) : {}) as Partial<AppState>
}
