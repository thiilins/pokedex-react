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
