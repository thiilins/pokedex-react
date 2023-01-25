import React from 'react'
import * as pokemonType from '@assets/pokemonTypes'

import { IconWrapper } from './styles'
import { PokemonTypesVariant } from '@/types/pokemons'
interface IPokemonTypeIcon {
  type: unknown
}

const PokemonTypeIcon: React.FC<IPokemonTypeIcon> = ({ type }) => {
  const v = type as PokemonTypesVariant
  const TYPE_ICON = pokemonType[v]

  return <IconWrapper type={v}>{<TYPE_ICON />}</IconWrapper>
}

export default PokemonTypeIcon
