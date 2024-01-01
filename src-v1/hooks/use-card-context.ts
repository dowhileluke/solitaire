import { createContext, useContext } from 'react'

const Ctx = createContext(false)

export const CardContextProvider = Ctx.Provider

export function useCardContext() {
	return useContext(Ctx)
}
