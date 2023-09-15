import { ComponentPropsWithoutRef, ReactNode } from 'react'
import classes from './pills.module.css'
import { concat } from '../functions';
import { Button } from './button';

export type LabeledValue<T extends string | number | boolean> = {
	label: ReactNode;
	value: T;
}

type PillsProps<T extends string | number | boolean> = Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> & {
	value: T;
	onChange: (value: T) => void;
	options: T[] | Array<LabeledValue<T>>;
	disabled?: boolean;
}

export function Pills<T extends string | number | boolean>({
	value, onChange, options, disabled = false, className, ...rest
}: PillsProps<T>) {
	return (
		<div className={concat(classes.pillbox, className)} {...rest} role="radiogroup">
			{options.map(opt => {
				const [optValue, optLabel] = typeof opt === 'object' ? [opt.value, opt.label] as const : [opt, opt.toString()] as const
				const isSelected = value === optValue

				return (
					<Button
						key={optValue.toString()}
						className={concat(classes.pill, isSelected && classes.selected)}
						onClick={() => !disabled && onChange(optValue as T)}
						role="radio"
						aria-checked={isSelected}
						disabled={disabled}
					>
						{optLabel}
					</Button>
				)
			})}
		</div>
	)
}
