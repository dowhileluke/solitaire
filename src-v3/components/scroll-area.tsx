import { PropsWithChildren } from 'react'
import classes from './scroll-area.module.css'

export function ScrollArea({ children }: PropsWithChildren) {
	return (
		<div className={classes.area}>
			{children}
		</div>
	)
}
