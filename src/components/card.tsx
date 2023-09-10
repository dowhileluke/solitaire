import { ComponentPropsWithoutRef, forwardRef } from 'react'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { concat } from '../functions/concat'
import { toId } from '../functions/to-id'
import { CascadeCard, Location } from '../types'
import { Lotus } from './lotus'
import classes from './card.module.css'

type CardProps = {
	details: CascadeCard | null
}

function toConditionalClasses(card: CascadeCard | null) {
	if (!card) return concat(classes.empty, 'center')

	const maybeAvailable = card.isAvailable && classes.available

	if (card.isDown) return concat(classes.down, maybeAvailable, 'center')

	return concat(
		maybeAvailable,
		card.isConnected && classes.connected,
		card.isRed && classes.red,
	)
}

function toContents(card: CascadeCard | null) {
	if (!card) return null
	if (card.isDown) return <Lotus />
	// if (card.isDown) return '\u269C'

	return (
		<>
			{card.label}
			<div className={classes.suit}>
				{card.suit}
			</div>
		</>
	)
}

export const Card = forwardRef<HTMLDivElement, CardProps & ComponentPropsWithoutRef<'div'>>((
	{ details, className, children, ...props },
	fwdRef,
) => {
	return (
		<div
			ref={fwdRef}
			className={concat(classes.card, toConditionalClasses(details), 'overflow-hidden', className)}
			{...props}
		>
			{toContents(details) ?? children}
		</div>
	)
})

type DndCardProps = CardProps & {
	mode: 'drag' | 'drop'
	location: Location
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