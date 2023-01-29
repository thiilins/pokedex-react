import styled, { css } from 'styled-components'

export const List = styled.div`
  ${({ theme }) => css`
    display: grid;
    margin: 4rem auto;
    width: 100%;
    padding: 1rem 0;
    justify-content: center;
    max-width: 1520px;
    align-items: center;
    grid-template-columns: repeat(auto-fit, var(--card-grid-width));
    grid-template-rows: auto;
    grid-gap: 2rem 1rem;
    @media (max-width: 440px) {
      grid-gap: 6rem 2rem;
    }
  `}
`
export const Header = styled.div`
  ${({ theme }) => css`
    display: flex;
    margin: 0 auto;
    justify-content: flex-end;
    align-items: center;
    padding: 0 5rem;
    margin: 0 auto;
    width: 100%;
    max-width: 100%;
  `}
`
