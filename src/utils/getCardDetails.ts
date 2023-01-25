import { IPokemonApiReturnProps, IPokemonCardDetails } from '@/types/pokemons'
import { api } from '@services/api'
import getId from './getId'
const getDetailsModel = ({
  name,
  id,
  types,
  sprites
}: IPokemonApiReturnProps): IPokemonCardDetails => {
  return {
    name: name,
    id: id,
    types: types.map(type => ({
      slot: type.slot,
      name: type.type.name,
      id: +getId(type.type.url),
      url: type.type.url
    })),
    image:
      sprites?.other?.dream_world?.front_default ??
      sprites?.other['official-artwork']?.front_default ??
      sprites?.other?.home?.front_default ??
      '/assets/img/fallback.png'
  }
}
export default getDetailsModel
