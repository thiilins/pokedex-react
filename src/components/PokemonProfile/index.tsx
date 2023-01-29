import React from 'react'
import PokemonPictureCard from './PokemonPictureCard'
import BiographCard from './BiographCard'
import { Container, Wrapper } from './styles'
import { IPokemonDetailPageDataProps } from '@/types/PokemonDetailPageDataProps'

interface IPokemonProfileProps {
  pokemonId: string
}
const PokemonProfile: React.FC<IPokemonProfileProps> = ({ pokemonId }) => {
  return (
    <Wrapper>
      <Container>
        {/* <div className="green"></div>
        <div className="red"></div> */}
        {/* <PokemonPictureCard pokemon={} /> */}
        <BiographCard />
      </Container>
    </Wrapper>
  )
}

export default PokemonProfile
