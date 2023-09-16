import { Mode } from '../types'
import { Button } from './button';

type RulesProps = {
	mode: Mode;
	onDone?: (() => void) | null;
}

export function Rules({ mode, onDone }: RulesProps) {
	const isSpider = mode === 'spiderette'
	const isKlondike = mode === 'klondike'
	const isFreeCell = mode === 'freecell'

	return (
		<>
			<p>
				Build cards in descending order (K→A) {isSpider ? (<b>of any suit</b>) : 'and alternating colors'}.
				Sequences can be moved together
				{isSpider && (<b> if they share a suit</b>)}
				{isFreeCell && (<b> if they could be moved individually using open spaces</b>)}
				. {isKlondike && (<b>Empty spaces may only be filled by Kings.</b>)}
				{isFreeCell && 'Free cells can each hold one card.'}
			</p>
			<p>
				{isSpider ? (
					<>
						Full sequences of a single suit are removed from the tableau.
						The game is complete when all cards have been removed this way.
					</>
				) : (
					<>
						Starting with Aces, build cards with matching suits in ascending order on the foundations.
						The game is complete when all foundations are built A→K.
					</>
				)}
			</p>
			{isSpider && (<p>When there are no empty spaces, one additional card can be dealt to each column.</p>)}
			{onDone && (
				<div className="controls">
					<Button isRed onClick={onDone}>
						Done
					</Button>
				</div>
			)}
		</>
	)
}
