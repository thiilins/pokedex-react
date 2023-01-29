import { PokemonTypesVariant } from '@/types/pokemon'
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
    /* Mobile */
    height: var(--card-grid-height);
    background-color: transparent;
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

    & .main__bg {
      display: none;
    }

    ${CardFooter} {
      background-color: ${theme.colors.types[type]};
    }
    /* Web */
    @media (min-width: 440px) {
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
    right: 0%;
    bottom: 0%;
    width: 55%;
    padding: 0.5rem;
    font-size: 1rem;
    font-weight: bold;
    padding: 0 1rem;
    border-radius: 60px 10px 10px 0;

    color: #ffffff;
    overflow: hidden;

    &,
    span {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    svg {
      width: 25px;
      height: 25px;
    }
    @media (min-width: 440px) {
      height: 3rem;
      z-index: 5;
      left: 0%;
      right: 0%;
      font-size: 1.2rem;
      bottom: -3rem;
      border-radius: 0 0 10px 10px;

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
    }
  `}
`
export const CardDataContainer = styled.div<IPokemonTypeProps>`
  ${({ theme, type }) => css`
    display: grid;
    grid-template-columns: 45% 55%;
    width: 100%;
    align-items: center;
    cursor: pointer;
    z-index: 5;
    height: var(--card-grid-height);
    user-select: none;
    position: absolute;
    bottom: 0;
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 10px;
    border: 0;
    padding: 0.5rem;
    overflow: hidden;
    height: var(--card-grid-height);
    @media (min-width: 440px) {
      overflow: unset;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      align-items: center;
      border-radius: 10px 10px 0 0;
    }
  `}
`
export const CardDetails = styled.div`
  ${({ theme }) => css`
    @media (min-width: 440px) {
      position: absolute;
      overflow: hidden;
      padding: unset;
      z-index: 5;
      bottom: 10%;
      gap: 0.5rem;
      align-items: center;
      .name {
        text-align: center;
        font-size: 2rem;
      }
      span.type__name {
        display: inline;
      }
    }

    width: 100%;
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
      text-align: center;
      font-size: 1.2rem;
      width: 90%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `}
`

export const PokemonImageContainer = styled.div<IPokemonTypeProps>`
  ${({ theme }) => css`
    display: flex;
    aspect-ratio: 1 / 1;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    height: 100%;

    & img {
      z-index: 6;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      height: 70%;
      width: 100%;

      right: 10%;
    }
    .card__bg {
      z-index: 3;
      width: 50%;
      aspect-ratio: 1 / 1;
      position: absolute;
      left: 5%;
      right: 5%;
      border-radius: 50%;
      background-color: var(--in-color);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }
    @media (min-width: 440px) {
      position: relative;
      z-index: 6;
      top: -60%;
      width: 60%;
      .card__bg {
        z-index: 5;
        width: 100%;
        left: unset;
        border-radius: 50%;
        -webkit-backdrop-filter: blur(20px);
        box-shadow: 5px 0px 30px 15px var(--in-color);
        border: 0;
      }
      & img {
        width: 100%;
        height: 100%;
        position: unset;
        right: unset;
      }
    }
  `}
`
