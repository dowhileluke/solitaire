import { Recycle, X } from '@phosphor-icons/react'
import { generateArray } from '@dowhileluke/fns'
import { CARD_DATA } from '../data'
import { concat } from '../functions'
import { Mode } from '../rules'
import { FLAG_DEAL_LIMIT, FLAG_DEAL_TRIPLE } from '../rules/klondike'
import { CascadeCard, GameState } from '../types'
import { Card } from './card'
import classes from './stock.module.css'

type StockProps = {
	state: GameState;
	onClick?: () => void;
	mode: Mode;
	modeFlags: number;
}

const DOWN_CARD: CascadeCard = { ...CARD_DATA[0], isDown: true, isConnected: false, isAvailable: true }

export function Stock({ state, onClick, mode, modeFlags }: StockProps) {
	const isSpider = mode === 'spiderette'
	const { stock, tableau, waste } = state

	if (!stock) return null

	function isStockExhausted() {
		if (!stock) return true
		if (stock.length > 0) return false
		if (isSpider) return true

		const hasPassLimit = Boolean(modeFlags & FLAG_DEAL_LIMIT)

		if (!hasPassLimit) return false

		const passCount = state.pass ?? 1
		const passLimit = modeFlags & FLAG_DEAL_TRIPLE ? 3 : 1

		return passCount >= passLimit
	}

	const isExhausted = isStockExhausted()
	const isEmpty = stock.length + (waste?.cardIds.length ?? 0) === 0

	function getContents() {
		if (!stock) return null

		if (stock.length === 0) {
			return (
				<Card details={null}>
					{isExhausted ? (<X />) : (<Recycle />)}
				</Card>
			)
		}

		if (isSpider) {
			return generateArray(Math.ceil(stock.length / tableau.length), i => (
				<Card key={i} details={DOWN_CARD} />
			))
		}

		return (
			<Card details={DOWN_CARD} />
		)
	}

	return (
		<div className={concat(classes.stock, (isExhausted || isEmpty) && 'fade')} onClick={onClick}>
			{getContents()}
		</div>
	)
}
