import React from 'react'
import * as pokemonType from '@assets/pokemonTypes'

import { IconWrapper } from './styles'
import { PokemonTypesVariant } from '@/types/pokemons'
interface IPokemonTypeIcon {
  type: unknown
  haveName?: boolean
}

const PokemonTypeIcon: React.FC<IPokemonTypeIcon> = ({ type, haveName }) => {
  const v = type as PokemonTypesVariant
  const TYPE_ICON = pokemonType[v]

  return (
    <IconWrapper type={v} haveName={haveName}>
      <>
        {<TYPE_ICON />}
        {haveName && type}
      </>
    </IconWrapper>
  )
}

export default PokemonTypeIcon
