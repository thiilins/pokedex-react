import styled, { css } from 'styled-components'

export const Container = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 99vw;
    gap: 0;
  `}
`
export const PokemonListContainer = styled.div`
  ${({ theme }) => css`
    display: grid;
    margin: 0 auto;
    margin-top: 4rem;
    width: 100%;
    max-width: 1920px;
    align-items: center;
    justify-content: center;
    grid-template-columns: repeat(auto-fit, var(--card-grid-width));
    grid-template-rows: repeat(auto-fit, var(--card-grid-height));
    grid-gap: 3rem;
  `}
`
export const ContentHeader = styled.div`
  ${({ theme }) => css`
    display: flex;
    position: relative;
    justify-content: flex-end;
    align-items: center;
    padding: 0 5rem;
    margin: 0 auto;
    width: 100%;
    max-width: 99vw;
  `}
`
