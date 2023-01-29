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
