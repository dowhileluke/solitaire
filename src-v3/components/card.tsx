import { ComponentPropsWithoutRef, forwardRef } from 'react'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { CrownSimple, FlowerLotus } from '@phosphor-icons/react'
import { concat } from '../functions/concat'
import { toId } from '../functions/to-id'
import { PileCard, Position } from '../types'
import classes from './card.module.css'

const symbolClass = `flex-center ${classes.symbol}`

export type CardProps = ComponentPropsWithoutRef<'li'> & {
	details: PileCard | null;
	isDown?: boolean;
	isPlaceholder?: boolean;
}

const wideRanks = [9, 11]

export const Card = forwardRef<HTMLLIElement, CardProps>((
	{ details, isDown = false, isPlaceholder = false, children, className, ...props },
	fwdRef,
) => {
	const detailsClasses = details ? concat(
		'overflow-hidden',
		classes.up,
		classes[`suit-${details.initials.charAt(1)}`],
		details.isConnected && classes.connected,
		wideRanks.includes(details.rank) && classes.squeeze,
	) : 'flex-center'

	return (
		<li
			ref={fwdRef}
			className={concat(
				classes.card,
				isDown && classes.down,
				isPlaceholder && classes.placeholder,
				detailsClasses,
				className,
			)}
			{...props}
		>
			{!isDown && details && (
				<>
					{details.label}
					<div className={symbolClass}>
						{details.rank > 9 ? (<CrownSimple size="0.75em" weight="fill" />) : details.suit}
					</div>
				</>
			)}
			{isDown && (<FlowerLotus size="100%" weight="thin" />)}
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
