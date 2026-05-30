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

const SITE_URL = 'https://td-pokedex-react.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Pokédex | Todos os 1025 Pokémon',
    template: '%s | Pokédex'
  },
  description:
    'Explore todos os 1025 Pokémon com estatísticas de combate, tipos, fraquezas, evoluções e golpes. Pokédex interativa e completa de todas as gerações.',
  authors: [{ name: 'Thiago Lins' }],
  alternates: {
    canonical: '/'
  },
  openGraph: {
    type: 'website',
    siteName: 'Pokédex',
    locale: 'pt_BR',
    url: SITE_URL,
    title: 'Pokédex | Todos os 1025 Pokémon',
    description:
      'Explore todos os 1025 Pokémon com estatísticas, tipos, fraquezas, evoluções e golpes.'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokédex | Todos os 1025 Pokémon',
    description:
      'Explore todos os 1025 Pokémon com estatísticas, tipos, fraquezas, evoluções e golpes.'
  },
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Pokédex',
    url: SITE_URL,
    description:
      'Explore todos os 1025 Pokémon com estatísticas, tipos, fraquezas, evoluções e golpes.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }

  return (
    <html lang="pt-BR" className={`${outfit.variable} ${robotoMono.variable}`}>
      <body className="antialiased min-h-screen selection:bg-secondary selection:text-slate-900 bg-background">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Suspense fallback={null}>
          <Providers initialPokemonsPromise={initialPokemonsPromise}>
            {children}
          </Providers>
        </Suspense>
      </body>
    </html>
  )
}
