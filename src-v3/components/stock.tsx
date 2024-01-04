import { Recycle, X } from '@phosphor-icons/react'
import { tail } from '@dowhileluke/fns'
import { concat } from '../functions/concat'
import { useAppState } from '../hooks/use-app-state'
import { Card } from './card'
import { Dots } from './dots'
import { PileGroup } from './pile-group'
import pileClasses from './card-pile.module.css'

function divideUp(n: number, d: number) {
	return Math.ceil(n / d)
}

export function Stock() {
	const [{ history, config }, actions] = useAppState()

	// no stock from the start
	if (history[0].stock.length === 0) return null

	const { stock, tableau, pass, waste } = tail(history)
	const dealMax = config.wasteRate > 0 ? (config.dealLimit ?? 0) : divideUp(history[0].stock.length, tableau.length)
	const dealCurr = config.wasteRate > 0 ? (stock.length ? pass - 1 : pass) : dealMax - divideUp(stock.length, tableau.length)
	const canRepeat = config.wasteRate > 0 && waste && (!config.dealLimit || pass < config.dealLimit) && (
		stock.length > 0 || waste.down > 0 || waste.cardIds.length > config.wasteRate
	)

	return (
		<PileGroup onClick={actions.deal} className={concat(!canRepeat && stock.length === 0 && 'fade')}>
			<ul className={pileClasses.pile}>
				{stock.length === 0 ? (
					<Card isPlaceholder details={null}>
						{canRepeat ? <Recycle /> : <X />}
					</Card>
				) : (
					<Card isDown details={null} />
				)}
			</ul>
			{dealMax > 1 && (<Dots value={dealCurr} max={dealMax} />)}
		</PileGroup>
	)
}
