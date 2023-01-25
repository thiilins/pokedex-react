import styled, { css } from 'styled-components'

export const Container = styled.div`
  ${({ theme }) => css`
    min-width: 99vw;
    height: 100vh;
    overflow-y: hidden;
  `}
`
