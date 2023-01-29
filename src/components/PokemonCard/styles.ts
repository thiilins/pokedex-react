import { PokemonTypesVariant } from '@/types/pokemons'
import styled, { css } from 'styled-components'
import { transparentize, darken, lighten } from 'polished'
import { IconWrapper } from '../PokemonTypeIcon/styles'
import { Link } from 'react-router-dom'
import _ from 'lodash'
interface IPokemonTypeProps {
  type: PokemonTypesVariant
}
export const CardContainer = styled.div<IPokemonTypeProps>`
  ${({ theme, type }) => css`
    --in-color: ${transparentize(0.4, theme.colors.types[type])};
    --out-color: ${transparentize(0.5, theme.colors.types[type])};
    height: var(--card-grid-width);
    background-color: transparent;

    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 3;
    &:hover {
      img {
        transform: scale(1.1);
      }
      .card__bg:not(.main) {
        animation: 2s linear 1s infinite running bgAnimate;
      }
    }
    ${CardFooter} {
      background-color: ${theme.colors.types[type]};
    }
    & .main__bg {
      overflow: hidden;
      background: transparent;
      height: var(--card-grid-height);
      width: 100%;
      position: absolute;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      .card__bg {
        z-index: 4;
        box-shadow: none;
        position: absolute;
        background: linear-gradient(
          to top,
          var(--in-color) 0%,
          var(--in-color) 58%,
          transparent 60%
        );

        top: -30%;
        display: flex;
        width: 60%;
        height: 80%;
      }
    }
    .card__bg {
      z-index: 5;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      position: absolute;
      background-color: var(--in-color);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      box-shadow: 5px 0px 30px 15px var(--in-color);
      border: 0;
    }
    @keyframes bgAnimate {
      0% {
        transform: rotate(0deg);
        background-color: var(--in-color);
        backdrop-filter: blur(20px);
        box-shadow: 5px 0px 30px 15px var(--in-color);
        -webkit-backdrop-filter: blur(20px);
      }

      50% {
        background-color: var(--out-color);
        backdrop-filter: blur(2px);
        box-shadow: 5px 0px 30px 15px var(--out-color);
        -webkit-backdrop-filter: blur(2px);
      }
      100% {
        transform: rotate(360deg);
        background-color: var(--in-color);
        backdrop-filter: blur(20px);
        box-shadow: 5px 0px 30px 15px var(--in-color);
        -webkit-backdrop-filter: blur(20px);
      }
    }
  `}
`
export const CardFooter = styled.footer`
  ${({ theme }) => css`
    height: 3rem;
    z-index: 5;
    position: absolute;

    left: 0%;
    bottom: -3rem;
    padding: 0.5rem;
    font-size: 1.2rem;
    font-weight: bold;
    padding: 0 1rem;
    border-radius: 0 0 10px 10px;
    color: #ffffff;
    overflow: hidden;
    transition: all 2s ease-in-out;
    &,
    span {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    svg {
      width: 25px;
      height: 25px;
    }
  `}
`
export const CardDataContainer = styled.div<IPokemonTypeProps>`
  ${({ theme, type }) => css`
    cursor: pointer;
    z-index: 5;
    user-select: none;
    height: var(--card-grid-height);
    width: 100%;
    position: absolute;
    bottom: 0;
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 10px 10px 0 0;
    border: 0;
    padding: 0.5rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
    transition: all ease-in-out 0.3s;
  `}
`
export const CardDetails = styled.div`
  ${({ theme }) => css`
    position: absolute;
    z-index: 5;
    bottom: 10%;
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 0.5rem;

    .id {
      text-align: center;
      font-size: 1.2rem;
      border-radius: 1.2rem;
    }
    .types__container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .name {
      text-transform: capitalize;
      font-size: 2rem;
      max-width: 80%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    ${IconWrapper} {
      display: flex;
      align-items: center;
      justify-content: center;
      svg {
        width: 25px;
        height: 25px;
        fill: #ffff;
      }
    }
    @media (max-width: 440px) {
      .name {
        font-size: 2rem;
      }
    }
  `}
`

export const PokemonImageContainer = styled.div<IPokemonTypeProps>`
  ${({ theme }) => css`
    position: relative;
    z-index: 6;
    top: -50%;
    display: flex;
    width: 60%;
    aspect-ratio: 1 / 1;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.5s;
    @media (max-width: 440px) {
      width: 70%;
    }
    & img {
      z-index: 6;
      padding: 1.5rem;
      aspect-ratio: 1 / 1;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 90%;
      height: 90%;
    }
  `}
`
