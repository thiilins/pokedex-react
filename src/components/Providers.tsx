'use client'

import React from 'react'
import { PokedexProvider } from '@/contexts/PokedexContext'

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <PokedexProvider>
      {children}
    </PokedexProvider>
  )
}
