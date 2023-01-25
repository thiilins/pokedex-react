import React from 'react'
import { Grid } from './styles'
import Header from './Header'
import Content from './Content'
interface ILayoutProps {
  children: React.ReactNode
}
const Layout: React.FC<ILayoutProps> = ({ children }) => {
  return (
    <Grid>
      <Header />
      <Content>{children}</Content>
    </Grid>
  )
}

export default Layout
