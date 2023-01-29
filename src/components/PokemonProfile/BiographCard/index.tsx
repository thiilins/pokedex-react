import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import ConstructionImg from '@assets/construction.svg'
import { CardContainer } from './styles'

const BiographCard: React.FC = () => {
  const [value, setValue] = useState('1')

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(String(newValue))
  }
  return (
    <CardContainer>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} centered>
            <Tab label="Item One" value="1" />
            <Tab label="Item Two" value="2" />
            <Tab label="Item Three" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">Item One</TabPanel>
        <TabPanel value="2">Item Two</TabPanel>
        <TabPanel value="3">Item Three</TabPanel>
      </TabContext>
    </CardContainer>
  )
}

export default BiographCard
