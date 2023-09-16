import { categorize, split } from '@dowhileluke/fns'
import { concat, toCascade } from '../functions'
import { RULES } from '../rules'
import { GameConfig, Location, Mode, Pile } from '../types'
import { Card, DndCard } from './card'
import classes from './tableau.module.css'

type TableauProps = {
	state: Pile[];
	config: GameConfig;
	selection: Location | null;
	mode: Mode;
	isDone?: boolean;
}

export function Tableau({ state, config, selection, mode, isDone }: TableauProps) {
	const cascades = state.map(p => toCascade(p, RULES[mode].isConnected, config))

	return (
		<div className={concat(classes.tableau, 'overflow-hidden', !isDone && 'full-height')}>
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
