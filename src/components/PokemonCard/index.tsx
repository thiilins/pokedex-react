import { IPokemonResumeProps, PokemonTypesVariant } from '@/types/pokemons'
import React from 'react'
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

const PokemonCard: React.FC<IPokemonResumeProps> = ({
  height,
  id,
  image,
  japan_name,
  name,
  species,
  types,
  weight
}) => {
  const type = types[0].name as PokemonTypesVariant

  return (
    <CardContainer type={type}>
      <CardDataContainer type={type}>
        <PokemonImageContainer type={type} className="pokemon__image">
          <img src={image ?? ''} alt={name} />
          <div className="card__bg" />
        </PokemonImageContainer>
        <CardDetails>
          <span className="id">#{('0000' + id).slice(-4)}</span>
          <h2 className="name">{name}</h2>
          <div className="types__container">
            {types.map(type => (
              <PokemonTypeIcon key={type.id} type={type.name} haveName />
            ))}
          </div>
        </CardDetails>
      </CardDataContainer>
      <div className="main__bg">
        <div className="card__bg" />
      </div>

      <Link to={`/pokemon/${name}`}>
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
