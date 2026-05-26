'use client'

import React from 'react'
import { PokedexProvider } from '@/contexts/PokedexContext'
import type { IPokemonListItem } from '@/contexts/PokedexContext'

interface IProvidersProps {
  children: React.ReactNode
  initialPokemonsPromise: Promise<IPokemonListItem[]>
}

export const Providers: React.FC<IProvidersProps> = ({
  children,
  initialPokemonsPromise
}) => {
  return (
    <PokedexProvider initialPokemonsPromise={initialPokemonsPromise}>
      {children}
    </PokedexProvider>
  )
}
