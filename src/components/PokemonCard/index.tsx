import React, { useEffect, useState } from 'react'
// import { PokemonLoader } from '../PokemonPictureCard/styles'
import { CgPokemon } from 'react-icons/cg'
import PokemonTypeIcon from '../PokemonTypeIcon'
import WeightIcon from '@assets/weight.svg'
import HeightIcon from '@assets/height.svg'
import {
  CardContainer,
  CardDetails,
  PokemonImageContainer,
  CardDataContainer,
  CardFooter
} from './styles'
import { Link } from 'react-router-dom'
import { PokemonTypesVariant } from '@/types/PokemonTypesVariant'
import getPokemonCardDetails from './utils/getPokemonCardDetails'
import { api } from '@/services/api'
import { IPokemonCardDetails } from '@/types/pokemonCardDetails'
interface IProps {
  pokemonId: string
}
const PokemonCard: React.FC<IProps> = ({ pokemonId }) => {
  const [data, setData] = useState<IPokemonCardDetails>(
    {} as IPokemonCardDetails
  )
  const type = data?.types
    ? (data?.types[0]?.name as PokemonTypesVariant)
    : 'fire'
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const loadPokemon = async () => {
      const response = await api.get(`/pokemon/${pokemonId}`)
      const pokemon = getPokemonCardDetails(response.data)
      setData(pokemon)
      setLoading(false)
    }
    loading && loadPokemon()
  }, [loading, pokemonId])
  if (loading) return <></>
  return (
    <CardContainer type={type}>
      <CardDataContainer type={type}>
        <PokemonImageContainer type={type} className="pokemon__image">
          <img src={data.image ?? ''} alt={data.name} />
          <div className="card__bg" />
        </PokemonImageContainer>
        <CardDetails>
          <span className="id">#{('0000' + data.id).slice(-4)}</span>
          <h2 className="name">{data.name}</h2>
          <div className="types__container">
            {data.types.map(type => (
              <PokemonTypeIcon key={type.id} type={type.name} haveName />
            ))}
          </div>
        </CardDetails>
      </CardDataContainer>
      <div className="main__bg">
        <div className="card__bg" />
      </div>

      <Link to={`/pokemon/${data.name}`}>
        <CardFooter>
          <span>
            Saiba mais <CgPokemon stroke="#fff" />
          </span>
        </CardFooter>
      </Link>
    </CardContainer>
  )
}

export default PokemonCard
