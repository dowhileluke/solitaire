import { generateArray } from '@dowhileluke/fns'
import classes from './app.module.css'
import { concat } from '../functions/concat'
import { RANKS_DESC } from '../data'

const COLUMN_COUNT = 8

export function App() {
	return (
		<div className={classes.tableau}>
			{generateArray(COLUMN_COUNT, c => (
				<div key={c} className={classes.col}>
					{generateArray(13 * 2, n => (
						<div key={n} className={concat(classes.card, c === 2 && n > 40 && classes.selected)}>
							{RANKS_DESC[n % 13]}&clubs;
							{/* <div className={classes.suit}>&clubs;</div> */}
						</div>
					))}
					<div className={concat(classes.card, classes.placeholder)} />
				</div>
			))}
		</div>
	)
}
