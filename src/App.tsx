import React from 'react'
import { ThemeProvider } from 'styled-components'
import Routes from '@/routes'
import theme from '@styles/theme'
import GlobalStyles from '@styles/global'
import ToastContainer from '@components/ToastContainer'
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'
import MUITheme from '@styles/MUITheme'
function App() {
  return (
    <MUIThemeProvider theme={MUITheme}>
      <ThemeProvider theme={theme}>
        <React.StrictMode>
          <GlobalStyles />
          <ToastContainer />
          <Routes />
        </React.StrictMode>
      </ThemeProvider>
    </MUIThemeProvider>
  )
}

export default App
