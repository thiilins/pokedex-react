import React from 'react'

import {
  CardContainer,
  IndexContainer,
  PokemonImageContainer,
  PokemonData,
  PokemonDataContainer
} from './styles'

import WeightIcon from '@assets/weight.svg'
import HeightIcon from '@assets/height.svg'
import { IPokemonResumeProps, PokemonTypesVariant } from '@/types/pokemons'
import PokemonTypeIcon from '../PokemonTypeIcon'
interface IPictureCard {
  pokemon: IPokemonResumeProps
  miniCard?: boolean
}
const PictureCard: React.FC<IPictureCard> = ({ pokemon, miniCard }) => {
  const type = pokemon.types[0].name as PokemonTypesVariant
  return (
    <CardContainer pokemonType={type} miniCard={miniCard}>
      <PokemonDataContainer>
        <PokemonData>
          <h2 className="name">{pokemon.name}</h2>
          <div className="details">
            <div>
              <span>Peso</span>
              <span>
                <WeightIcon />
                {pokemon.weight / 10} kg
              </span>
            </div>
            <span className="divider" />
            <div>
              <span>Altura</span>
              <span>
                <HeightIcon />
                {pokemon.height / 10} m
              </span>
            </div>
          </div>

          <div className="types">
            {pokemon.types.map(type => (
              <PokemonTypeIcon key={type.id} type={type.name} />
            ))}
          </div>

          <div className="id">#{('0000' + pokemon.id).slice(-4)}</div>
        </PokemonData>
      </PokemonDataContainer>
      <PokemonImageContainer type={type}>
        <img src={pokemon.image ?? ''} />
        <div className="background__name">{pokemon.japan_name}</div>
        <div className="loader__animation" />
      </PokemonImageContainer>
    </CardContainer>
  )
}

export default PictureCard
