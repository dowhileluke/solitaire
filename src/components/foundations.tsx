import { Mode } from '../rules'
import { GameState, Location } from '../types'
import { Card, DndCard } from './card'
import { concat, toCascadeCard } from '../functions'
import classes from './foundations.module.css'
import { X } from '@phosphor-icons/react'

type FoundationsProps = {
	state: GameState;
	selection?: Location | null;
	mode: Mode;
}

// const DOWN_CARD: CascadeCard = { ...CARD_DATA[0], isDown: true, isConnected: false, isAvailable: true }

const EMPTY_ICON = 'A'

export function Foundations({ state, selection, mode }: FoundationsProps) {
	if (!state.foundations) return null

	const isZoneSelected = selection?.zone === 'foundation'

	return (
		<div className={concat(classes.foundations, 'overflow-hidden')}>
			{state.foundations.map((cardIds, x) => {
				const [topId, nextId] = [null, null, ...cardIds.slice(-2)].reverse()

				if (mode === 'spiderette') {
					return (
						<Card key={x} details={toCascadeCard(topId, false, false, false)}><X /></Card>
					)
				}

				if (isZoneSelected && selection.x === x) {
					return (
						<Card key={x} details={toCascadeCard(nextId, false, false, false)}>
							{EMPTY_ICON}
						</Card>
					)
				}

				const topCard = toCascadeCard(topId, false, false, true)
				const location: Location = { zone: 'foundation', x, y: cardIds.length }
				const topMode = !selection && topCard ? 'drag' : 'drop'

				return (
					<DndCard key={x} details={topCard} location={location} mode={topMode}>
						{EMPTY_ICON}
					</DndCard>
				)
			})}
		</div>
	)
}
