import { IPokemonDetailsProps } from '@/types/pokemons'
import { api } from '@services/api'
import getId from './getId'
const getDetailsModel = async ({
  name,
  id,
  order,
  forms,
  moves,
  types,
  weight,
  height,
  species,
  stats,
  sprites
}: IPokemonDetailsProps) => {
  const res = await api.get(
    species.url.replace('https://pokeapi.co/api/v2', '')
  )
  return {
    name: name,
    japan_name: res.data.names[0].name,
    id: id,
    order: order,
    forms: forms,
    moves: moves.map(move => ({
      name: move.move.name,
      id: +getId(move.move.url),
      url: move.move.url
    })),
    types: types.map(type => ({
      slot: type.slot,
      name: type.type.name,
      id: +getId(type.type.url),
      url: type.type.url
    })),
    species: { id: getId(species.url), ...species },
    weight: weight,
    height: height,
    stats: stats.map(st => ({
      name: st.stat.name,
      url: st.stat.url,
      id: getId(st.stat.url),
      effort: st.effort,
      base_stat: st.base_stat
    })),
    image:
      sprites?.other?.dream_world?.front_default ??
      sprites?.other['official-artwork']?.front_default ??
      sprites?.other?.home?.front_default ??
      '/assets/img/fallback.png'
  }
}
export default getDetailsModel
