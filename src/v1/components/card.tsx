import { SyntheticEvent } from 'react'
import { RANKS, SUITS } from '../data'
import { concat } from '../functions/concat'
import { DetailedCard } from '../../types'
import classes from './card.module.css'

type Interactive = {
	isHighlighted?: boolean;
	onHover?: () => void;
	onClick?: () => void;
	onBlur?: () => void;
}

export type CardProps = DetailedCard & Interactive & {
	isFirstUp?: boolean;
	isFull?: boolean;
	mini?: boolean;
}

type TargetProps = Interactive & {
	isEmpty?: boolean;
}

function constrain(callback?: () => void) {
	if (!callback) return

	return function handler(e: SyntheticEvent) {
		e.stopPropagation()

		callback()
	}
}

export function Card({
	rank, suit, mini, onClick, onHover, onBlur, isAvailable, isConnected, isDown, isFirstUp, isFull, isHighlighted,
}: CardProps) {
	if (isDown) {
		return (
			<div
				className={concat(classes.card, classes.full, classes.down)}
				onMouseEnter={constrain(onHover)}
			/>
		)
	}

	return (
		<div
			className={concat(
				classes.card,
				isAvailable && classes.available,
				isConnected && classes.connected,
				isFirstUp && classes.first,
				isFull && classes.full,
				isHighlighted && classes.highlighted,
				mini && classes.mini,
				suit % 3 && 'red',
			)}
			onClick={constrain(onClick)}
			onMouseEnter={constrain(onHover)}
			onMouseLeave={constrain(onBlur)}
		>
			{RANKS[rank]}
			{SUITS[suit]}
			<div className={classes.suit}>
				{SUITS[suit]}
			</div>
		</div>
	)
}


export function CardTarget({ isEmpty, isHighlighted, onClick, onHover, onBlur, }: TargetProps) {
	return (
		<div
			className={concat(
				classes.card,
				classes.full,
				classes.target,
				isEmpty && classes.empty,
				isHighlighted && classes.highlighted,
			)}
			onClick={constrain(onClick)}
			onMouseEnter={constrain(onHover)}
			onMouseLeave={constrain(onBlur)}
		/>
	)
}
