import React, { createContext, useContext, useCallback, useState } from 'react'
import { IPokemonResumeProps } from '@/types/pokemons'
import _ from 'lodash'
import pokemonResumeDB from '@/db/pokemon_resume_list.json'
import pokemonsList from '@/db/pokemon_list.json'

interface IPokemonContext {
  pokemonsList: IPokemonListState[]
  pokemonsResumeList: IPokemonResumeProps[]
  pokemonCount: number
  listPokemonResume: (
    ignoredItems: number,
    itensPerPage: number
  ) => IPokemonResumeProps[]
}

interface IPokemonListState {
  name: string
  url: string
}
const PokemonContext = createContext<IPokemonContext>({} as IPokemonContext)
interface IPokemonProvider {
  children: React.ReactNode
}
const PokemonProvider: React.FC<IPokemonProvider> = ({ children }) => {
  const [pokemonCount, setPokemonCount] = useState<number>(pokemonsList.length)
  const pokemonsResumeList = pokemonResumeDB
  // const AddPokemonsResume = (pokemons: IPokemonResumeProps[]) => {
  //   setPokemonsResumeList(prev => {
  //     const ids = prev.map(item => item.id)
  //     const newArray = _.clone(prev)
  //     const nPokemons = pokemons.filter(item => !ids.includes(item.id))
  //     return [...newArray, ...nPokemons].sort((a, b) => a.id - b.id)
  //   })
  //   return
  // }

  const listPokemonResume = useCallback(
    (ignoredItems: number, itensPerPage: number) => {
      const result = pokemonsResumeList.slice(
        ignoredItems,
        ignoredItems + itensPerPage
      )
      return result
    },
    [pokemonsResumeList]
  )
  return (
    <PokemonContext.Provider
      value={{
        pokemonsResumeList,
        listPokemonResume,
        pokemonCount,
        pokemonsList
      }}>
      {children}
    </PokemonContext.Provider>
  )
}

function usePokemons(): IPokemonContext {
  return useContext(PokemonContext)
}

export { PokemonProvider, usePokemons }
