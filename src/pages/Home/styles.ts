import styled, { css } from 'styled-components'

export const Wrapper = styled.div`
  ${({ theme }) => css`
    display: flex;
    width: 100%;
    max-width: 1920px;
    margin: 0 auto;
    flex-direction: column;
    align-items: center;
  `}
`
export const List = styled.div`
  ${({ theme }) => css`
    display: grid;
    margin: 4rem auto;
    width: 100%;
    align-items: center;
    justify-content: center;
    grid-template-columns: repeat(auto-fit, var(--card-grid-width));
    grid-template-rows: repeat(auto-fit, var(--card-grid-height));
    grid-gap: 3rem;
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
