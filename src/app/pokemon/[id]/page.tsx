import { getCachedPokemonDetail } from '@/services/pokemonService'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import PokemonPageClient from './PokemonPageClient'

const TOTAL_POKEMON = 1025

interface IPageProps {
  params: Promise<{ id: string }>
}

// Pré-renderiza as 1025 fichas no build (dados imutáveis + use cache = full static).
export async function generateStaticParams() {
  return Array.from({ length: TOTAL_POKEMON }, (_, i) => ({
    id: String(i + 1)
  }))
}

export async function generateMetadata({
  params
}: IPageProps): Promise<Metadata> {
  const { id } = await params
  const currentId = parseInt(id)

  if (Number.isNaN(currentId) || currentId < 1 || currentId > TOTAL_POKEMON) {
    return { title: 'Pokémon não encontrado' }
  }

  try {
    const p = await getCachedPokemonDetail(currentId)
    const num = `#${String(p.id).padStart(4, '0')}`
    const name = p.name.charAt(0).toUpperCase() + p.name.slice(1)
    const types = p.types?.map((t: { name: string }) => t.name).join(', ')
    const desc =
      (p.description as string) ||
      `Veja estatísticas, tipos${types ? ` (${types})` : ''}, evoluções e golpes de ${name} ${num} na Pokédex.`
    const canonical = `/pokemon/${p.id}`

    return {
      title: `${name} ${num}`,
      description: desc.slice(0, 160),
      alternates: { canonical },
      openGraph: {
        type: 'article',
        title: `${name} ${num} | Pokédex`,
        description: desc.slice(0, 200),
        url: canonical,
        images: p.image ? [{ url: p.image, alt: name }] : undefined
      },
      twitter: {
        card: 'summary_large_image',
        title: `${name} ${num} | Pokédex`,
        description: desc.slice(0, 200),
        images: p.image ? [p.image] : undefined
      }
    }
  } catch {
    return { title: `Pokémon ${id}` }
  }
}

export default async function PokemonPage({ params }: IPageProps) {
  'use cache' // Next.js 16 Directives - Cache whole Route/Component output!

  const { id } = await params
  const currentId = parseInt(id)

  // ID fora do intervalo válido → 404 dedicado (não tenta buscar à toa).
  if (Number.isNaN(currentId) || currentId < 1 || currentId > TOTAL_POKEMON) {
    notFound()
  }

  try {
    const data = await getCachedPokemonDetail(currentId)
    return <PokemonPageClient data={data} currentId={currentId} />
  } catch (err) {
    console.error('Error loading Pokemon Page in SSR:', err)
    notFound()
  }
}
