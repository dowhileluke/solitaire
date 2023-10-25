import { concat } from '../functions/concat'
import { useAppState } from '../hooks/use-app-state'
import { Cells } from './cells'
import { Foundations } from './foundations'
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
	const [{ config, history }] = useAppState()
	
	if (history.length === 0) return null
	
	const { foundationGroups = 1, tableauGroups = 1, wasteRate = 0 } = config
	const hasWasteland = wasteRate > 0 || history[0].stock.length > 0

	return (
		<section className={concat(zonesClass, foundationGroups < 2 && responsive.zones)}>
			{hasWasteland && (<Wasteland />)}
			{foundationGroups > 1 && (<Foundations groupIndex={0} />)}
			<Cells />
			{tableauGroups === 1 && (<Foundations groupIndex={foundationGroups - 1} />)}
		</section>
	)
}
