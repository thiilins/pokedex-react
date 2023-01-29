import { IPokemonCardDetails } from '@/types/pokemonCardDetails'
import React, { useState, useEffect } from 'react'

// import { Container } from './styles';
interface IProps {
  evolutionChain: string
}
const Evolution: React.FC<IProps> = ({ evolutionChain }) => {
  useEffect(() => {
    const loadData = async () => {
      //
    }
    loadData()
  }, [])
  return <div />
}

export default Evolution
