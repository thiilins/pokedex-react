import React, { useState, useCallback } from 'react'
import { useEffect } from 'react'
import { api } from '@/services/api'
import { useParams } from 'react-router-dom'
import getDetailsModel from '@utils/getDetailsModel'
import { IPokemonDetailPageDataProps } from '@/types/pokemons'
import PokemonProfile from '@components/PokemonProfile'
import { PageWrapper } from '../styles'

const PokemonDetail: React.FC = () => {
  const [data, setData] = useState<IPokemonDetailPageDataProps>(
    {} as IPokemonDetailPageDataProps
  )
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  useEffect(() => {
    const loadData = async () => {
      const res = await api.get(`/pokemon/${id}`)
      const pokemon = await getDetailsModel(res.data)
      setData(pokemon)
      setLoading(false)
    }
    loadData()
  }, [id])
  if (loading) return <></>
  return (
    <PageWrapper>
      <PokemonProfile pokemonData={data} />
    </PageWrapper>
  )
}

export default PokemonDetail
