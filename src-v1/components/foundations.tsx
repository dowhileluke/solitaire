import { X } from '@phosphor-icons/react'
import { tail } from '@dowhileluke/fns'
import { concat, toCascadeCard } from '../functions'
import { GameState, Location, Mode } from '../types'
import { Card, DndCard } from './card'
import classes from './foundations.module.css'

type FoundationsProps = {
	state: GameState;
	selection?: Location | null;
	mode: Mode;
}

// const DOWN_CARD: CascadeCard = { ...CARD_DATA[0], isDown: true, isConnected: false, isAvailable: true }

const EMPTY_ICON = 'A'

export function FoundationsV1({ state, selection, mode }: FoundationsProps) {
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

export function Foundations({ state, mode }: FoundationsProps) {
	if (!state.foundations) return null

	return (
		<div className={concat(classes.foundations, 'overflow-hidden')}>
			{state.foundations.map((cardIds, x) => {
				const topCard = toCascadeCard(tail(cardIds) ?? null, false, false, false)

				if (mode === 'spiderette') {
					return (
						<Card key={x} details={topCard} />
					)
				}

				const location: Location = { zone: 'foundation', x, y: cardIds.length }

				return (
					<DndCard key={x} details={topCard} location={location} mode="drop">
						{EMPTY_ICON}
					</DndCard>
				)
			})}
		</div>
	)
}
