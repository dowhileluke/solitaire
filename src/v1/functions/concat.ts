import { Falsy, truthy } from '@dowhileluke/fns'

export function concat(...args: Array<string | Falsy>) {
	return truthy(args).join(' ')
}
