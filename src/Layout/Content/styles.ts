import styled, { css } from 'styled-components'
export const Container = styled.main`
  ${({ theme }) => css`
    grid-area: CT;
    position: relative;
    overflow-y: auto;
    min-width: 99vw;
    width: 100%;
    min-height: calc(100vh - 100px);
    background-color: ${theme.colors.background};
    ::-webkit-scrollbar {
      width: 5px;
    }

    ::-webkit-scrollbar-track {
      background: ${theme.colors.secondary}30;
    }

    ::-webkit-scrollbar-thumb {
      background-color: ${theme.colors.secondary};
      border-radius: 20px; /* roundness of the scroll thumb */
    }
  `}
`
