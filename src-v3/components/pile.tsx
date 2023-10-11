import { ReactNode } from 'react'
import { generateArray, split, tail } from '@dowhileluke/fns'
import { useAppState } from '../hooks/use-app-state'
import { Pile as PileDef, PileCard, Position, Rules, CardId } from '../types'
import { Card, DndCard } from './card'
import classes from './pile.module.css'
import { CARD_DATA } from '../data'

type PileProps = {
	toPos: ((index: number, card?: PileCard) => Position) | null;
	cardIds: CardId[];
	down?: number;
	maxDepth?: number;
	emptyNode?: ReactNode;
	isDragOnly?: boolean;
}

function toDetails({ cardIds, down }: PileDef, rules: Rules) {
	const downCards = generateArray<PileCard | null>(down, () => null)

	return downCards.concat(rules.toPileCards(cardIds.slice(down)))
}

function toSimpleDetails(cardIds: CardId[]) {
	return cardIds.map((id, index): PileCard => ({
		...CARD_DATA[id],
		isConnected: false,
		isAvailable: index === cardIds.length - 1,
	}))
}

function isPosMatch(cardPos: Position, selection: Position) {
	if (cardPos.zone === 'tableau' && selection.zone === 'tableau') {
		if (cardPos.x !== selection.x) return false
		if (cardPos.y >= selection.y) return true

		return 'partial'
	} else if (cardPos.zone === 'foundation' && selection.zone === 'foundation') {
		return cardPos.x === selection.x
	}

	return false
}

export function Pile({ toPos, cardIds, down = 0, maxDepth, emptyNode, isDragOnly = false, }: PileProps) {
	const [{ rules, selection }] = useAppState()
	const details = maxDepth ? toSimpleDetails(cardIds) : toDetails({ cardIds, down }, rules)
	const [hidden, visible] = split(details, maxDepth ? -maxDepth : -999)

	function getPlaceholder() {
		if (!toPos) return null

		const posZero = toPos(0)

		if (cardIds.length === 0) {
			if (isDragOnly) return null

			return (
				<DndCard isPlaceholder details={null} mode="drop" pos={posZero}>
					{emptyNode}
				</DndCard>
			)
		}

		if (hidden.length) {
			return (
				<Card isPlaceholder details={tail(hidden)} />
			)
		}

		return (
			<Card isPlaceholder details={null}>
				{emptyNode}
			</Card>
		)
	}

	const cards = (
		<>
			{getPlaceholder()}
			{visible.map((card, index) => {
				const simpleCard = (<Card key={index} isDown={index < down - hidden.length} details={card} />)

				if (!card || !card.isAvailable || !toPos) {
					return simpleCard
				}

				const cardPos = toPos(index, card)

				if (!selection) {
					return (
						<DndCard key={index} details={card} mode="drag" pos={cardPos} />
					)
				}

				const posMatch = isPosMatch(cardPos, selection)

				if (posMatch === true) {
					return null
				} else if (posMatch === 'partial' || index < visible.length - 1) {
					return simpleCard
				} else {
					return (
						<DndCard key={index} details={card} mode="drop" pos={cardPos} />
					)
				}
			})}
		</>
	)

	if (!toPos) {
		return cards
	}

	return (
		<ul className={classes.pile}>
			{cards}
		</ul>
	)
}
