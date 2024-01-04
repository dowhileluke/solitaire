import { MouseEventHandler, ReactNode } from 'react'
import { generateArray, split, tail } from '@dowhileluke/fns'
import { CARD_DATA } from '../data'
import { concat } from '../functions/concat'
import { useAppState } from '../hooks/use-app-state'
import { Pile as PileDef, PileCard, Position, Rules, CardId } from '../types'
import { Card, DndCard } from './card'
import classes from './card-pile.module.css'

type PileProps = {
	toPos: ((index: number, card: PileCard | null) => Position) | null;
	cardIds: CardId[];
	down?: number;
	maxDepth?: number;
	emptyNode?: ReactNode;
	isDragOnly?: boolean;
	isDropOnly?: boolean;
	placeholderClass?: string;
	angle?: 'W' | 'E' | 'S';
	onClick?: MouseEventHandler<HTMLLIElement>;
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

function isPosMatch(cardPos: Position, selection: Position, isMerciActive: boolean) {
	if (cardPos.zone === 'tableau' && selection.zone === 'tableau') {
		if (cardPos.x !== selection.x) return false
		if (cardPos.y === selection.y) return true
		if (cardPos.y > selection.y && !isMerciActive) return true

		return 'partial'
	} else if (cardPos.zone === 'foundation' && selection.zone === 'foundation') {
		return cardPos.x === selection.x
	} else if (cardPos.zone === 'cell' && selection.zone === 'cell') {
		return cardPos.x === selection.x
	} else if (cardPos.zone === 'waste' && selection.zone === 'waste') {
		return cardPos.y === selection.y
	}

	return false
}

export function Pile({
	toPos, cardIds, down = 0, maxDepth, emptyNode, isDragOnly, isDropOnly, placeholderClass, angle = 'S', onClick,
}: PileProps) {
	const [{ rules, selection, isMerciActive, merciX }] = useAppState()
	const details = maxDepth ? toSimpleDetails(cardIds) : toDetails({ cardIds, down }, rules)
	const [hidden, visible] = split(details, maxDepth ? -maxDepth : -999)

	function getPlaceholder() {
		if (!toPos) return null

		const posZero = toPos(0, null)

		if (cardIds.length === 0) {
			if (isDragOnly) return (
				<Card isPlaceholder className={placeholderClass} details={null} onClick={onClick}>
					{emptyNode}
				</Card>
			)

			return (
				<DndCard isPlaceholder className={placeholderClass} details={null} mode="drop" pos={posZero} onClick={onClick}>
					{emptyNode}
				</DndCard>
			)
		}

		if (hidden.length > 0) {
			return (
				<Card isPlaceholder details={tail(hidden)} onClick={onClick} />
			)
		}

		return (
			<Card isPlaceholder className={placeholderClass} details={null} onClick={onClick}>
				{emptyNode}
			</Card>
		)
	}

	const cards = (
		<>
			{getPlaceholder()}
			{visible.map((card, index) => {
				const simpleCard = (
					<Card key={index} isDown={index < down - hidden.length} details={card} onClick={onClick} />
				)

				if (!card || (!card.isAvailable && !isMerciActive) || !toPos) {
					return simpleCard
				}

				const cardPos = toPos(index + hidden.length, card)

				if (merciX !== null && cardPos.zone === 'tableau' && cardPos.x === merciX && index === visible.length - 1) {
					return (
						<DndCard key={index} details={null} mode="drop" pos={cardPos} className={classes.ghost} />
					)
				}

				if (!selection) {
					if (isDropOnly || (isMerciActive && cardPos.zone !== 'tableau')) return simpleCard

					return (
						<DndCard key={index} details={card} mode="drag" pos={cardPos} />
					)
				}

				const posMatch = isPosMatch(cardPos, selection, isMerciActive)

				if (posMatch === true) {
					if (!isMerciActive) return null

					// needs to be plain card in order to allow quick tapping card
					return (
						<Card key={index} details={null} className={classes.ghost} />
					)
				} else if (posMatch === 'partial' || index < visible.length - 1 || isDragOnly) {
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
		<ul className={concat(
			classes.pile, 
			angle !== 'S' && classes.horizontal,
			angle === 'W' && classes.west,
		)}>
			{cards}
		</ul>
	)
}
