import { createGlobalStyle, css } from 'styled-components'

export default createGlobalStyle`
${({ theme }) => css`
  :root {
    --card-grid-width: 450px;
    --card-grid-height: 300px;
    @media (max-width: 460px) {
      --card-grid-width: 90vw;
      --card-grid-height: 80vw;
    }
  }

  * {
    margin: 0;
    padding: 0;
    border: 0;
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    &::before,
    &::after {
      box-sizing: inherit;
    }
    &:disabled {
      text-decoration: none;
      pointer-events: none;
      cursor: default;
      user-select: none;
    }
  }
  strong {
    font-weight: ${theme.fonts.weight.bold};
  }
  a {
    color: unset;
    text-decoration: none;

    &:hover {
      color: unset;
    }
  }
  html {
    font-family: ${theme.fonts.family.ubuntu};
  }

  body {
    -webkit-font-smoothing: antialiased;
    color: ${theme.colors.primaryText};
    ::-webkit-scrollbar {
      width: 5px;
    }

    ::-webkit-scrollbar-track {
      background: ${theme.colors.background}30;
    }

    ::-webkit-scrollbar-thumb {
      background-color: ${theme.colors.background};
      border-radius: 20px; /* roundness of the scroll thumb */
    }
  }

  // MUI CUSTOM
  .MuiPaper-root {
    margin-top: 0.3rem;
  }
  .MuiList-root {
    padding: 0;
  }
`}
   `
