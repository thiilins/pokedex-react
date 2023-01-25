import styled from 'styled-components'

export const Grid = styled.div`
  display: grid;
  position: relative;
  grid-template-columns: 1fr;
  grid-template-rows: 80px auto;
  grid-template-areas:
    'HD'
    'CT';
  width: 100vw;
  height: 100vh;
`
