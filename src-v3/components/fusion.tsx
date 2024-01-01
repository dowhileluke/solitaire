import { ComponentPropsWithoutRef } from 'react'
import { concat } from '../functions/concat'
import classes from './fusion.module.css'

export function Fusion({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
	return (
		<div className={concat(classes.fusion, className)} {...props} />
	)
}
