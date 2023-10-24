import { ComponentPropsWithoutRef, forwardRef } from 'react'
import { concat } from '../functions/concat'
import classes from './interactive.module.css'
import responsive from './responsive.module.css'

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
	accented?: boolean;
	thin?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((
	{ className, accented, thin, ...props }, fwdRef
) => {
	return (
		<button
			ref={fwdRef}
			className={concat(
				'flex-center',
				classes.button,
				accented && classes.accent,
				thin && responsive.thin,
				className,
			)}
			{...props}
		/>
	)
})
