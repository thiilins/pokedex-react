import React from 'react'
import ConstructionImg from '@assets/construction.svg'
import { CardContainer } from './styles'

const BiographCard: React.FC = () => {
  return (
    <CardContainer>
      <ConstructionImg />
      <h1>Seção em construção</h1>
    </CardContainer>
  )
}

export default BiographCard
