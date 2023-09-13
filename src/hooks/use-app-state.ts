import { useState } from 'react'
import { tail } from '@dowhileluke/fns'
import { RULES } from '../rules'
import { AppActions, AppState } from '../types'
import { useForever } from './use-forever'

const initState: AppState = {
	history: [],
	selection: null,
	mode: 'spiderette',
	config: { suitCount: 4, hasExtraSpace: true, dealFlag: 3 },
	isMenuOpen: false,
}

export function useAppState() {
	const [state, setState] = useState(initState)

	const actions = useForever<AppActions>({
		launchGame(mode, config) {
			const initLayout = RULES[mode].init(config)

			setState({
				history: [initLayout],
				selection: null,
				mode,
				config,
				isMenuOpen: false,
			})
		},
		setSelection(selection) {
			setState(prev => ({ ...prev, selection }))
		},
		moveCards(to) {
			setState(prev => {
				if (!prev.selection) return prev

				const NEVERMIND: AppState = { ...prev, selection: null, }
				const prevLayout = tail(prev.history)
				const { move, autoMove } = RULES[prev.mode]
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
				...prev,
				history: prev.history.slice(0, 1),
				selection: null,
				isMenuOpen: false,
			}))
		},
		playAnother() {
			setState(prev => ({
				...prev,
				history: [RULES[prev.mode].init(prev.config)],
				selection: null,
				isMenuOpen: false,
			}))
		},
		setIsMenuOpen(isMenuOpen) {
			setState(prev => ({ ...prev, isMenuOpen }))
		},
	})

	return [state, actions] as const
}
