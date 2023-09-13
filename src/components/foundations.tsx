import { generateArray, tail } from '@dowhileluke/fns'
import { CARD_DATA } from '../data'
import { Mode } from '../rules'
import { CascadeCard, GameState, Location } from '../types'
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

export function Foundations({ state, selection, mode }: FoundationsProps) {
	if (!state.foundations) return null

	const isZoneSelected = selection?.zone === 'foundation'

	return (
		<div className={classes.foundations}>
			{state.foundations.map((cardIds, x) => {
				const [topId, nextId] = [null, null, ...cardIds.slice(-2)].reverse()

				if (mode === 'spiderette') {
					return (
						<Card details={toCascadeCard(topId, false, false, false)}><X /></Card>
					)
				}

				if (isZoneSelected && selection.x === x) {
					return (
						<Card details={toCascadeCard(nextId, false, false, false)} />
					)
				}

				const topCard = toCascadeCard(topId, false, false, true)
				const location: Location = { zone: 'foundation', x }
				const topMode = !selection && topCard ? 'drag' : 'drop'

				return (
					<DndCard details={topCard} location={location} mode={topMode} />
				)
			})}
		</div>
	)
}
