import { CSSProperties, ComponentPropsWithoutRef, forwardRef, useContext } from 'react'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { CrownSimple, FlowerLotus } from '@phosphor-icons/react'
import { concat } from '../functions/concat'
import { toId } from '../functions/to-id'
import { CascadeCard, Location } from '../types'
import classes from './card.module.css'
import { useCardContext } from '../hooks/use-card-context'

type CardProps = ComponentPropsWithoutRef<'div'> & {
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
		[9, 11].includes(card.rank) && classes.squeeze,
	)
}

function toStyle(card: CascadeCard | null, style?: CSSProperties) {
	if (!card || card.isDown || card.rank < 10) return style

	const result: CSSProperties = {
		...style,
		// backgroundImage: `url(/faces/kc.png)`,
		backgroundImage: `url(faces/${card.name}.png)`,
	}

	return result
}

function toContents(card: CascadeCard | null, isFaces: boolean) {
	if (!card) return null
	if (card.isDown) return <FlowerLotus size="100%" weight="thin" />
	// if (card.isDown) return '\u269C'
	// if (card.isDown) return '\u0FCF'

	if (isFaces && card.rank > 9) return card.label

	return (
		<>
			{card.label}
			<div className={concat(classes.suit, 'center')}>
				{card.rank > 9 ? (<CrownSimple size="0.7em" weight="fill" />) : card.suit}
			</div>
		</>
	)
}

export const Card = forwardRef<HTMLDivElement, CardProps>((
	{ details, className, style, children, ...props },
	fwdRef,
) => {
	const isFaces = useCardContext()

	return (
		<div
			ref={fwdRef}
			className={concat(classes.card, toConditionalClasses(details), 'overflow-hidden', className)}
			style={isFaces ? toStyle(details, style) : style}
			{...props}
		>
			{toContents(details, isFaces) ?? children}
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
