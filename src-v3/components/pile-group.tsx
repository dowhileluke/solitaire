import { PropsWithChildren } from 'react'
import classes from './pile-group.module.css'

const groupClass = `overflow-hidden ${classes.group}`

export function PileGroup({ children }: PropsWithChildren) {
	return (
		<section className={groupClass}>
			{children}
		</section>
	)
}
