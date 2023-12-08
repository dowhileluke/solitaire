import { BaseAppState } from '../types'

const PERSIST_KEY = 'state-v3'

export function setPersistedState(state: Partial<BaseAppState>) {
	localStorage.setItem(PERSIST_KEY, JSON.stringify(state))
}

export function getPersistedState() {
	const state = localStorage.getItem(PERSIST_KEY)

	return (state ? JSON.parse(state) : {}) as Partial<BaseAppState>
}
