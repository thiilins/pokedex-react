export type PokemonListProps = {
  name: string
  url: string
}

export type PokemonsListResponse = {
  count: number
  next: string
  previous: string
  results: PokemonListProps[]
}

export interface IPokemonDetailsProps {
  name: strings
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
export type PokemonTypesVariant =
  | 'bug'
  | 'dark'
  | 'dragon'
  | 'electric'
  | 'fairy'
  | 'fighting'
  | 'flying'
  | 'ghost'
  | 'grass'
  | 'ground'
  | 'ice'
  | 'normal'
  | 'poison'
  | 'rock'
  | 'psychic'
  | 'fire'
export interface IPokemonResumeProps {
  name: strings
  japan_name: any
  id: number
  types: {
    slot: number
    name: string
    id: number
    url: string
  }[]
  species: {
    name: string
    url: string
    id: string
  }
  weight: number
  height: number
  image: string | null
}
