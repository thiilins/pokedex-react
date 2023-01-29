import { IPokemonApiReturnProps } from '@/types/pokemonApiReturn'
export default (data: IPokemonApiReturnProps) => {
  return {
    name: data.name,
    id: data.id,
    types:
      data.types.map((item, index) => ({ ...item.type, id: index + 1 })) ?? [],
    image:
      data.sprites?.other?.dream_world?.front_default ??
      data.sprites?.other['official-artwork']?.front_default ??
      data.sprites?.other?.home?.front_default ??
      '/assets/img/fallback.png'
  }
}
