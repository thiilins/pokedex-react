export type PokemonsListResponse = {
  count: number
  next: string
  previous: string
  results: PokemonListProps[]
}
export interface IPokemonApiReturnProps {
  name: string
  id: number
  order: number
  forms: {
    name: string
    url: string
  }[]
  moves: {
    move: {
      name: string
      url: string
    }
  }[]
  types: {
    slot: number
    type: {
      name: string
      url: string
    }
  }[]
  weight: number
  height: number
  species: { name: string; url: string }
  stats: {
    base_stat: number
    effort: number
    stat: {
      name: string
      url: string
    }
  }[]
  sprites: {
    other: {
      dream_world: {
        front_default: string | null
      }
      home: {
        front_default: string | null
      }
      'official-artwork': {
        front_default: string | null
      }
    }
  }
}
