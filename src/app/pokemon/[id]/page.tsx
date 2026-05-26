import { getCachedPokemonDetail } from '@/services/pokemonService'
import PokemonPageClient from './PokemonPageClient'

interface IPageProps {
  params: Promise<{ id: string }>
}

export default async function PokemonPage({ params }: IPageProps) {
  'use cache' // Next.js 16 Directives - Cache whole Route/Component output!

  const { id } = await params
  const currentId = parseInt(id) || 1

  try {
    const data = await getCachedPokemonDetail(currentId)
    return <PokemonPageClient data={data} currentId={currentId} />
  } catch (err) {
    console.error('Error loading Pokemon Page in SSR:', err)
    return <PokemonPageClient data={null} currentId={currentId} />
  }
}
