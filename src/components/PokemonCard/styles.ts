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
    min-height: var(--card-grid-height);
    width: 100%;
    aspect-ratio: 4 / 2;
    background-color: white;
    border-radius: 0 0 1rem 1rem;
    position: relative;
    display: grid;
    padding: 1rem;

    grid-gap: 1rem;
    grid-template-columns: 50% 50%;
    align-items: flex-end;
    background-color: ${theme.colors.types.background[type]};

    &:hover {
      transform: scale(1.1);
    }
    @media (max-width: 460px) {
      grid-template-columns: 40% 60%;
    }
    @media (max-width: 350px) {
      grid-template-columns: 35% 65%;
    }
  `}
`
export const PokemonPicture = styled.div`
  ${({ theme }) => css`
    width: 100%;
    position: relative;
    height: 100%;
    padding: 1.5rem;
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 100%;
      height: 100%;
    }
    @media (max-width: 460px) {
      padding: 1.5rem;
      padding-top: 2rem;
      img {
        min-width: 120%;
        min-height: 120%;
      }
    }
  `}
`
export const PokemonData = styled.div<IPokemonTypeProps>`
  ${({ theme, type }) => css`
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    width: 100%;
    height: 100%;
    border-radius: 0 0 1rem 1rem;
    gap: 0.5rem;
    .name {
      text-transform: capitalize;
      font-size: 2rem;
      color: white;
    }
    .details {
      display: flex;
      gap: 0.5rem;
      .divider {
        width: 2px;
        background-color: white;
        height: 100%;
      }
      div {
        display: flex;
        align-items: center;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.3rem;
        font-weight: bold;
        span {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
      }
    }
    @media (max-width: 460px) {
      padding-top: 1.5rem;
      .name {
        font-size: 1.2rem;
      }
      .details {
        font-size: 0.8rem;
      }
    }
  `}
`
export const PokemonTypes = styled.div<IPokemonTypeProps>`
  ${({ theme, type }) => css`
    background-color: #fff;
    padding: 0.5rem;
    position: absolute;
    top: -12%;
    left: 0px;
    right: 0;
    z-index: 3;
    border-radius: 3rem;
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    align-items: center;
    .id {
      padding: 0.5rem 1rem;
      text-align: center;
      background-color: ${theme.colors.types.background[type]};
      font-size: 1.2rem;
      border-radius: 1.2rem;
    }
    .types__container {
      display: flex;
    }
    ${IconWrapper} {
      padding: 0.5rem;
      border-radius: 100%;
      aspect-ratio: 1 / 1;
      display: flex;
      align-items: center;
      justify-content: center;
      svg {
        width: 15px;
        height: 15px;
        fill: #ffff;
      }
    }
    @media (max-width: 460px) {
      width: 102%;
      left: -1%;
    }
  `}
`
