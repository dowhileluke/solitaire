import { useState } from 'react'

export function useDraftState<S>(source: S) {
	const [original, setOriginal] = useState(source)
	const [draft, setDraft] = useState(source)

	if (source !== original) {
		setOriginal(source)
		setDraft(source)
	}

	return [draft, setDraft] as const
}
