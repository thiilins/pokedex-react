import styled, { css } from 'styled-components'

export const PageWrapper = styled.div`
  ${({ theme }) => css`
    display: flex;
    width: 100%;
    max-width: 1920px;
    margin: 0 auto;
    overflow-x: hidden;
    flex-direction: column;
    align-items: center;
  `}
`
