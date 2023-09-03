import { generateArray } from '@dowhileluke/fns'
import classes from './app.module.css'
import { concat } from '../functions/concat'
import { RANKS } from '../data'
import { deal } from '../functions/deal'

const COLUMN_COUNT = 8

const [tableau, stock] = deal()
const SUITS = [
	<>&spades;</>,
	<>&hearts;</>,
	<>&clubs;</>,
	<>&diams;</>,
]

tableau.unshift(tableau[0])
console.log(tableau)

export function App() {
	return (
		<div className={classes.tableau}>
			{tableau.map((pile, i) => (
				<div key={i} className={classes.col}>
					{pile.map(({ suit, rank, isKnown }) => (
						<div
							key={rank + 'x' + suit}
							className={concat(classes.card, !isKnown && classes.down, isKnown && suit % 2 && classes.red)}
						>
							{isKnown && RANKS[rank]}{isKnown && SUITS[suit]}
							{isKnown && (
								<div className={classes.suit}>
									{SUITS[suit]}
								</div>
							)}
						</div>
					))}
					<div className={concat(classes.card, classes.placeholder)} />
				</div>
			))}
		</div>
	)
}
