import { ComponentPropsWithoutRef } from 'react'
import { concat } from '../functions/concat'
import classes from './pile-group.module.css'

const groupClass = `overflow-hidden justify-center ${classes.group}`

type PileGroupProps = ComponentPropsWithoutRef<'section'> & {
	vertical?: boolean;
	spaced?: boolean;
}

export function PileGroup({ vertical, spaced, className, ...props }: PileGroupProps) {
	return (
		<section {...props} className={concat(
			groupClass,
			vertical && classes.vert,
			className,
		)} />
	)
}
