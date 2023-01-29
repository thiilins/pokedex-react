import styled, { css } from 'styled-components'

export const List = styled.div`
  ${({ theme }) => css`
    display: grid;
    margin: 4rem auto;
    width: 100%;
    padding: 150px 0;
    justify-content: center;
    max-width: 1500px;
    align-items: center;
    grid-template-columns: repeat(auto-fit, var(--card-grid-width));
    grid-gap: 180px 1.2rem;
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
