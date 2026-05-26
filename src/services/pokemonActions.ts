'use server'

/**
 * Server Actions finas — transporte RPC para os Client Components.
 *
 * O cliente NÃO pode importar pokemonService.ts diretamente: aquelas funções
 * têm 'use cache' e só rodam no servidor. Estas actions cruzam a fronteira
 * cliente→servidor e apenas delegam para as funções cacheadas — o resultado
 * vem do cache do servidor (não rebate a PokeAPI).
 *
 * Usadas apenas em interações (filtro por tipo, abrir golpe, comparar).
 * O boot da lista e a página de detalhe buscam via Server Component (HTML pronto).
 */

import {
  getCachedMoveDetail,
  getCachedPokemonDetail,
  getCachedPokemonsByType
} from '@/services/pokemonService'

export async function fetchPokemonDetailAction(id: number) {
  return getCachedPokemonDetail(id)
}

export async function fetchMoveDetailAction(name: string, url: string) {
  return getCachedMoveDetail(name, url)
}

export async function fetchPokemonsByTypeAction(selectedType: string) {
  return getCachedPokemonsByType(selectedType)
}
