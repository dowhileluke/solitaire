import { PropsWithChildren, forwardRef } from 'react'
import classes from './scroll-area.module.css'

const areaClass = `full-height overflow-hidden ${classes.area}`

export const ScrollArea = forwardRef<HTMLDivElement, PropsWithChildren>(({ children }, fwdRef) => {
	return (
		<div className={areaClass}>
			<div ref={fwdRef}>
				{children}
			</div>
		</div>
	)
})
