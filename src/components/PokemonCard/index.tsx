import { IPokemonResumeProps, PokemonTypesVariant } from '@/types/pokemons'
import React from 'react'
// import { PokemonLoader } from '../PokemonPictureCard/styles'
import PokemonTypeIcon from '../PokemonTypeIcon'
import WeightIcon from '@assets/weight.svg'
import HeightIcon from '@assets/height.svg'
import { Container, PokemonPicture, PokemonData, PokemonTypes } from './styles'
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
        <PokemonPicture>
          <img src={image ?? ''} alt={name} />
        </PokemonPicture>
        <PokemonData type={type}>
          <h2 className="name">{name}</h2>
          <div className="details">
            <div>
              <span>Peso</span>
              <span>
                <WeightIcon />
                {weight / 10} kg
              </span>
            </div>
            <span className="divider" />
            <div>
              <span>Altura</span>
              <span>
                <HeightIcon />
                {height / 10} m
              </span>
            </div>
          </div>
        </PokemonData>

        <PokemonTypes type={type}>
          <span className="id">#{('0000' + id).slice(-4)}</span>
          <div className="types__container">
            {types.map(type => (
              <PokemonTypeIcon key={type.id} type={type.name} />
            ))}
          </div>
        </PokemonTypes>
      </Container>
    </Link>
  )
}

export default PokemonCard
