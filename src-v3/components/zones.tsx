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
	const [{ isMerciActive }] = useAppState()

	return (
		<div className={concat(classes.wasteland, isMerciActive && 'fade')}>
			<Stock />
			<Waste />
		</div>
	)
}

export function Zones() {
	const [{ config, history, layoutMode }] = useAppState()
	const { isTowers, wasteRate, merciCount } = config
	const isHorizontal = layoutMode === 'horizontal'
	const hasWasteland = wasteRate > 0 || history[0].stock.length > 0

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
