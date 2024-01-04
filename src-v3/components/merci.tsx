import { Swap } from '@phosphor-icons/react'
import { tail } from '@dowhileluke/fns'
import { useAppState } from '../hooks/use-app-state'
import { Dots } from './dots'
import { Pile } from './pile'
import { PileGroup } from './pile-group'
import classes from './merci.module.css'

export function Merci() {
	const [{ config, history, merciX }] = useAppState()

	if (config.merciCount === 0) return null

	const layout = tail(history)
	const isMerciAvailable = config.merciCount > layout.merciUsed
	const cardIds = merciX === null ? [] : layout.tableau[merciX].cardIds.slice(-1)

	return (
		<PileGroup className={isMerciAvailable ? '' : 'fade'}>
			<Pile
				cardIds={cardIds}
				toPos={y => ({ zone: 'merci', y })}
				isDropOnly
				isDragOnly={!isMerciAvailable}
				emptyNode={<Swap />}
				placeholderClass={classes.merci}
			/>
			{config.merciCount > 1 && (<Dots value={layout.merciUsed} max={config.merciCount} />)}
		</PileGroup>
	)
}
