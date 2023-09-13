import { ArrowCounterClockwise, X } from '@phosphor-icons/react'
import { generateArray } from '@dowhileluke/fns'
import { CARD_DATA } from '../data'
import { concat } from '../functions'
import { Mode } from '../rules'
import { CascadeCard, GameState } from '../types'
import { Card } from './card'
import classes from './stock.module.css'

type StockProps = {
	state: GameState;
	onClick?: () => void;
	mode: Mode;
	dealFlag: number;
}

const DOWN_CARD: CascadeCard = { ...CARD_DATA[0], isDown: true, isConnected: false, isAvailable: true }

export function Stock({ state, onClick, mode, dealFlag }: StockProps) {
	const isSpiderette = mode === 'spiderette'
	const { stock, tableau, waste } = state

	if (!stock) return null

	function isExhausted() {
		if (!stock) return true
		if (stock.length > 0) return false

		const hasPassLimit = dealFlag > 1

		if (!hasPassLimit) return false

		const passCount = state.pass ?? 1
		const passLimit = dealFlag % 2 ? 3 : 1

		return passCount >= passLimit
	}

	const _isExhausted = isExhausted()
	const isEmpty = stock.length + (waste?.cardIds.length ?? 0) === 0

	function getContents() {
		if (!stock) return null

		if (stock.length === 0) {
			return (
				<Card details={null}>
					{_isExhausted ? (<X />) : (<ArrowCounterClockwise />)}
				</Card>
			)
		}

		if (isSpiderette) {
			return generateArray(Math.ceil(stock.length / tableau.length), i => (
				<Card key={i} details={DOWN_CARD} />
			))
		}

		return (
			<Card details={DOWN_CARD} />
		)
	}

	return (
		<div className={concat(classes.stock, (_isExhausted || isEmpty) && 'fade')} onClick={onClick}>
			{getContents()}
		</div>
	)
}
