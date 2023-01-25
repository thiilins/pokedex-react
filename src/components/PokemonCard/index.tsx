import { IPokemonResumeProps, PokemonTypesVariant } from '@/types/pokemons'
import React from 'react'
// import { PokemonLoader } from '../PokemonPictureCard/styles'
import PokemonTypeIcon from '../PokemonTypeIcon'
import WeightIcon from '@assets/weight.svg'
import HeightIcon from '@assets/height.svg'
import { Container, PokemonDetails } from './styles'
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
    <Link to={`/pokemon/${name}`}>
      <Container type={type}>
        <PokemonDetails type={type}>
          <span className="id">#{('0000' + id).slice(-4)}</span>
          <h2 className="name">{name}</h2>
          <div className="types__container">
            {types.map(type => (
              <PokemonTypeIcon key={type.id} type={type.name} />
            ))}
          </div>
        </PokemonDetails>
        <img className="card__img" src={image ?? ''} alt={name} />
      </Container>
    </Link>
  )
}

export default PokemonCard
