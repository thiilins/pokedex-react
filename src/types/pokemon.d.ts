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
export interface IPokemonCardDetails {
  name: string
  id: number
  types: {
    name: string
    url: string
    id: number
  }[]
  image: string
}
export interface IPokemonDetailPageDataProps {
  name: string
  japan_name: string
  id: number
  order: number
  forms: {
    name: string
    url: string
  }[]
  moves: {
    name: string
    id: number
    url: string
  }[]
  types: {
    slot: number
    name: string
    id: number
    url: string
  }[]
  species: {
    id: string
    name: string
    url: string
  }
  weight: number
  height: number
  stats: {
    name: string
    url: string
    id: string
    effort: number
    base_stat: number
  }[]
  image: string | null
}
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
export interface ISpecies {
  id: number
  name: string
  order: number
  genderRate: number
  captureRate: number
  baseHappiness: number
  isBaby: boolean
  isLegendary: boolean
  isMythical: boolean
  hatchCounter: number
  hasGenderDifferences: boolean
  formsSwitchable: boolean
  growthRate: INamedAPIResource
  pokedexNumbers: {
    entryNumber: number
    pokedex: INamedAPIResource
  }[]
  eggGroups: INamedAPIResource[]
  color: INamedAPIResource
  shape: INamedAPIResource
  evolvesFromSpecies: INamedAPIResource
  evolutionChain: IAPIResource
  habitat: INamedAPIResource
  generation: INamedAPIResource
  names: {
    name: string
    language: INamedAPIResource
  }[]
  palParkEncounters: {
    baseScore: number
    rate: number
    area: {
      name: string
      url: string
    }
  }[]
  flavorTextEntries: {
    flavorText: string
    language: INamedAPIResource
    version: INamedAPIResource
  }[]
  formDescriptions: {
    description: string
    language: INamedAPIResource
  }[]
  genera: {
    genus: string
    language: INamedAPIResource
  }[]
  varieties: {
    isDefault: boolean
    pokemon: INamedAPIResource
  }[]
}
