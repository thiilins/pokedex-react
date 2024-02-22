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
import {
  PokemonTypesVariant,
  IPokemonDetailPageDataProps
} from '@/types/pokemon'
import getPokemonCardDetails from './utils/getPokemonCardDetails'
import { api } from '@/services/api'
interface IProps {
  pokemonId: string
  pokemonModalData: IPokemonDetailPageDataProps | null
  setPokemonModalData: (pokemon: IPokemonDetailPageDataProps) => void
  open: boolean
  setOpen: (status: boolean) => void
}
const PokemonCard: React.FC<IProps> = ({
  pokemonId,
  open,
  pokemonModalData,
  setOpen,
  setPokemonModalData
}) => {
  const [data, setData] = useState<IPokemonDetailPageDataProps>(
    {} as IPokemonDetailPageDataProps
  )

  const type = data?.types
    ? (data?.types[0]?.name as PokemonTypesVariant)
    : 'fire'
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const loadPokemon = async () => {
      const response = await api.get(`/pokemon/${pokemonId}`)
      const pokemon = await getPokemonCardDetails(response.data)
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
        <div className="card__bg main" />
      </div>

      <CardFooter
        onClick={() => {
          setPokemonModalData(data)
          return setOpen(true)
        }}>
        <span>
          Saiba mais <CgPokemon stroke="#fff" />
        </span>
      </CardFooter>
    </CardContainer>
  )
}

export default PokemonCard
