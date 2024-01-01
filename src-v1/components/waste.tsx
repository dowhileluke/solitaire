import { tail } from '@dowhileluke/fns'
import { CARD_DATA } from '../data'
import { CascadeCard, Location, Pile } from '../types'
import { Card, DndCard } from './card'
import classes from './waste.module.css'

type WasteProps = {
	state: Pile;
	selection: Location | null;
}

export function Waste({ state, selection }: WasteProps) {
	const isSelected = selection?.zone === 'waste'
	const up = state.cardIds.length - state.down
	const visibleCount = isSelected ? Math.max(2, up) : up
	const visibleCards = state.cardIds.slice(-visibleCount).map((id, i): CascadeCard => ({
		...CARD_DATA[id],
		isDown: false,
		isConnected: false,
		isAvailable: i + 1 === visibleCount,
	}))
	const simpleCards = visibleCards.slice(0, -1)
	const topCard = tail(visibleCards)

	return (
		<div className={classes.waste}>
			{simpleCards.map((card, i) => (<Card key={i} details={card} />))}
			{topCard && !isSelected && (
				<DndCard details={topCard} mode="drag" location={{ zone: 'waste', y: state.cardIds.length }} />
			)}
		</div>
	)
}
