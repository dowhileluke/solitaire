import { FormEvent, Fragment, ReactNode } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import classes from './modal.module.css'

export type ModalProps = {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	onSubmit?: (e: FormEvent) => void;
	headerNode?: ReactNode;
	children?: ReactNode;
}

export function Modal({ isOpen, onClose, title, onSubmit, headerNode, children }: ModalProps) {
	const fullscreen = `viewport-height ${classes.full} center`

	return (
		<Transition
			as={Fragment}
			show={isOpen}
			appear
		>
			<Dialog onClose={onClose} className={fullscreen}>
				{/* <Transition.Child
					as={Fragment}
					enter={classes.fade}
					enterFrom={classes.start}
					enterTo={classes.finish}
					leave={classes.fade}
					leaveFrom={classes.finish}
					leaveTo={classes.start}
				> */}
					<div className={`${fullscreen} ${classes.blur}`} />
				{/* </Transition.Child> */}

				<Transition.Child
					as={Fragment}
					enter={`${classes.fade} ${classes.scale}`}
					enterFrom={classes.start}
					enterTo={classes.finish}
					leave={`${classes.fade} ${classes.scale}`}
					leaveFrom={classes.finish}
					leaveTo={classes.start}
				>
					<Dialog.Panel as={onSubmit ? 'form' : 'div'} onSubmit={onSubmit} className={`grid-form ${classes.panel}`}>
						<div className={classes.title}>
							<Dialog.Title>
								{title}
							</Dialog.Title>
							{headerNode}
						</div>
						{children}
					</Dialog.Panel>
				</Transition.Child>
			</Dialog>
		</Transition>
	)
}
