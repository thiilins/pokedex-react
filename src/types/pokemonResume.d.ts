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
