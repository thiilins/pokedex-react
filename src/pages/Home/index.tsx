import React, { useEffect, useMemo, useState, useCallback } from 'react'
import getId from '@utils/getId'
import { Header, List } from './styles'
import Loading from '@/helpers/Loading'
import Pagination from '@/helpers/Pagination'
import { useSearchParams } from 'react-router-dom'
import PokemonCard from '@components/PokemonCard'
import { PageWrapper } from '../styles'
import { api } from '@/services/api'
import { INamedAPIResource, IPokemonList } from '@/types/general'
import PokemonProfile from '@components/PokemonProfile'
import { IPokemonDetailPageDataProps } from '@/types/pokemon'
const Home = () => {
  const [itemsPerPage] = useState(12)
  const [open, setOpen] = useState(true)
  const [pokemonModalData, setPokemonModalData] =
    useState<IPokemonDetailPageDataProps | null>(null)
  const [pokemons, setPokemons] = useState<IPokemonList[]>([])
  const [pokemonCount, setPokemonCount] = useState(0)
  const [searchParams, setSearchParams] = useSearchParams({
    page: '1',
    search: '',
    type: ''
  })
  const options = { open, setOpen, pokemonModalData, setPokemonModalData }
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
    const loadPokemons = async () => {
      setLoading(true)
      const res = await api.get(
        `/pokemon?limit=${itemsPerPage}&offset=${
          itemsPerPage * (currentPage - 1)
        }`
      )
      setPokemonCount(res.data.count)

      setPokemons(
        res.data.results.map((item: INamedAPIResource) => ({
          ...item,
          id: getId(item.url)
        }))
      )
      setLoading(false)
    }
    loadPokemons()
  }, [itemsPerPage, currentPage])

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
    <PageWrapper>
      {pokemonModalData && (
        <PokemonProfile
          pokemon={pokemonModalData}
          isOpen={open}
          onRequestClose={() => setOpen(false)}
        />
      )}
      <List>
        {!loading ? (
          pokemons.map(pokemon => {
            return (
              <PokemonCard
                key={pokemon.id}
                pokemonId={pokemon.id}
                {...options}
              />
            )
          })
        ) : (
          <Loading />
        )}
      </List>
      <Pagination
        onPrevious={onPrevious}
        onNext={onNext}
        onPageChange={onPageChange}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </PageWrapper>
  )
}

export default Home
