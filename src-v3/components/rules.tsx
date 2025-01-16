import { useAppState } from '../hooks/use-app-state'
import { concat } from '../functions/concat'
import { isFullyDealtGame } from '../functions/is-fully-dealt-game'
import { GAME_CATALOG, GameDef, toFullDef } from '../games2'
import { ScrollArea } from './scroll-area'
import classes from './rules.module.css'
import { TIP_COMPENDIUM } from '../tips'

const BUILD_TEXT: Record<GameDef['buildRestriction'], string> = {
	'none': '',
	'alt-color': 'alternating colors',
	'same-color': 'matching colors',
	'suit': 'matching suits',
	'rank': '',
}

function getGoalText(config: Required<GameDef>) {
	if (config.goal === 'sorted') return 'Move all cards of matching ranks to the same pile.'
	if (config.goal.startsWith('foundation')) return 'Move all cards to the foundations, building A→K by suit.'

	const seqType = config.goal === 'sequence-in' ? ' within the tableau.' : ', removing each as they are completed.'

	return `Form suited K→A sequences${seqType}`
}

function getMoveText(config: Required<GameDef>) {
	const cardType = config.moveRestriction === 'none' ? 'Any visible' : 'An exposed'
	const prefix = `${cardType} card can be moved to a tableau pile if it `
	const suffix = config.heightRestriction < 999 ? `, and the pile size does not exceed ${config.heightRestriction} cards.` : '.'

	if (config.goal === 'sorted') {
		return prefix + 'matches in rank' + suffix
	}

	const isBidirectional = config.buildDirection === 'either'
	const directionText = concat(isBidirectional && 'ascending or ', 'descending')
	const buildText = BUILD_TEXT[config.buildRestriction]
	
	return prefix + `forms a sequence in ${directionText} order` +
		(buildText ? ` with ${buildText}` : ' regardless of suit') + suffix
}

function getRedealText(dealLimit: number) {
	const redealCount = dealLimit - 1

	if (redealCount === 0) return 'there is no redeal.'

	const redealPrefix = 'the waste pile is flipped over and becomes the next stock'

	if (redealCount < 0) return redealPrefix + '.'
	if (redealCount === 1) return redealPrefix + ' for one redeal.'

	return redealPrefix + ` for ${redealCount} redeals.`
}

function getFinalCellsText(finalCells: number) {
	if (!finalCells) return null

	const plural = finalCells > 1 ? 'cells' : 'cell'

	return `Then ${finalCells} free ${plural} becomes available.`
}

export function Rules() {
	const [{ menuKey }] = useAppState()
	const config = toFullDef(GAME_CATALOG[menuKey], menuKey)
	const isFullyDealt = isFullyDealtGame(config)
	const isRelaxedSuit = config.moveRestriction === 'relaxed-suit'
	const hasFinalCells = config.dealLimit > 0 && config.finalCells > 0
	const tips = TIP_COMPENDIUM[menuKey]

	return (
		<ScrollArea className={classes.rules}>
			<h3>Goal</h3>
			<p>
				{getGoalText(config)}
				{config.solveRate > 0 && ` ${config.solveRate}% of deals can be solved.`}
			</p>
			<h3>Movement</h3>
			<p>
				{getMoveText(config)}
			</p>
			{config.moveRestriction !== 'none' && (
				<p>
					{isRelaxedSuit ? 'Mono-suited sequences' : 'Sequences'} may
					also be moved in this manner{
						config.moveRestriction === 'strict'
							? ' if each card could be moved individually.'
							: '.'
					}
				</p>
			)}
			{(config.cells > 0 || hasFinalCells) && (
				<p>Single cards may be placed in a free cell.</p>
			)}
			<p>
				{config.emptyRestriction === 'kings' ? 'King-lead sequences' : 'Any sequence'} may
				fill an empty space.
			</p>
			{config.merciCount > 0 && (
				<p>
					A merci move is permitted {config.merciCount === 1 ? 'once' : `${config.merciCount}x`} per game;
					swap an exposed tableau card with any other card in the tableau.
				</p>
			)}
			{!isFullyDealt && (
				<>
					<h3>Dealing</h3>
					{config.wasteRate > 0 ? (
						<>
							<p>
								At any time, {config.wasteRate === 1 ? 'one card' : `${config.wasteRate} cards`} may 
								be dealt from the stock to the waste pile.</p>
							<p>
								When the stock is exhausted, {getRedealText(config.dealLimit)}
								{' '}
								{hasFinalCells && getFinalCellsText(config.finalCells)}
							</p>
						</>
					) : (
						<p>
							{config.wasteRate < 0
								? 'While no empty spaces exist, and until'
								: 'Until'
							} the stock is exhausted, one card can be dealt from the stock to every tableau pile.
						</p>
					)}
				</>
			)}
			{tips && (
				<>
					<h3>Tips</h3>
					{tips.map(t => (<p key={t}>{t}</p>))}
				</>
			)}
		</ScrollArea>
	)
}
