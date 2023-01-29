import styled, { css } from 'styled-components'

export const Wrapper = styled.div`
  ${({ theme }) => css`
    width: 100%;
    margin: 0 auto;
    display: flex;
    gap: 2rem;
    padding: 1rem 2rem;
    align-items: center;
    justify-content: center;
    max-width: 1920px;
  `}
`
export const Container = styled.div`
  ${({ theme }) => css`
    grid-template-columns: repeat(auto-fit, minmax(440px, 1fr));
    display: grid;
    width: 100%;
    gap: 2rem;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    @media (max-width: 440px) {
      grid-template-columns: 90vw;
      grid-template-rows: 90vw;
      gap: 1rem;
    }
  `}
`
