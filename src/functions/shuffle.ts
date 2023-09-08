function randomInt(max: number) {
	return Math.floor(Math.random() * (max + 1))
}

export function shuffle<T>(array: T[]) {
	const result = array.slice()

	for (let i = result.length - 1; i > 0; i--) {
		const swapIndex = randomInt(i)

		if (i !== swapIndex) {
			const currValue = result[i]
			const swapValue = result[swapIndex]

			result[swapIndex] = currValue
			result[i] = swapValue
		}
	}

	return result
}
