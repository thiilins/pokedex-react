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
