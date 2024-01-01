import { Card, IsConnectedFn, GameConfig } from '../types'

export function isAllConnected(cards: Card[], isConnected: IsConnectedFn, config: GameConfig) {
	return cards.slice(0, -1).every((x, i) => isConnected(cards[i + 1], x, config))
}
