import { generateArray } from '@dowhileluke/fns';
import { CARD_DATA } from '../data';
import { Mode } from '../rules';
import { CascadeCard, GameState } from '../types'
import { Card } from './card';
import classes from './stock.module.css'
import { X } from 'react-feather';

type StockProps = {
	state: GameState;
	onClick?: () => void;
	mode: Mode;
}

const DOWN_CARD: CascadeCard = { ...CARD_DATA[0], isDown: true, isConnected: false, isAvailable: true }

export function Stock({ state, onClick, mode }: StockProps) {
	const { stock, tableau } = state

	function getContents() {
		if (!stock) return null

		if (stock?.length === 0) {
			return (
				<Card details={null}>
					<X />
				</Card>
			)
		}

		if (mode === 'spiderette') {
			return generateArray(Math.ceil(stock.length / tableau.length), i => (
				<Card key={i} details={DOWN_CARD} />
			))
		}

		return (
			<Card details={DOWN_CARD} />
		)
	}

	const contents = getContents()

	if (!contents) return null

	return (
		<div className={classes.stock} onClick={onClick}>
			{contents}
		</div>
	)
}
