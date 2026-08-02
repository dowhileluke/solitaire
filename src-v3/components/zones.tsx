import { concat } from '../functions/concat'
import { useAppState } from '../hooks/use-app-state'
import { Cells } from './cells'
import { Foundations } from './foundations'
import { Merci } from './merci'
import { Stock } from './stock'
import { Waste } from './waste'
import classes from './zones.module.css'
import responsive from './responsive.module.css'

const zonesClass = `overflow-hidden ${classes.zones}`

function Wasteland() {
	return (
		<div className={classes.wasteland}>
			<Stock />
			<Waste />
		</div>
	)
}

export function Zones() {
	const [{ config, history, layoutMode }] = useAppState()
	const { isTowers, merciCount, cells, decks } = config
	const isHorizontal = layoutMode === 'horizontal'
	const hasWasteland = history[0].stock.length > 0
	const isMassive = decks * 4 + cells > 8

	if (isMassive) {
		return (
			<section className={concat(zonesClass, classes.stack, responsive.zones)}>
				<section className={concat(zonesClass, responsive.zones)}>
					{hasWasteland && (<Wasteland />)}
					<Cells />
					{merciCount > 0 && (<Merci />)}
				</section>
				<Foundations groupIndex={0} />
			</section>
		)
	}

	return (
		<section className={concat(zonesClass, !isTowers && responsive.zones)}>
			{hasWasteland && (<Wasteland />)}
			{isTowers && (<Foundations groupIndex={0} />)}
			<Cells />
			{merciCount > 0 && (<Merci />)}
			{isHorizontal && (<Foundations groupIndex={isTowers ? 1 : 0} />)}
		</section>
	)
}
