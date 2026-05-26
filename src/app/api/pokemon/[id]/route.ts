import { NextRequest, NextResponse } from 'next/server'
import {
  getCachedPokemonCard,
  getCachedPokemonDetail
} from '@/services/pokemonService'

/**
 * Route Handler GET para os dados de um Pokémon.
 *
 * Usado pelos cards do grid (leitura em massa). Como é GET, o navegador dispara
 * várias requisições em paralelo — ao contrário das Server Actions, que o Next
 * enfileira e executa uma a uma (o que deixava o grid carregando "um a um").
 *
 * - GET /api/pokemon/:id          → versão leve (card do grid)
 * - GET /api/pokemon/:id?full=1   → detalhe completo (modal / ficha)
 *
 * O cache server-side fica nas funções `use cache`; o Cache-Control abaixo
 * permite que browser/CDN reaproveitem a resposta sem rebater o servidor.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const pokemonId = parseInt(id)

  if (Number.isNaN(pokemonId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  const full = req.nextUrl.searchParams.get('full')

  try {
    const data = full
      ? await getCachedPokemonDetail(pokemonId)
      : await getCachedPokemonCard(pokemonId)

    return NextResponse.json(data, {
      headers: {
        'Cache-Control':
          'public, max-age=3600, s-maxage=31536000, stale-while-revalidate=86400'
      }
    })
  } catch {
    return NextResponse.json({ error: 'Pokemon not found' }, { status: 404 })
  }
}
