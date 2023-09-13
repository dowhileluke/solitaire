import { categorize, split } from '@dowhileluke/fns';
import { GameConfig, Location, Pile } from '../types';
import { Card, DndCard } from './card';
import classes from './tableau.module.css'
import { Mode, RULES } from '../rules';
import { concat, toCascade } from '../functions';

type TableauProps = {
	state: Pile[];
	config: GameConfig;
	selection: Location | null;
	mode: Mode;
	isHidden?: boolean;
}

export function Tableau({ state, config, selection, mode, isHidden }: TableauProps) {
	if (isHidden) {
		return (
			<div className={concat(classes.tableau, 'hidden overflow-hidden')}>
				{state.map((_, i) => (<div key={i} className="cascade" />))}
			</div>
		)
	}

	const cascades = state.map(p => toCascade(p, RULES[mode].isConnected, config))

	return (
		<div className={concat(classes.tableau, 'full-height overflow-hidden')}>
			{cascades.map(({ cards }, x) => {
				const isSource = selection?.zone === 'tableau' && selection.x === x
				const [simpleCards, specialCards] = isSource
					? split(cards, selection.y)
					: categorize(cards, c => !c.isAvailable)

				return (
					<div key={x} className="cascade">
						{simpleCards.length === 0 && (specialCards.length === 0 || isSource) && (
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
