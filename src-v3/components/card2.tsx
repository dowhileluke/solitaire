import { ComponentPropsWithoutRef, forwardRef } from 'react'
import { PileCard } from '../types'
import { concat } from '../functions/concat';
import classes from './card-pile.module.css'

type CardProps = ComponentPropsWithoutRef<'li'> & {
	details?: PileCard | null;
}

const squeezeRanks = [9, 11]

export const Card = forwardRef<HTMLLIElement, CardProps>(({
	details,
}, fwdRef) => {
	const detailsClasses = details ? concat(
		'overflow-hidden',
		classes.up,
		classes[`suit-${details.initials.charAt(1)}`],
		details.isConnected && classes.connected,
		squeezeRanks.includes(details.rank) && classes.squeeze,
	) : 'flex-center'
	const cardClasses = concat(
		classes.card,
		detailsClasses,
	)

	const label = details && (
		<div>
			<abbr>{details.name}</abbr>
			<abbr>{details.suit}</abbr>
		</div>
	)

	return (
		<li ref={fwdRef} className={cardClasses}>
			{label}
			{label}
		</li>
	)
})
