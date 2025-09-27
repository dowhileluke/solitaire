import { FormEvent, Fragment, ReactNode } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import classes from './modal.module.css'
import { concat } from '../functions/concat';

export type ModalProps = {
	isOpen: boolean;
	onClose: () => void;
	onSubmit?: (e: FormEvent) => void;
	children?: ReactNode;
	className?: string;
}

const fullscreen = `viewport-height ${classes.fixed}`
const backdropClass = `${fullscreen} blur`
const gutterClass = `full-height flex-center ${classes.gutter}`
const panelClass = `overflow-hidden ${classes.panel}`

export function Modal({ isOpen, onClose, onSubmit, children, className }: ModalProps) {
	return (
		<Transition
			as={Fragment}
			show={isOpen}
			appear
		>
			<Dialog onClose={onClose} className={fullscreen}>
				<div className={concat(backdropClass, className)}>
					<div className={gutterClass}>
						<Transition.Child
							as={Fragment}
							enter={`${classes.fade} ${classes.scale}`}
							enterFrom={classes.start}
							enterTo={classes.finish}
							leave={`${classes.fade} ${classes.scale}`}
							leaveFrom={classes.finish}
							leaveTo={classes.start}
						>
							<Dialog.Panel
								as={onSubmit ? 'form' : 'div'}
								onSubmit={onSubmit}
								className={panelClass}
							>
								{children}
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	)
}
