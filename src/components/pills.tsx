import { ComponentPropsWithoutRef, ReactNode } from 'react'
import classes from './pills.module.css'
import { concat } from '../functions';

export type LabeledValue<T extends string | number | boolean> = {
	label: ReactNode;
	value: T;
}

type PillsProps<T extends string | number | boolean> = Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> & {
	value: T;
	onChange: (value: T) => void;
	options: T[] | Array<LabeledValue<T>>;
}

export function Pills<T extends string | number | boolean>({ value, onChange, options, className, ...rest }: PillsProps<T>) {
	return (
		<div className={concat(classes.pillbox, className)} {...rest}>
			{options.map(opt => {
				const [optValue, optLabel] = typeof opt === 'object' ? [opt.value, opt.label] as const : [opt, opt.toString()] as const

				return (
					<div
						className={concat(classes.pill, value === optValue && classes.selected)}
						onClick={() => onChange(optValue as T)}
					>
						{optLabel}
					</div>
				)
			})}
		</div>
	)
}
