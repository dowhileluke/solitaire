import { categorize, split } from '@dowhileluke/fns';
import { toDetailedCards } from '../functions/to-detailed-cards';
import { CascadeState, Location } from '../types';
import { Card, DndCard } from './card';
import classes from './tableau.module.css'

type TableauProps = {
	state: CascadeState[];
	selection: Location | null;
}

export function Tableau({ state, selection }: TableauProps) {
	return (
		<div className={classes.tableau}>
			{state.map((cascade, x) => {
				const isSource = selection?.zone === 'tableau' && selection.x === x
				const cards = toDetailedCards(cascade)
				const [simpleCards, specialCards] = isSource
					? split(cards, selection.y)
					: categorize(cards, c => !c.isAvailable)

				return (
					<div key={x} className={classes.cascade}>
						{simpleCards.length + specialCards.length === 0 && (
							isSource ? (
								<Card details={null} />
							) : (
								<DndCard
									details={null}
									location={{ zone: 'tableau', x, y: 0 }}
									mode="drop"
								/>
							)
						)}
						{simpleCards.map((card, i) => (
							<Card key={i} details={card} />
						))}
						{!isSource && specialCards.map((card, i) => (
							<DndCard
								key={i + 9999}
								details={card}
								location={{ zone: 'tableau', x, y: i + simpleCards.length }}
								mode={selection ? 'drop' : 'drag'}
							/>
						))}
					</div>
				)
			})}
		</div>
	)
}
