import { Stack } from '@phosphor-icons/react'
import { generateArray, split, tail } from '@dowhileluke/fns'
import { CARD_DATA } from '../data'
import { concat } from '../functions/concat'
import { useAppState } from '../hooks/use-app-state'
import { CardId } from '../types'
import { Card } from './card'
import { PileGroup } from './pile-group'
import { Pile } from './pile'
import classes from './foundations.module.css'
import pileClasses from './pile.module.css'
import responsive from './responsive.module.css'

const fauxPileClass = `fade ${pileClasses.pile}`

function mockCardIds(id: CardId | null) {
	if (id === null) return []

	const card = CARD_DATA[id]

	if (card.rank === 0) return [id]

	return [id - 1, id]
}

type FoundationsProps = {
	groupIndex: number
}

const NULL_ARRAY = generateArray<CardId | null>(8, () => null)

export function Foundations({ groupIndex }: FoundationsProps) {
	const [{ history, config }] = useAppState()
	const foundationCount = 4 * config.decks
	const { foundations } = tail(history)
	const { foundationGroups = 1, goal } = config
	const portionSize = (foundationCount / foundationGroups)
	const portionIndex = portionSize * groupIndex
	const splitPortions = split(foundations.concat(NULL_ARRAY).slice(0, foundationCount), portionSize)
	const portion = splitPortions[groupIndex]
	const isBuilding = goal.startsWith('foundation')

	return (
		<PileGroup className={concat(classes.found, foundationGroups === 1 && responsive.grid)}>
			{portion.map((id, i) => isBuilding || id !== null ? (
				<Pile
					key={i}
					toPos={(_, card) => ({ zone: 'foundation', x: portionIndex + i, y: card?.rank ?? null })}
					emptyNode="A"
					cardIds={mockCardIds(id)}
					maxDepth={1}
					isDropOnly={!config.allowRecant}
				/>
			) : (
				<ul key={i} className={fauxPileClass}>
					<Card isPlaceholder details={null}>
						<Stack size="1em" />
					</Card>
				</ul>
			))}
		</PileGroup>
	)
}
