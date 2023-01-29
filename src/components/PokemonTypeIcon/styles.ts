import { PokemonTypesVariant } from '@/types/pokemon'
import styled, { css } from 'styled-components'
import { lighten, transparentize, darken } from 'polished'
interface IIConWrapper {
  type: unknown
  haveName?: boolean
}

export const IconWrapper = styled.div<IIConWrapper>`
  ${({ theme, type, haveName }) => css`
    border-radius: 100%;
    & > span.type__name {
      display: none;
    }
    padding: 0.5rem;
    aspect-ratio: 1 / 1;
    display: flex;
    gap: 0.5rem;
    align-items: center;
    text-transform: capitalize;
    font-weight: bold;
    justify-content: center;
    background-color: ${haveName
      ? darken(0.1, theme.colors.types[type as PokemonTypesVariant])
      : lighten(0.1, theme.colors.types[type as PokemonTypesVariant])};
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    svg {
      width: 20px;
      height: 20px;
      fill: #ffff;
    }
    @media (min-width: 440px) {
      border-radius: ${haveName ? '1.5rem' : '100%'};
      padding: ${haveName ? '0.4rem 0.6rem' : '1rem'};
      aspect-ratio: ${haveName ? '3 / 1' : '1 / 1'};

      & > span.type__name {
        display: unset;
      }
      svg {
        width: 30px;
        height: 30px;
        fill: #ffff;
      }
    }
  `}
`
