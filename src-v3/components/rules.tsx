import { useAppState } from '../hooks/use-app-state'
import { concat } from '../functions/concat'
import { GAME_CATALOG, GameDef, toFullDef } from '../games2'
import { ScrollArea } from './scroll-area'
import classes from './rules.module.css'
import { isOpenGame } from '../functions/is-open-game'
import { isFullyDealtGame } from '../functions/is-fully-dealt-game'

const BUILD_TEXT: Record<GameDef['buildRestriction'], string> = {
	'none': '',
	'alt-color': 'alternating colors',
	'suit': 'matching suits',
}

function getRedealText(dealLimit: number) {
	const redealCount = dealLimit - 1

	if (redealCount === 0) return 'there is no redeal.'

	const redealPrefix = 'the waste pile is flipped and becomes the next stock'

	if (redealCount < 0) return redealPrefix + '.'
	if (redealCount === 1) return redealPrefix + ' for one redeal.'

	return redealPrefix + ` for ${redealCount} redeals.`
}

export function Rules() {
	const [{ menuKey }] = useAppState()
	const config = toFullDef(GAME_CATALOG[menuKey], menuKey)
	const isFoundationGame = config.goal.startsWith('foundation')
	const isFullyDealt = isFullyDealtGame(config)
	// const isClosedGame = !isOpenGame(config)
	const isBidirectional = config.buildDirection === 'either'
	const isRelaxedSuit = config.moveRestriction === 'relaxed-suit'

	const directionText = concat(isBidirectional && 'ascending or ', 'descending')
	const buildText = BUILD_TEXT[config.buildRestriction]

	return (
		<ScrollArea className={classes.rules}>
			<h3>Goal &mdash; {config.name}</h3>
			<p>
				{isFoundationGame
					? 'Move all cards to the foundations.'
					: `Form suited K→A sequences${
						config.goal === 'sequence-in'
							? ' within the tableau.'
							: ', removing each as they are built.'
					}`
				}
				{config.solveRate > 0 && ` ${config.solveRate}% of deals can be solved.`}
			</p>
			<h3>Movement</h3>
			<p>
				{config.moveRestriction === 'none' ? 'Any visible' : 'An exposed'} card
				can be moved by placing it on a tableau pile to form a sequence
				in {directionText} order{buildText ? ` with ${buildText}.` : ' regardless of suit.'}
			</p>
			<p>
				{isRelaxedSuit ? 'Mono-suited sequences' : 'Sequences'} may
				also be moved in this manner{
					config.moveRestriction === 'strict'
						? ' if each card could be moved individually.'
						: '.'
				}
			</p>
			{config.cells > 0 && (
				<p>Single cards may be placed in a free cell.</p>
			)}
			<p>
				{config.emptyRestriction === 'kings' ? 'King-lead sequences' : 'Any sequence'} may
				fill an empty space.
			</p>
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
		</ScrollArea>
	)
}
