import styled, { css } from 'styled-components'

export const CardContainer = styled.div`
  ${({ theme }) => css`
    width: 100%;
    aspect-ratio: 1 / 1;
    background-color: white;
    align-items: center;
    display: flex;
    flex-direction: column;
    border-radius: 2rem;
    svg {
      width: 80%;
      aspect-ratio: 1 / 1;
    }
    h1 {
      color: #0f0f0f;
      font-size: 3rem;
    }
    margin: 0 auto;
    @media (max-width: 440px) {
      h1 {
        font-size: 1.5rem;
      }
    }
  `}
`
