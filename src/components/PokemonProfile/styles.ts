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
    display: grid;
    grid-template-columns: 100%;
    flex-direction: column;
    width: 100vw;
    gap: 2rem;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    overflow-x: hidden;

    @media (min-width: 900px) {
      grid-template-columns: repeat(auto-fit, minmax(440px, 1fr));
      display: grid;
      width: 100vw;
      gap: 2rem;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
    }
  `}
`
