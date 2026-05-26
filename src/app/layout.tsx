import React from 'react'
import type { Metadata, Viewport } from 'next'
import { Outfit, Roboto_Mono } from 'next/font/google'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto',
  weight: ['400', '500', '700'],
})

export const metadata: Metadata = {
  title: 'Pokédex Premium | O Guia Pokémon Definitivo',
  description: 'Uma PokéDex moderna, rápida e responsiva construída com Next.js, Tailwind CSS e TypeScript. Explore atributos, estatísticas, fraquezas e movimentos com um design gamer premium de alta fidelidade.',
  keywords: 'pokedex, pokemon, nextjs, react, tailwindcss, typescript, pokeapi, gamer dashboard, anime',
  authors: [{ name: 'Thiago Lins' }],
  icons: {
    icon: '/favicon.svg',
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} ${robotoMono.variable}`}>
      <body className="antialiased min-h-screen selection:bg-secondary selection:text-slate-900 bg-background">
        {children}
      </body>
    </html>
  )
}
