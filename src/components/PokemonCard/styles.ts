import { PokemonTypesVariant } from '@/types/pokemons'
import styled, { css } from 'styled-components'
import { transparentize } from 'polished'
import { IconWrapper } from '../PokemonTypeIcon/styles'
import { Link } from 'react-router-dom'
interface IPokemonTypeProps {
  type: PokemonTypesVariant
}
export const Container = styled.div<IPokemonTypeProps>`
  ${({ theme, type }) => css`
    cursor: pointer;
    user-select: none;
    min-height: var(--card-grid-width);
    width: 100%;
    aspect-ratio: 4 / 2;
    background-color: white;
    border-radius: 1rem;
    position: relative;
    display: grid;
    grid-gap: 1rem 2rem;
    align-items: flex-end;
    background-color: ${theme.colors.types.background[type]};
    img.card__img {
      position: relative;
      z-index: 3;
      height: 100%;
      padding: 1.5rem;
      aspect-ratio: 1 / 1;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }
    &:hover img {
      transform: scale(1.1);
    }
  `}
`

export const PokemonDetails = styled.div<IPokemonTypeProps>`
  ${({ theme, type }) => css`
    background-color: #fff;
    padding: 0.5rem 1rem;
    width: 103%;
    position: absolute;
    bottom: -5%;
    left: -1.5%;
    right: 0;
    z-index: 3;
    border-radius: 1.5rem;
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    align-items: center;
    color: ${theme.colors.types.background[type]};

    .id {
      text-align: center;
      font-size: 1.2rem;
      border-radius: 1.2rem;
    }

    .name {
      text-transform: capitalize;
      font-size: 2rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .types__container {
      display: flex;
      gap: 0.5rem;
    }
    ${IconWrapper} {
      padding: 0.5rem;
      border-radius: 100%;
      aspect-ratio: 1 / 1;
      display: flex;
      align-items: center;
      justify-content: center;
      svg {
        width: 25px;
        height: 25px;
        fill: #ffff;
      }
    }
    @media (max-width: 460px) {
      .name {
        font-size: 2rem;
      }
    }
  `}
`
