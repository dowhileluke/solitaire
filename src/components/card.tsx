import { ComponentPropsWithoutRef, forwardRef } from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { concat } from '../functions/concat';
import { toId } from '../functions/to-id';
import { DetailedCard, Location } from '../types';
import classes from './card.module.css'

type CardProps = {
	details: DetailedCard | null;
}

export const Card = forwardRef<HTMLDivElement, CardProps & ComponentPropsWithoutRef<'div'>>((
	{ details, className, ...props },
	fwdRef,
) => {
	const conditionalClasses = details?.isDown ? classes.down : concat(details === null && classes.empty)

	return (
		<div
			ref={fwdRef}
			className={concat(classes.card, conditionalClasses, className)}
			{...props}
		>
			{details?.value}
		</div>
	)
})

type DndCardProps = CardProps & {
	mode: 'drag' | 'drop';
	location: Location;
}

export function DndCard({ mode, location, ...rest }: DndCardProps) {
	const id = toId(location)
	const { attributes, listeners, setNodeRef: setDragRef } = useDraggable({ id, data: location })
	const { setNodeRef: setDropRef } = useDroppable({ id, data: location })

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
