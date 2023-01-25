import styled, { css } from 'styled-components'
import MenuItem from '@mui/material/MenuItem'

export const MenuItemContainer = styled(MenuItem)`
  ${({ theme }) => css`
    color: ${theme.colors.primary};
    &:hover,
    &.Mui-selected:hover {
      color: ${theme.colors.secondary};
      background: ${theme.colors.primary};
    }
    &.Mui-selected {
      color: ${theme.colors.white};
      background: ${theme.colors.primary};
    }
  `}
`
