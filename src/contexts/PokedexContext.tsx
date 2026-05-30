'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, use } from 'react'
import { getDailyRandomNumber } from '@/utils/generateDayNumber'
import {
  fetchPokemonDetailAction,
  fetchPokemonsByTypeAction
} from '@/services/pokemonActions'
import type {
  PokemonDetailData,
  PokemonListItem
} from '@/types/pokemon-data'

// Mantido como alias por compatibilidade com os imports existentes.
export type IPokemonListItem = PokemonListItem

interface PokedexContextType {
  // Lista de todos os Pokémons
  allPokemons: IPokemonListItem[]
  typeFilteredPokemons: IPokemonListItem[] | null
  loadingAll: boolean

  // Busca e Filtros
  searchQuery: string
  setSearchQuery: (q: string) => void
  selectedType: string
  setSelectedType: (type: string) => void
  sortBy: string
  setSortBy: (sort: string) => void

  // Cache global de dados de Pokémon
  pokemonCache: Record<string, PokemonDetailData>
  setPokemonInCache: (id: string, parsedData: PokemonDetailData) => void

  // Arena de Batalha (Versus)
  compareList: string[]
  setCompareList: React.Dispatch<React.SetStateAction<string[]>>
  compareOpen: boolean
  setCompareOpen: (open: boolean) => void
  toggleCompare: (id: string) => void
  clearCompare: () => void
  handleSelectSlot: (slot: 'A' | 'B', id: string | null) => void

  // Pokémon do Dia
  featuredPokemon: any


}

const PokedexContext = createContext<PokedexContextType | undefined>(undefined)

export const PokedexProvider: React.FC<{
  children: React.ReactNode
  initialPokemonsPromise: Promise<IPokemonListItem[]>
}> = ({ children, initialPokemonsPromise }) => {
  // Lista de 1025 resolvida da Promise cacheada (use cache no servidor) — sem fetch no boot.
  const initialPokemons = use(initialPokemonsPromise)
  const [allPokemons] = useState<IPokemonListItem[]>(initialPokemons)
  const [typeFilteredPokemons, setTypeFilteredPokemons] = useState<IPokemonListItem[] | null>(null)
  const [loadingAll, setLoadingAll] = useState(false)

  // Filtros
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [sortBy, setSortBy] = useState('id-asc')

  // Cache global
  const [pokemonCache, setPokemonCache] = useState<Record<string, PokemonDetailData>>({})

  // Arena de Batalha
  const [compareList, setCompareList] = useState<string[]>([])
  const [compareOpen, setCompareOpen] = useState(false)

  // Pokémon do Dia
  const [featuredPokemon, setFeaturedPokemon] = useState<any>(null)

  // 1. Pokémon do Dia via Server Action (cache server-side).
  //    featuredId depende de new Date() (request-time), por isso resolve no cliente.
  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const featuredId = getDailyRandomNumber()
        const detail = await fetchPokemonDetailAction(featuredId)

        setFeaturedPokemon({
          id: detail.id,
          name: detail.name,
          height: detail.height,
          weight: detail.weight,
          category: detail.category,
          is_legendary: detail.is_legendary,
          is_mythical: detail.is_mythical,
          image: detail.image,
          types: detail.types,
          stats: detail.stats.map((st: any) => ({
            name: st.name,
            val: st.base_stat
          }))
        })
      } catch (err) {
        console.error('Failed to load featured pokemon in Context:', err)
      }
    }
    loadFeatured()
  }, [])

  // 2. Filtro por tipo via Server Action (cache server-side).
  useEffect(() => {
    const fetchPokemonsByType = async () => {
      if (!selectedType) {
        setTypeFilteredPokemons(null)
        return
      }

      try {
        setLoadingAll(true)
        const parsed = await fetchPokemonsByTypeAction(selectedType)
        setTypeFilteredPokemons(parsed)
        setLoadingAll(false)
      } catch (err) {
        console.error(`Failed to load pokemon type ${selectedType} in Context:`, err)
        setLoadingAll(false)
      }
    }
    fetchPokemonsByType()
  }, [selectedType])

  // Método para adicionar/atualizar itens no cache global
  const setPokemonInCache = useCallback((id: string, parsedData: PokemonDetailData) => {
    setPokemonCache(prev => {
      // Compara por referência/id em vez de JSON.stringify (que serializava o
      // objeto inteiro com moves a cada chamada — caro no hot path).
      if (prev[id] === parsedData || prev[id]?.id === parsedData?.id) return prev
      return { ...prev, [id]: parsedData }
    })
  }, [])

  // Arena de batalha - adicionar/remover Pokémon da comparação
  const toggleCompare = useCallback((id: string) => {
    setCompareList(prev => {
      const activeList = prev.filter(Boolean)
      if (activeList.includes(id)) {
        return prev.map(item => (item === id ? '' : item)).filter(Boolean)
      }

      const newList = [...prev]
      if (newList.length < 2) {
        newList.push(id)
      } else {
        const emptyIndex = newList.indexOf('')
        if (emptyIndex !== -1) {
          newList[emptyIndex] = id
        } else {
          return prev // Slots cheios
        }
      }

      if (newList.filter(Boolean).length === 2) {
        setCompareOpen(true) // Abre automaticamente ao selecionar 2
      }
      return newList
    })
  }, [])

  const clearCompare = useCallback(() => {
    setCompareList([])
  }, [])

  const handleSelectSlot = useCallback((slot: 'A' | 'B', id: string | null) => {
    setCompareList(prev => {
      const newList = [...prev]
      while (newList.length < 2) {
        newList.push('')
      }
      if (slot === 'A') {
        newList[0] = id || ''
      } else {
        newList[1] = id || ''
      }
      return newList
    })
  }, [])

  // 3. Detalhes dos Pokémon em comparação (Fighter Selector) via Server Action (cache server-side).
  useEffect(() => {
    compareList.forEach(async id => {
      if (!id || pokemonCache[id]) return
      try {
        const parsedData = await fetchPokemonDetailAction(parseInt(id))
        setPokemonInCache(id.toString(), parsedData)
      } catch (err) {
        console.error(`Failed to fetch details for compare ID ${id} in Context:`, err)
      }
    })
  }, [compareList, pokemonCache, setPokemonInCache])

  const value = useMemo(() => ({
    allPokemons,
    typeFilteredPokemons,
    loadingAll,
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    sortBy,
    setSortBy,
    pokemonCache,
    setPokemonInCache,
    compareList,
    setCompareList,
    compareOpen,
    setCompareOpen,
    toggleCompare,
    clearCompare,
    handleSelectSlot,
    featuredPokemon,
  }), [
    allPokemons,
    typeFilteredPokemons,
    loadingAll,
    searchQuery,
    selectedType,
    sortBy,
    pokemonCache,
    setPokemonInCache,
    compareList,
    compareOpen,
    toggleCompare,
    clearCompare,
    handleSelectSlot,
    featuredPokemon,
  ])

  return (
    <PokedexContext.Provider value={value}>
      {children}
    </PokedexContext.Provider>
  )
}

export const usePokedex = () => {
  const context = useContext(PokedexContext)
  if (context === undefined) {
    throw new Error('usePokedex must be used within a PokedexProvider')
  }
  return context
}
