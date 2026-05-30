/**
 * Tipos compartilhados dos dados já normalizados pelo pokemonService.
 * Espelham o retorno de getCachedPokemonCard / getCachedPokemonDetail.
 */

export interface PokemonTypeSlot {
  slot: number
  name: string
  id: number
  url: string
}

export interface PokemonStat {
  name: string
  base_stat: number
}

/** Payload leve usado nos cards do grid (getCachedPokemonCard). */
export interface PokemonCardData {
  id: number
  name: string
  japan_name: string
  category: string
  is_legendary: boolean
  is_mythical: boolean
  types: PokemonTypeSlot[]
  stats: PokemonStat[]
  image: string
}

/**
 * Detalhe completo usado na ficha e no modal (getCachedPokemonDetail).
 * Mantém os campos consumidos pela UI; o parsing interno do service ainda usa
 * tipos da PokeAPI crus (não modelados aqui).
 */
export interface PokemonDetailData {
  id: number
  name: string
  japan_name: string
  order: number
  species: { name: string; url: string }
  description: string
  category: string
  capture_rate: number
  base_happiness: number
  is_legendary: boolean
  is_mythical: boolean
  weight: number
  height: number
  cries: { latest?: string; legacy?: string } | null
  base_experience: number
  types: PokemonTypeSlot[]
  stats: PokemonStat[]
  abilities: {
    name: string
    is_hidden: boolean
    slot: number
    description: string
  }[]
  moves: { name: string; url: string }[]
  evolution_chain: { name: string; id: string }[]
  varieties: { name: string; id: string; is_default: boolean }[]
  held_items: unknown[]
  forms: unknown[]
  retro_sprites: { gameName: string; spriteUrl: string }[]
  sprites_gallery: Record<string, string>
  image: string
}

/** Item da lista-índice dos 1025 (getCachedAllPokemons). */
export interface PokemonListItem {
  name: string
  url: string
  id: string
}
