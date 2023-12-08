import { FormEvent, Fragment, ReactNode } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import classes from './modal.module.css'

export type ModalProps = {
	isOpen: boolean;
	onClose: () => void;
	onSubmit?: (e: FormEvent) => void;
	children?: ReactNode;
}

const fullscreen = `viewport-height ${classes.full}`
const panelClass = `overflow-hidden ${classes.panel}`

export function Modal({ isOpen, onClose, onSubmit, children }: ModalProps) {

	return (
		<Transition
			as={Fragment}
			show={isOpen}
			appear
		>
			<Dialog onClose={onClose} className={`${fullscreen} overflow-hidden flex-center`}>
				<div className={`${fullscreen} ${classes.blur}`} />

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
			</Dialog>
		</Transition>
	)
}
