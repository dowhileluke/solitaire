import { ComponentPropsWithoutRef } from 'react'
import { concat } from '../functions/concat'
import classes from './pile-group.module.css'

const groupClass = `overflow-hidden justify-center ${classes.group}`

export function PileGroup({ className, ...props }: ComponentPropsWithoutRef<'section'>) {
	return (
		<section {...props} className={concat(groupClass, className)} />
	)
}
