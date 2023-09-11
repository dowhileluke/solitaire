import { generateArray, tail } from '@dowhileluke/fns'
import { CARD_DATA } from '../data'
import { Mode } from '../rules'
import { CascadeCard, GameState } from '../types'
import { Card } from './card'
import { concat } from '../functions'
import classes from './foundations.module.css'

type FoundationsProps = {
	state: GameState;
	selection?: Location | null;
	mode?: Mode;
}

// const DOWN_CARD: CascadeCard = { ...CARD_DATA[0], isDown: true, isConnected: false, isAvailable: true }

export function Foundations({ state, selection, mode }: FoundationsProps) {
	if (!state.foundations) return null

	return (
		<div className={classes.foundations}>
			{state.foundations.map((cardIds, x) => (
				<Card
					key={x}
					details={{ ...CARD_DATA[tail(cardIds)], isDown: false, isConnected: false, isAvailable: false }}
				/>
			))}
		</div>
	)
}
