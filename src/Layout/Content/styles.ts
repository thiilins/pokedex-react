import styled, { css } from 'styled-components'
import { darken, lighten } from 'polished'
export const Container = styled.main`
  ${({ theme }) => css`
    grid-area: CT;
    position: relative;
    overflow-y: auto;
    min-width: 99vw;
    width: 100%;
    min-height: calc(100vh - 100px);
    background-color: ${theme.colors.background};
    /* background: linear-gradient(
      to top,
      ${darken(0.5, theme.colors.header)} 0%,
      ${theme.colors.header} 50%,
      ${darken(0.5, theme.colors.header)} 100%
    ); */
    ::-webkit-scrollbar {
      width: 8px;
    }

    ::-webkit-scrollbar-track {
      background: ${lighten(0.1, theme.colors.background)};
    }

    ::-webkit-scrollbar-thumb {
      background-color: ${lighten(0.3, theme.colors.background)};
      border-radius: 20px; /* roundness of the scroll thumb */
    }
  `}
`
