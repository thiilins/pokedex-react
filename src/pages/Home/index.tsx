import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { api } from '@services/api'
import { IPokemonResumeProps, PokemonsListResponse } from '@/types/pokemons'
import { Container, ContentHeader, PokemonListContainer } from './styles'
import Loading from '@/helpers/Loading'
import Pagination from '@/helpers/Pagination'
import { usePokemons } from '@/contexts/PokemonContexts'
import { useSearchParams } from 'react-router-dom'
import { Select } from '@components/Inputs'
import PokemonCard from '@components/PokemonCard'
const itemsPerPageOptions = [9, 12, 15, 18, 21]
const Home = () => {
  const [itemsPerPage, setItemsPorPage] = useState(9)
  const { pokemonCount, listPokemonResume } = usePokemons()
  const [searchParams, setSearchParams] = useSearchParams({
    page: '1',
    search: '',
    type: ''
  })
  const [pokemons, setPokemons] = useState<IPokemonResumeProps[]>(
    [] as IPokemonResumeProps[]
  )
  const [loading, setLoading] = useState(true)
  const currentPage = useMemo(
    () => (searchParams.has('page') ? +searchParams.get('page')! : 1),
    [searchParams]
  )
  const totalPages = useMemo(
    () => Math.ceil(pokemonCount / itemsPerPage),
    [itemsPerPage, pokemonCount]
  )

  useEffect(() => {
    setLoading(true)
    const res = listPokemonResume(
      itemsPerPage * (currentPage - 1),
      itemsPerPage
    )
    setPokemons(res)
    setLoading(false)
  }, [itemsPerPage, listPokemonResume, currentPage])

  const onNext = useCallback(() => {
    const page = Math.min(currentPage + 1, totalPages)
    setSearchParams({ page: String(Math.min(currentPage + 1, totalPages)) })
  }, [currentPage, setSearchParams, totalPages])
  const onPrevious = () => {
    setSearchParams({ page: String(Math.max(currentPage - 1, 1)) })
  }
  const onPageChange = (page: number) => {
    const pageNumber = Math.max(1, page)
    setSearchParams({ page: String(Math.min(pageNumber, totalPages)) })
  }
  return (
    <Container>
      <ContentHeader>
        <Select
          label="Itens por página"
          options={itemsPerPageOptions}
          value={itemsPerPage}
          setValue={value => setItemsPorPage(+value)}
        />
      </ContentHeader>
      <PokemonListContainer>
        {!loading ? (
          pokemons.map(pokemon => {
            return <PokemonCard key={pokemon.id} {...pokemon} />
          })
        ) : (
          <Loading />
        )}
      </PokemonListContainer>
      <Pagination
        onPrevious={onPrevious}
        onNext={onNext}
        onPageChange={onPageChange}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </Container>
  )
}

export default Home
