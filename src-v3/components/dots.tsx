import { Circle } from '@phosphor-icons/react'
import { generateArray } from '@dowhileluke/fns'
import classes from './dots.module.css'

type DotsProps = {
	value: number;
	max: number;
}

export function Dots({ value, max }: DotsProps) {
	return (
		<div className={classes.dots}>
			{generateArray(max, n => (
				<Circle key={n} size="5px" weight={n >= value ? 'fill' : 'bold'} />
			))}
		</div>
	)
}
