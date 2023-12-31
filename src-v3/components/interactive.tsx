import { ChangeEvent, ComponentPropsWithoutRef, ReactNode, forwardRef } from 'react'
import { concat } from '../functions/concat'
import classes from './interactive.module.css'
import responsive from './responsive.module.css'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import { Fusion } from './fusion'

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
	accented?: boolean;
	thin?: boolean;
	big?: boolean;
	mini?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((
	{ className, accented, big, thin, mini, ...props }, fwdRef
) => {
	return (
		<button
			ref={fwdRef}
			className={concat(
				'flex-center',
				classes.plain,
				classes.button,
				accented && classes.accent,
				big && classes.big,
				thin && responsive.thin,
				mini && classes.mini,
				className,
			)}
			{...props}
		/>
	)
})

export type LabeledValue<T> = {
	label: ReactNode;
	value: T;
}

type PickerProps<T extends string | number | boolean> = {
	value: T;
	onChange: (value: T) => void;
	options: T[] | Array<LabeledValue<T>>;
	isModified?: boolean;
}

const pickerClass = `flex-center ${classes.picker}`
const selectClass = `${classes.plain} ${classes.select}`

type BooleanSelectProps = {
	options: ReactNode[];
	onClick: () => void;
	first: boolean;
}

function BooleanSelect({ options, onClick, first }: BooleanSelectProps) {
	return (
		<Fusion onClick={onClick} className={selectClass}>
			<div className={concat(!first && classes.hidden)}>{options[0]}</div>
			<div className={concat(first && classes.hidden)}>{options[1]}</div>
		</Fusion>
	)
}

export function Picker<T extends string | number | boolean>({
	options, value, onChange, isModified,
}: PickerProps<T>) {
	function handleChange(e: ChangeEvent<HTMLSelectElement>) {
		const strValue = e.target.value
		const strMatch = options.find(opt => typeof opt === 'object'
			? opt.value.toString() === strValue
			: opt.toString() === strValue
		)

		if (typeof strMatch === 'undefined') return
		
		onChange(typeof strMatch === 'object' ? strMatch.value : strMatch)
	}

	function getValueAtIndex(index: number) {
		const safeIndex = (index + options.length) % options.length
		const optAtIndex = options[safeIndex]

		return typeof optAtIndex === 'object' ? optAtIndex.value : optAtIndex
	}

	function getValueAtRelativeIndex(delta: number) {
		const currentIndex = options.findIndex(
			opt => typeof opt === 'object' ? opt.value === value : opt === value
		)

		return getValueAtIndex(currentIndex + delta)
	}

	function increment() {
		onChange(getValueAtRelativeIndex(1))
	}

	const isBoolean = options.length === 2
	const dropdown = isBoolean ? (
		<BooleanSelect
			options={options.map(opt => typeof opt === 'object' ? opt.label : opt.toString())}
			onClick={increment}
			first={value === getValueAtIndex(0)}
		/>
	) : (
		<select
			className={selectClass}
			value={value.toString()}
			onChange={handleChange}
		>
			{options.map(opt => {
				const [label, rawValue] = typeof opt === 'object' ? [opt.label, opt.value] : [opt.toString(), opt]
				const val = rawValue.toString()

				return (<option key={val} value={val}>{label}</option>)
			})}
		</select>
	)

	return (
		<div className={concat(pickerClass, isModified && classes.modified)}>
			<Button mini onClick={() => onChange(getValueAtRelativeIndex(-1))}><CaretLeft /></Button>
			{dropdown}
			<Button mini onClick={increment}><CaretRight /></Button>
		</div>
	)
}

type LabeledPickerProps<T extends string | number | boolean> = PickerProps<T> & {
	label: ReactNode;
}

const labeledClass = `flex-center ${classes.labeled}`

export function LabeledPicker<T extends string | number | boolean>({ label, ...rest }: LabeledPickerProps<T>) {
	return (
		<div className={labeledClass}>
			<div>{label}</div>
			<Picker {...rest} />
		</div>
	)
}
