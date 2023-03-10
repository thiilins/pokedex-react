import styled, { css } from 'styled-components'

const Scrollbar = styled.div`
  ${({ theme }) => css`
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
  `}
`
export default Scrollbar
