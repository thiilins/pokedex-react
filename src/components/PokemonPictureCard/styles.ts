import styled, { css, DefaultTheme } from 'styled-components'
import { IconWrapper } from '../PokemonTypeIcon/styles'
import { transparentize } from 'polished'
import { PokemonTypesVariant } from '@/types/pokemons'
interface IProfileContainer {
  pokemonType: PokemonTypesVariant
  miniCard?: boolean
}
interface IIndexContainer {
  index: number
}
export const CardContainer = styled.div<IProfileContainer>`
  ${({ theme, pokemonType, miniCard }) => css`
    width: 100%;
    aspect-ratio: 1 / 1;
    position: relative;
    border-radius: 2rem;
    background-color: ${theme.colors.types.background[pokemonType]};
    .background__name {
      color: ${theme.colors.types[pokemonType]};
    }
    * {
      user-select: none;
    }
  `}
`
export const IndexContainer = styled.div<IIndexContainer>`
  ${({ theme, index = 2 }) => css`
    position: absolute;
    width: 100%;
    height: 100%;
    min-width: 100%;
    min-height: 100%;
    aspect-ratio: 1 / 1;
    z-index: ${index};
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  `}
`

interface IPokemonTypeProps {
  type: PokemonTypesVariant
}

//POKEMON IMAGE ASSETS
export const PokemonImageContainer = styled.div<IPokemonTypeProps>`
  ${({ theme, type }) => css`
    width: 100%;
    aspect-ratio: 1 / 1;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      position: relative;
      z-index: 5;
      width: 70%;
      aspect-ratio: 1 / 1;
    }
    .background__name {
      position: absolute;
      left: 0;
      right: 0;
      top: 10%;
      z-index: 3;
      font-weight: bold;
      font-size: 8em;
      text-align: center;
      text-transform: uppercase;
      background: -webkit-linear-gradient(
        -90deg,
        rgba(255, 255, 255, 0.09) 0%,
        rgba(255, 255, 255, 0.6) 40%
      );
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-stroke: 4px transparent;
      opacity: 0.8;
    }
    .loader__animation {
      position: absolute;
      width: 90%;
      height: 90%;
      z-index: 2;
      border-radius: 50px;
      animation: animate 3s ease infinite;
      @keyframes animate {
        0% {
          transform: rotate(240deg);
        }
        100% {
          transform: rotate(600deg);
        }
      }

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: ${props => `linear-gradient(
      to top,
      transparent,
      ${theme.colors.types[type]}
    )`};
        background-size: 50% 50%;
        background-repeat: no-repeat;
        border-top-left-radius: 50%;
        border-bottom-left-radius: 50%;
      }

      &::after {
        content: '';
        position: absolute;
        top: 1px;
        left: 50%;
        transform: translateX(-50%);
        width: 9px;
        height: 9px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 50%;
        z-index: 30;
        box-shadow: 0px 0px 40px 6px #fff;
      }
    }
    @media (max-width: 460px) {
      .background__name {
        top: 13%;
        font-size: 3rem;
      }
    }
  `}
`
// POKEMON DATA ASSETS
export const PokemonDataContainer = styled.div`
  ${({ theme }) => css`
    position: absolute;
    width: 100%;
    aspect-ratio: 1 / 1;
    top: 0%;
    bottom: 0;
    left: 0;
    right: 0;
  `}
`
export const PokemonData = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: flex-end;
    position: relative;
    z-index: 5;
    width: 100%;
    height: 100%;

    .name {
      transform: translate(-45%, -150%) rotate(-90deg);
      position: absolute;
      bottom: 3%;
      left: 5%;
      font-size: 4.5rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .details {
      position: absolute;
      right: 5%;
      bottom: 3%;
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
    .types {
      background-color: #fff;
      padding: 0.5rem;
      border-radius: 3rem;
      display: flex;
      gap: 0.5rem;
      position: absolute;
      top: 3%;
      right: 5%;
    }
    .id {
      position: absolute;
      max-width: 150px;
      max-height: 70px;
      display: flex;
      font-weight: bold;
      font-size: 2rem;
      text-align: center;
      letter-spacing: 2px;
      line-height: 32px;
      color: rgba(255, 255, 255, 0.8);
      border: 3px solid rgba(255, 255, 255, 0.8);
      padding: 1rem;
      border-radius: 20px;
      top: 3%;
      left: 5%;
    }
    @media (max-width: 460px) {
      .name {
        font-size: 2.4rem;
        transform: translate(-40%, -180%) rotate(-90deg);
      }
      .types {
        padding: 0.3rem;
        ${IconWrapper} {
          padding: 0.4rem;
          svg {
            width: 14px;
            height: 14px;
            fill: #ffff;
          }
        }
      }
      .id {
        font-size: 1rem;
        padding: 0.3rem 0.5rem;
      }
    }
  `}
`
