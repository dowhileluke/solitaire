import { ComponentPropsWithoutRef, forwardRef } from 'react'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { concat } from '../functions/concat'
import { toId } from '../functions/to-id'
import { PileCard, Position } from '../types'
import classes from './card.module.css'

type CardProps = ComponentPropsWithoutRef<'li'> & {
	details: PileCard | null;
	isDown?: boolean;
	isPlaceholder?: boolean;
}

export const Card = forwardRef<HTMLLIElement, CardProps>((
	{ details, isDown = false, isPlaceholder = false, children, className, ...props },
	fwdRef,
) => {
	const detailsClasses = details ? concat(
		classes.up,
		classes[`suit-${details.initials.charAt(1)}`],
		details.isConnected && classes.connected,
	) : 'flex-center'

	return (
		<li
			ref={fwdRef}
			className={concat(
				className,
				classes.card,
				isDown && classes.down,
				isPlaceholder && classes.placeholder,
				detailsClasses,
			)}
			{...props}
		>
			{!isDown && details && details.label}
			{isPlaceholder && children}
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
