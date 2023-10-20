import { ComponentPropsWithoutRef, forwardRef } from 'react'
import { concat } from '../functions/concat'
import classes from './interactive.module.css'

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
	isHollow?: boolean;
	isRed?: boolean;
	isBlack?: boolean;
	isBig?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((
	{ className, ...props }, fwdRef
) => {
	return (
		<button
			ref={fwdRef}
			className={concat(classes.button, className)}
			{...props}
		/>
	)
})
