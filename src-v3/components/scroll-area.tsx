import { PropsWithChildren, forwardRef } from 'react'
import classes from './scroll-area.module.css'

const areaClass = `full-height overflow-hidden ${classes.area}`

type Classy = {
	className?: string;
}

export const ScrollArea = forwardRef<HTMLDivElement, PropsWithChildren<Classy>>(
	({ children, className }, fwdRef) => {
		return (
			<div className={areaClass}>
				<div ref={fwdRef} className={className}>
					{children}
				</div>
			</div>
		)
	}
)
