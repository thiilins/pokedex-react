import { createTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'

// A custom theme for this app
export default createTheme({
  palette: {
    primary: {
      main: '#316ab1'
    },
    secondary: {
      main: '#FFDA27'
    },
    error: {
      main: red.A400
    }
  }
})
