import { ComponentPropsWithoutRef } from 'react'
import { concat } from '../functions'
import classes from './button.module.css'

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
	isHollow?: boolean;
	isRed?: boolean;
	isBlack?: boolean;
	isBig?: boolean;
}

export function Button({ isHollow, isRed, isBlack, isBig, className, ...props }: ButtonProps) {
	return (
		<button
			type="button"
			className={concat(
				classes.button,
				isHollow && classes.hollow,
				isRed && classes.red,
				isBlack && classes.black,
				isBig && classes.big,
				props.disabled && 'fade',
				className
			)}
			{...props}
		/>
	)
}
