import { getCachedPokemonDetail } from '@/services/pokemonService'
import { notFound } from 'next/navigation'
import PokemonPageClient from './PokemonPageClient'

const TOTAL_POKEMON = 1025

interface IPageProps {
  params: Promise<{ id: string }>
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
