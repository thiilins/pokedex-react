import React from 'react'
import { MenuItemProps } from '@mui/material/MenuItem'

import { MenuItemContainer } from './styles'
export const MenuItem: React.FC<MenuItemProps> = ({ children, ...props }) => {
  return <MenuItemContainer {...props}>{children}</MenuItemContainer>
}
