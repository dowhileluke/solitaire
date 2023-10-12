import { ComponentPropsWithoutRef } from 'react'
import { concat } from '../functions/concat'
import classes from './pile-group.module.css'

type PileGroupProps = ComponentPropsWithoutRef<'section'> & {
	noPad?: boolean;
}

export function PileGroup({ className, noPad, ...props }: PileGroupProps) {
	return (
		<section
			{...props}
			className={concat('overflow-hidden', classes.group, noPad && classes.nopad, className)}
		/>
	)
}
