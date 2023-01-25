import { PokemonTypesVariant } from '@/types/pokemons'
import styled, { css } from 'styled-components'
interface IIConWrapper {
  type: unknown
}

export const IconWrapper = styled.div<IIConWrapper>`
  ${({ theme, type }) => css`
    padding: 0.8rem;
    border-radius: 100%;
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${theme.colors.types[type as PokemonTypesVariant]};
    svg {
      width: 30px;
      height: 30px;
      fill: #ffff;
    }
  `}
`
