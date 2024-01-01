import { split } from '@dowhileluke/fns'

export function rotateArray<T>(array: T[], n: number) {
	const [a, b] = split(array, -n)

	return b.concat(a)
}
