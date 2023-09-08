import { useState } from 'react'

export function useResultForever<T>(initFn: () => T) {
	const [result] = useState(initFn)

	return result
}

export function useForever<T>(value: T) {
	return useResultForever(() => value)
}
