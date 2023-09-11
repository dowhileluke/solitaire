import { ComponentPropsWithoutRef } from 'react'
import { concat } from '../functions'
import classes from './button.module.css'

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
	isRed?: boolean;
}

export function Button({ isRed, className, ...props }: ButtonProps) {
	return (
		<button
			type="button"
			className={concat(classes.button, isRed && classes.red, className)}
			{...props}
		/>
	)
}
