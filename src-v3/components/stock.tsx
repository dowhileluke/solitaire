import { generateArray, tail } from '@dowhileluke/fns'
import { useAppState } from '../hooks/use-app-state'
import { Card } from './card'
import { PileGroup } from './pile-group'
import classes from './stock.module.css'
import { Recycle, X } from '@phosphor-icons/react'

export function Stock() {
	const [{ history, config }, actions] = useAppState()

	// no stock from the start
	if (history[0].stock.length === 0) return null
	
	const { stock, tableau, pass } = tail(history)
	const size = config.wasteRate ? 1 : Math.ceil(stock.length / tableau.length)
	const canRepeat = config.wasteRate && (!config.dealLimit || pass < config.dealLimit)

	return (
		<PileGroup onClick={actions.deal}>
			<ul className={classes.stock}>
				{stock.length === 0 ? (
					<Card isPlaceholder details={null}>
						{canRepeat ? <Recycle /> : <X />}
					</Card>
				) : (generateArray(size, i => (
					<Card key={i} isDown details={null} />
				)))}
			</ul>
		</PileGroup>
	)
}
