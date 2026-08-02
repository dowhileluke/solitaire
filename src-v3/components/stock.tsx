import { Recycle, X } from '@phosphor-icons/react'
import { tail } from '@dowhileluke/fns'
import { concat } from '../functions/concat'
import { useAppState } from '../hooks/use-app-state'
import { Card } from './card'
import { SingleCell } from './cells'
import { Dots } from './dots'
import { PileGroup } from './pile-group'
import pileClasses from './card-pile.module.css'
import { toStockDetails } from '../functions/to-stock-details'

const stockClass = `${pileClasses.pile} ${pileClasses.clickable}`

export function Stock() {
	const [{ history, config }, actions] = useAppState()

	// no stock from the start
	if (history[0].stock.length === 0) return null

	const state = tail(history)
	const { max, curr, canRepeat } = toStockDetails(config, state, history[0].stock.length)
	const finalCells = state.cells.slice(config.cells)
	const isFaded = !canRepeat && state.stock.length === 0 && finalCells.length === 0

	return (
		<PileGroup onClick={actions.deal} className={concat(isFaded && 'fade')}>
			{finalCells.length > 0 ? (
				finalCells.map((cardId, i) => (
					<SingleCell key={i} index={i + config.cells} cardId={cardId} />
				))
			) : (
				<ul className={stockClass}>
					{state.stock.length === 0 ? (
						<Card isPlaceholder details={null}>
							{canRepeat ? <Recycle /> : <X />}
						</Card>
					) : (
						<Card isDown details={null} />
					)}
				</ul>
			)}
			{max > 1 && (<Dots value={curr} max={max} />)}
		</PileGroup>
	)
}
