import { GameDef } from '../games2'
import { GameState } from '../types'

type StockDetails = {
    max: number;
    curr: number;
    canRepeat: boolean;
}

const emptyResult: StockDetails = {
    max: 0,
    curr: 0,
    canRepeat: false,
}

function divideUp(n: number, d: number) {
	return Math.ceil(n / d)
}

export function toStockDetails(
    config: Required<GameDef>,
    { stock, tableau, pass, waste }: GameState,
    initialLength: number,
) {
    // fanning deals
    if (typeof config.wasteRate === 'string') {
        if (config.wasteRate === 'fan-1') return emptyResult

        const max = divideUp(initialLength, tableau.length)
        const curr = max - divideUp(stock.length, tableau.length)
        const result: StockDetails = {
            max, curr, canRepeat: false,
        }

        return result;
    }

    // wastepile deals
    const hasRemainingDeals = !config.dealLimit || (pass < config.dealLimit)
	const canRepeat = (waste !== null) && hasRemainingDeals && (
		stock.length > 0 || waste.down > 0 || waste.cardIds.length > config.wasteRate
	)

    const result: StockDetails = {
        max: config.dealLimit,
        curr: stock.length ? pass - 1 : pass,
        canRepeat,
    }

    return result
}
