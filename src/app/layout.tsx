import type { Metadata, Viewport } from 'next'
import { Outfit, Roboto_Mono } from 'next/font/google'
import React, { Suspense } from 'react'
import './globals.css'
import { Providers } from '@/components/Providers'
import { getCachedAllPokemons } from '@/services/pokemonService'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700', '800', '900']
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto',
  weight: ['400', '500', '700']
})

export const metadata: Metadata = {
  title: 'Pokédex Premium | O Guia Pokémon Definitivo',
  description:
    'Uma PokéDex moderna, rápida e responsiva construída com Next.js, Tailwind CSS e TypeScript. Explore atributos, estatísticas, fraquezas e movimentos com um design gamer premium de alta fidelidade.',
  keywords:
    'pokedex, pokemon, nextjs, react, tailwindcss, typescript, pokeapi, gamer dashboard, anime',
  authors: [{ name: 'Thiago Lins' }],
  icons: {
    icon: '/favicon.svg'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  // getCachedAllPokemons() é cacheada (use cache, server-side). Passamos a Promise
  // SEM await: o layout não bloqueia o shell e o Provider (client) resolve via
  // React.use(). No prerender o dado cacheado é preenchido (PPR); no boot do
  // cliente não há fetch — a lista já vem resolvida.
  const initialPokemonsPromise = getCachedAllPokemons()

  return (
    <html lang="pt-BR" className={`${outfit.variable} ${robotoMono.variable}`}>
      <body className="antialiased min-h-screen selection:bg-secondary selection:text-slate-900 bg-background">
        <Suspense fallback={null}>
          <Providers initialPokemonsPromise={initialPokemonsPromise}>
            {children}
          </Providers>
        </Suspense>
      </body>
    </html>
  )
}
