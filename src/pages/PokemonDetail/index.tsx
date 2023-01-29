import React, { useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import PokemonProfile from '@components/PokemonProfile'
import { PageWrapper } from '../styles'
import { IPokemonDetailPageDataProps } from '@/types/pokemon'
import Loading from '@/helpers/Loading'

const PokemonDetail: React.FC = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  if (loading) return <Loading />
  return (
    <PageWrapper>
      <PokemonProfile pokemonId={id!} />
    </PageWrapper>
  )
}

export default PokemonDetail
