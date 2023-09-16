import { Mode } from '../types'
import { Button } from './button';

type RulesProps = {
	mode: Mode;
	onDone?: (() => void) | null;
}

const ROYAL_PRIVILEGE = 'Empty spaces may only be filled by Kings.'

export function Rules({ mode, onDone }: RulesProps) {
	const isSpider = mode === 'spiderette'
	const isKlondike = mode === 'klondike'
	const isFreeCell = mode === 'freecell'
	const isYukon = mode === 'yukon'

	const configNote = (<div className="note">*configurable</div>)
	const foundationNote = (
		<p>
			Starting with Aces, build cards with matching suits in ascending order on the foundations.
			The game is complete when all foundations are built A→K.
			{(isFreeCell || isYukon) && configNote}
		</p>
	)

	const doneButton = onDone && (
		<div className="controls">
			<Button isRed onClick={onDone}>
				Done
			</Button>
		</div>
	)

	if (mode === 'yukon') {
		return (
			<>
				<p>
					<b>Any visible card can move as a stack to another column</b>, 
					but only if it follows in rank and alternates in color* with the target's final card. {ROYAL_PRIVILEGE}
				</p>
				{foundationNote}
				{doneButton}
			</>
		)
	}

	return (
		<>
			<p>
				Build cards in descending order (K→A) {isSpider ? (<b>of any suit</b>) : 'and alternating colors'}{isFreeCell ? '*' : ''}.
				Sequences can be moved together
				{isSpider && (<b> if they share a suit</b>)}
				{isFreeCell && (<b> if they could be moved individually using open spaces</b>)}
				. {isKlondike && (<b>{ROYAL_PRIVILEGE}</b>)}
				{isFreeCell && 'Free cells can each hold one card.'}
			</p>
			{isSpider ? (
				<p>
					Full sequences of a single suit are removed from the tableau.
					The game is complete when all cards have been removed this way.
				</p>
			) : (
				foundationNote
			)}
			{isSpider && (<p>When there are no empty spaces, one additional card can be dealt to each column.</p>)}
			{doneButton}
		</>
	)
}
