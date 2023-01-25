import { IPokemonDetailsProps } from '@/types/pokemons'
import { api } from '@services/api'
import getId from './getId'
const getPokemonResume = async ({
  name,
  id,
  types,
  weight,
  species,
  height,
  sprites
}: IPokemonDetailsProps) => {
  const res = await api.get(
    species.url.replace('https://pokeapi.co/api/v2', '')
  )
  return {
    name: name,
    japan_name: res.data.names[0].name,
    id: id,
    types: types.map(type => ({
      slot: type.slot,
      name: type.type.name,
      id: +getId(type.type.url),
      url: type.type.url
    })),
    species: { id: getId(species.url), ...species },
    weight: weight,
    height: height,
    image:
      sprites?.other?.dream_world?.front_default ??
      sprites?.other['official-artwork']?.front_default ??
      sprites?.other?.home?.front_default ??
      '/assets/img/fallback.png'
  }
}
export default getPokemonResume
