import { Stack } from '@phosphor-icons/react'
import { generateArray, split, tail } from '@dowhileluke/fns'
import { CARD_DATA } from '../data'
import { concat } from '../functions/concat'
import { useAppState } from '../hooks/use-app-state'
import { CardId, PileCard } from '../types'
import { Card } from './card'
import { PileGroup } from './pile-group'
import { Pile } from './pile'
import classes from './foundations.module.css'
import pileClasses from './card-pile.module.css'
import responsive from './responsive.module.css'

function mockCardIds(id: CardId | null) {
	if (id === null) return []

	const card = CARD_DATA[id]

	if (card.rank === 0) return [id]

	return [id - 1, id]
}

function toFauxCard(id: CardId | null) {
	if (id === null) return null

	const result: PileCard = {
		...CARD_DATA[id],
		isAvailable: true,
		isConnected: false,
	}

	return result
}


const fauxPileClass = `fade ${pileClasses.pile}`

function toFauxPile(index: number, id: CardId | null) {
	const card = toFauxCard(id)

	return (
		<ul key={index} className={card ? pileClasses.pile : fauxPileClass}>
			<Card isPlaceholder={!card} details={card}>
				<Stack size="1em" />
			</Card>
		</ul>
	)
}

type FoundationsProps = {
	groupIndex: 0 | 1;
	vertical?: boolean;
}

const NULL_ARRAY = generateArray<CardId | null>(8, () => null)

export function Foundations({ groupIndex, vertical }: FoundationsProps) {
	const [{ history, config }, { fastForward }] = useAppState()
	const foundationCount = 4 * config.decks
	const { foundations } = tail(history)
	const { goal, isTowers } = config
	const portionSize = (foundationCount / (isTowers ? 2 : 1))
	const portionIndex = portionSize * groupIndex
	const splitPortions = split(foundations.concat(NULL_ARRAY).slice(0, foundationCount), portionSize)
	const portion = splitPortions[groupIndex]
	const isBuilding = goal.startsWith('foundation')

	return (
		<PileGroup vertical={vertical} spaced={vertical} className={concat(
			classes.found,
			!isTowers && !vertical && responsive.grid,
		)}>
			{portion.map((id, i) => isBuilding ? (
				<Pile
					key={i}
					toPos={(_, card) => ({ zone: 'foundation', x: portionIndex + i, y: card?.rank ?? null })}
					emptyNode="A"
					cardIds={mockCardIds(id)}
					maxDepth={1}
					isDropOnly={!config.allowRecant}
					angle={vertical ? 'E' : 'S'}
					onClick={() => fastForward(portionIndex + i)}
				/>
			) : (
				toFauxPile(i, id)
			))}
		</PileGroup>
	)
}
