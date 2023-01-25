import styled, { css } from 'styled-components'
export const HeaderContainer = styled.div`
  ${({ theme }) => css`
    grid-area: HD;
    display: flex;
    position: relative;
    z-index: 100;
    top: 0;
    left: 0;
    height: 100%;
    width: 100vw;
    align-items: center;
    gap: 2.5rem;
    padding: 2rem;
    justify-content: center;
    background-color: ${theme.colors.secondary};
    & .logo {
      display: flex;
      gap: 1rem;
      align-items: center;
      font-weight: 900;
      color: #fff;
      & img {
        width: 10rem;
        cursor: pointer;
        transition: all 0.2s;
        &:hover {
          transform: scale(1.1);
        }
      }
    }
    @media (max-width: 460px) {
      padding: 1rem 0;
      align-items: center;
      justify-content: center;
      & .logo img {
        width: 5rem;
      }
    }
  `}
`
