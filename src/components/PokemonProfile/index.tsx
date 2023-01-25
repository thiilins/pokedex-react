import React from 'react'
import PokemonPictureCard from '@components/PokemonPictureCard'
import BiographCard from './BiographCard'
import { Container, Wrapper } from './styles'
import { IPokemonDetailPageDataProps } from '@/types/PokemonDetails'
interface IPokemonProfileProps {
  pokemonData: IPokemonDetailPageDataProps
}
const PokemonProfile: React.FC<IPokemonProfileProps> = ({ pokemonData }) => {
  return (
    <Wrapper>
      <Container>
        {/* <div className="green"></div>
        <div className="red"></div> */}
        <PokemonPictureCard pokemon={pokemonData} />
        <BiographCard />
      </Container>
    </Wrapper>
  )
}

export default PokemonProfile
