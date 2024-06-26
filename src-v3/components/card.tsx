import { ComponentPropsWithoutRef, forwardRef } from 'react'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { Club, Diamond, FlowerLotus, Heart, Spade } from '@phosphor-icons/react'
import { concat } from '../functions/concat'
import { toId } from '../functions/to-id'
import { PileCard, Position } from '../types'
import classes from './card-pile.module.css'

type CardProps = ComponentPropsWithoutRef<'li'> & {
	details?: PileCard | null;
	isDown?: boolean;
	isPlaceholder?: boolean;
}

const squeezeRanks = [9, 11]

const suitIcons = [Spade, Heart, Diamond, Club].map(Icon => <Icon weight="fill" size="0.7em" />)

const IS_ANDROID = /android/i.test(navigator.userAgent)

export const Card = forwardRef<HTMLLIElement, CardProps>(({
	details, isDown, isPlaceholder, className, children, ...props
}, fwdRef) => {
	const detailsClasses = details ? concat(
		'overflow-hidden',
		classes.up,
		classes[`suit-${details.initials.charAt(1)}`],
		details.isConnected && classes.connected,
		details.isAvailable && classes.clickable,
		squeezeRanks.includes(details.rank) && classes.squeeze,
	) : 'flex-center'
	const cardClasses = concat(
		classes.card,
		detailsClasses,
		isDown && classes.down,
		isPlaceholder && classes.placeholder,
		className,
	)

	const label = details && !isDown && (
		<div>
			<abbr>{details.name}</abbr>
			<abbr>{IS_ANDROID ? suitIcons[details.suitIndex] : details.suit}</abbr>
		</div>
	)

	return (
		<li ref={fwdRef} className={cardClasses} {...props}>
			{label}
			{label}
			{isDown && (<FlowerLotus size="100%" weight="thin" />)}
			{!label && children}
		</li>
	)
})

type DndCardProps = CardProps & {
	mode: 'drag' | 'drop';
	pos: Position;
}

export function DndCard({ mode, pos, ...rest }: DndCardProps) {
	const id = toId(pos)
	const { attributes, listeners, setNodeRef: setDragRef } = useDraggable({ id, data: pos })
	const { setNodeRef: setDropRef } = useDroppable({ id, data: pos })

	if (mode === 'drop') {
		return (
			<Card
				ref={setDropRef}
				{...rest}
			/>
		)
	}

	return (
		<Card
			ref={setDragRef}
			{...rest}
			{...attributes}
			{...listeners}
		/>
	)
}
