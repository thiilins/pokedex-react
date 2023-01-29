import styled, { css } from 'styled-components'
export const PaginationContainer = styled.ul`
  ${({ theme }) => css`
    list-style: none;
    display: flex;
    gap: 1.2rem;
  `}
`
export const Container = styled.div`
  ${({ theme }) => css`
    color: ${theme.colors.primaryText};
    min-width: 99vw;
    display: flex;
    justify-content: center;
    padding: 2rem 0;
  `}
`
interface IPageItem {
  disabled?: boolean
}
export const PageItem = styled.li<IPageItem>`
  ${({ theme, disabled }) => css`
    list-style: none;
    font-size: 1.6rem;
    color: ${disabled ? 'rgba(255,255,255,0.4)' : 'none'};
    cursor: ${disabled ? 'not-allowed' : 'pointer'};
    border-radius: 100%;
    div {
      width: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      aspect-ratio: 1 / 1;
    }
  `}
`
