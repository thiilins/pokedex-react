'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { api } from '@/services/api'
import getId from '@/utils/getId'
import Header from '@/components/Header'
import PokemonCard from '@/components/PokemonCard'
import PokemonProfileModal from '@/components/PokemonProfileModal'
import BattleVersusModal from '@/components/BattleVersusModal'
import Pagination from '@/components/Pagination'
import { Sparkles, Trophy, Shield, Swords, Star } from 'lucide-react'
import Image from 'next/image'
import { typeStylingMap } from '@/components/PokemonTypeIcon'

interface IPokemonListItem {
  name: string
  url: string
  id: string
}

export default function Home() {
  const [allPokemons, setAllPokemons] = useState<IPokemonListItem[]>([])
  const [typeFilteredPokemons, setTypeFilteredPokemons] = useState<IPokemonListItem[] | null>(null)
  
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(32)

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [sortBy, setSortBy] = useState('id-asc')

  // Modal State
  const [open, setOpen] = useState(false)
  const [pokemonModalData, setPokemonModalData] = useState<any>(null)

  // 1. Caching Instantâneo Database State (Performance Extrema!)
  const [pokemonCache, setPokemonCache] = useState<Record<string, any>>({})

  // 2. Módulo de Comparação de Combate (Battle Versus) State
  const [compareList, setCompareList] = useState<string[]>([])
  const [compareOpen, setCompareOpen] = useState(false)

  // Pokémon of the Day (Charizard - 6)
  const [featuredPokemon, setFeaturedPokemon] = useState<any>(null)

  // Callback to register loaded Pokémon details in Cache (Performance Extrema!)
  const handleDataLoaded = useCallback((id: string, parsedData: any) => {
    setPokemonCache((prev) => {
      if (prev[id]) return prev
      return { ...prev, [id]: parsedData }
    })
  }, [])

  // Callback to toggle Pokémon inside the Battle Versus List
  const handleCompareToggle = useCallback((id: string) => {
    setCompareList((prev) => {
      if (prev.includes(id)) {
        return prev.filter((p) => p !== id)
      }
      if (prev.length >= 2) return prev // Max 2 pokemons
      const newList = [...prev, id]
      if (newList.length === 2) {
        setCompareOpen(true) // Automatically open the arena when 2 are selected!
      }
      return newList
    })
  }, [])

  // 1. Initial Load: Fetch all 1025 pokemons
  useEffect(() => {
    const fetchAllPokemons = async () => {
      try {
        setLoading(true)
        const res = await api.get('/pokemon?limit=1025')
        const parsed = res.data.results.map((item: any) => ({
          ...item,
          id: getId(item.url)
        }))
        setAllPokemons(parsed)
        setLoading(false)
      } catch (err) {
        console.error('Failed to load pokemon index:', err)
        setLoading(false)
      }
    }
    fetchAllPokemons()
  }, [])

  // 2. Load Featured Pokemon of the Day
  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const res = await api.get('/pokemon/6')
        setFeaturedPokemon({
          id: res.data.id,
          name: res.data.name,
          height: res.data.height,
          weight: res.data.weight,
          image: res.data.sprites?.other?.dream_world?.front_default ?? 
                 res.data.sprites?.other['official-artwork']?.front_default,
          stats: res.data.stats.slice(0, 3).map((st: any) => ({
            name: st.stat.name,
            val: st.base_stat
          }))
        })
      } catch (err) {
        console.error('Failed to load featured pokemon:', err)
      }
    }
    loadFeatured()
  }, [])

  // 3. Type Filter Load
  useEffect(() => {
    const fetchPokemonsByType = async () => {
      if (!selectedType) {
        setTypeFilteredPokemons(null)
        setCurrentPage(1)
        return
      }

      try {
        setLoading(true)
        const res = await api.get(`/type/${selectedType.toLowerCase()}`)
        const parsed = res.data.pokemon.map((item: any) => ({
          name: item.pokemon.name,
          url: item.pokemon.url,
          id: getId(item.pokemon.url)
        })).filter((p: any) => parseInt(p.id) <= 1025)
        
        setTypeFilteredPokemons(parsed)
        setCurrentPage(1)
        setLoading(false)
      } catch (err) {
        console.error(`Failed to load pokemon type ${selectedType}:`, err)
        setLoading(false)
      }
    }
    fetchPokemonsByType()
  }, [selectedType])

  // Reset page on search change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  // 4. Filter & Sort
  const processedPokemons = useMemo(() => {
    let list = typeFilteredPokemons !== null ? typeFilteredPokemons : allPokemons

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.id.toString() === q
      )
    }

    const sorted = [...list]
    if (sortBy === 'id-asc') {
      sorted.sort((a, b) => parseInt(a.id) - parseInt(b.id))
    } else if (sortBy === 'id-desc') {
      sorted.sort((a, b) => parseInt(b.id) - parseInt(a.id))
    } else if (sortBy === 'name-asc') {
      sorted.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'name-desc') {
      sorted.sort((a, b) => b.name.localeCompare(a.name))
    }

    return sorted
  }, [allPokemons, typeFilteredPokemons, searchQuery, sortBy])

  // 5. Paginate
  const paginatedPokemons = useMemo(() => {
    const offset = (currentPage - 1) * itemsPerPage
    return processedPokemons.slice(offset, offset + itemsPerPage)
  }, [processedPokemons, currentPage, itemsPerPage])

  const totalPages = useMemo(() => {
    return Math.ceil(processedPokemons.length / itemsPerPage)
  }, [processedPokemons, itemsPerPage])

  // 3. Tema Orgânico Dinâmico (Active Type Aura!)
  // If details modal is open, adapt the ambient orbs to the open Pokémon's element color!
  const activeType = useMemo(() => {
    if (open && pokemonModalData) {
      return pokemonModalData.types[0]?.name?.toLowerCase() || ''
    }
    // If Battle Versus is open, blend type colors dynamically
    if (compareOpen && compareList.length === 2) {
      const pokeA = pokemonCache[compareList[0]]
      return pokeA?.types[0]?.name?.toLowerCase() || ''
    }
    return ''
  }, [open, pokemonModalData, compareOpen, compareList, pokemonCache])

  const styleAura = useMemo(() => {
    if (activeType) {
      return typeStylingMap[activeType] || null
    }
    return null
  }, [activeType])

  const statNameMap: Record<string, string> = {
    hp: 'Vida',
    attack: 'Ataque',
    defense: 'Defesa',
  }

  // Retrieve A and B data from Cache for Versus Modal
  const pokeVersusA = useMemo(() => {
    if (compareList.length >= 1) return pokemonCache[compareList[0]]
    return null
  }, [compareList, pokemonCache])

  const pokeVersusB = useMemo(() => {
    if (compareList.length >= 2) return pokemonCache[compareList[1]]
    return null
  }, [compareList, pokemonCache])

  return (
    <div className="min-h-screen bg-background text-white flex flex-col relative overflow-hidden bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px]">
      
      {/* 3. Tema Orgânico Dinâmico: Glowing backdrop pulses in Pokémon's element color when active! */}
      <div 
        className={`absolute top-[-10%] left-[-10%] w-[60%] h-[40%] rounded-full filter blur-[120px] pointer-events-none transition-all duration-700 ${
          styleAura 
            ? `${styleAura.bg}/15 scale-110` 
            : 'bg-secondary/5'
        } animate-pulse-glow`} 
      />
      <div 
        className={`absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] rounded-full filter blur-[120px] pointer-events-none transition-all duration-700 ${
          styleAura 
            ? `${styleAura.bg}/15 scale-110` 
            : 'bg-accent/5'
        } animate-pulse-glow`} 
        style={{ animationDelay: '1.2s' }}
      />

      {/* Header toolbar */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8 flex flex-col justify-between relative z-10">
        
        {/* HERO BANNER */}
        {!searchQuery && !selectedType && currentPage === 1 && (
          <section className="relative mb-8 md:mb-12 p-6 md:p-10 rounded-[28px] md:rounded-[36px] overflow-hidden border border-white/5 bg-slate-950/30 backdrop-blur-xl flex flex-col lg:flex-row items-center gap-6 md:gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
            
            <div className="absolute -left-12 -top-12 w-44 h-44 bg-secondary/15 filter blur-3xl animate-pulse-glow" />
            <div className="absolute -right-12 -bottom-12 w-44 h-44 bg-header/15 filter blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

            {/* Left Content Column */}
            <div className="space-y-4 md:space-y-6 flex-1 text-center lg:text-left order-2 lg:order-1 relative z-10">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-black bg-gradient-to-r from-secondary/15 via-accent/15 to-header/15 text-secondary border border-secondary/20 tracking-widest uppercase shadow-glow-cyan/10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                </span>
                MODO COMBATE ATIVADO
              </div>
              
              {/* Premium typographic gaming logo title */}
              <div className="space-y-1">
                <div className="text-[9px] md:text-[10px] font-mono font-black tracking-[0.25em] text-secondary/80 uppercase">
                  CENTRAL DE INTELIGÊNCIA // ATIVA
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-black tracking-[0.1em] sm:tracking-[0.2em] leading-none text-white uppercase select-none drop-shadow-[0_4px_20px_rgba(0,240,255,0.3)]">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-secondary via-accent to-header bg-[size:200%_auto] animate-shimmer">
                    POKÉDEX
                  </span>
                </h1>
                <div className="text-[9px] md:text-[10px] font-mono font-medium tracking-[0.3em] text-white/40 uppercase">
                  SISTEMA DE NAVEGAÇÃO // CORE v2.5
                </div>
              </div>
              
              <p className="text-xs md:text-sm text-slate-400 max-w-xl leading-relaxed">
                Inspecione estatísticas de combate, elementos e conjuntos de golpes dos 1025 monstrinhos de todas as gerações da franquia principal. Uma plataforma interativa de alto desempenho construída para mestres treinadores.
              </p>

              {/* Status metrics grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md text-center lg:text-left hover:bg-white/10 hover:border-white/10 hover:shadow-glow-default transition-all duration-300 group">
                  <div className="text-xl md:text-2xl font-black text-secondary group-hover:scale-105 transition-transform duration-300">1025</div>
                  <div className="text-[9px] text-slate-500 uppercase font-black tracking-wider">Espécies</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md text-center lg:text-left hover:bg-white/10 hover:border-white/10 hover:shadow-glow-default transition-all duration-300 group">
                  <div className="text-xl md:text-2xl font-black text-header group-hover:scale-105 transition-transform duration-300">18</div>
                  <div className="text-[9px] text-slate-500 uppercase font-black tracking-wider">Elementos</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md text-center lg:text-left hover:bg-white/10 hover:border-white/10 hover:shadow-glow-default transition-all duration-300 group">
                  <div className="text-xl md:text-2xl font-black text-accent group-hover:scale-105 transition-transform duration-300">Gen 9</div>
                  <div className="text-[9px] text-slate-500 uppercase font-black tracking-wider">Geração</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md text-center lg:text-left hover:bg-white/10 hover:border-white/10 hover:shadow-glow-default transition-all duration-300 group">
                  <div className="text-xl md:text-2xl font-black text-emerald-400 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center lg:justify-start gap-1">
                    ATIVO
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                    </span>
                  </div>
                  <div className="text-[9px] text-slate-500 uppercase font-black tracking-wider">Servidor API</div>
                </div>
              </div>
            </div>

            {/* Featured Column */}
            {featuredPokemon && (
              <div className="relative w-full max-w-xs md:max-w-sm p-6 rounded-3xl border border-white/10 bg-[#080d24]/60 backdrop-blur-xl shadow-glow-cyan/15 group overflow-hidden order-1 lg:order-2">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                <div className="absolute -right-16 -top-16 w-36 h-36 rounded-full bg-header/20 filter blur-3xl animate-pulse-glow" />

                <div className="flex justify-between items-start mb-3 relative z-10">
                  <span className="flex items-center gap-1 text-[9px] font-black tracking-widest text-header uppercase px-2 py-0.5 rounded bg-header/10 border border-header/20">
                    <Trophy className="w-3 h-3 text-header" /> DESTAQUE
                  </span>
                  <span className="text-[10px] font-mono text-white/30">#{String(featuredPokemon.id).padStart(4, '0')}</span>
                </div>

                <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto my-1 animate-float drop-shadow-[0_12px_22px_rgba(0,0,0,0.65)]">
                  <Image
                    src={featuredPokemon.image}
                    alt={featuredPokemon.name}
                    fill
                    priority
                    sizes="160px"
                    className="object-contain"
                  />
                </div>

                <div className="space-y-3 relative z-10 text-center mt-3">
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-white capitalize tracking-wide leading-none">{featuredPokemon.name}</h3>
                    <p className="text-[9px] text-slate-500 font-mono tracking-widest uppercase mt-1">Fogo / Voador</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center border-t border-white/5 pt-3">
                    {featuredPokemon.stats.map((st: any) => {
                      const label = statNameMap[st.name.toLowerCase()] || st.name
                      return (
                        <div key={st.name} className="px-1.5 py-1 rounded-xl bg-white/5 border border-white/5 text-[9px]">
                          <div className="text-[8px] text-slate-500 capitalize truncate">{label}</div>
                          <div className="font-black text-secondary">{st.val}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

          </section>
        )}

        {/* Section title */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-6 rounded-full bg-secondary shadow-glow-cyan" />
            <h2 className="text-lg md:text-xl font-black tracking-wider uppercase text-white">
              {selectedType ? `Elemento: ${selectedType}` : searchQuery ? `Resultados` : 'Banco de Dados Pokémon'}
            </h2>
          </div>
          <span className="text-[10px] sm:text-xs font-mono text-slate-400 tracking-wider">
            {processedPokemons.length} Encontrados
          </span>
        </div>

        {/* Loading Spinner / Grid View */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 gap-4">
            <div className="relative w-12 h-12 border-4 border-white/5 border-t-secondary rounded-full animate-spin shadow-glow-cyan/20" />
            <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase animate-pulse">Carregando PokéDex...</span>
          </div>
        ) : processedPokemons.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16 text-center space-y-4 border border-white/5 rounded-3xl bg-slate-950/20 backdrop-blur-md">
            <Shield className="w-10 h-10 text-slate-600 animate-bounce-slow" />
            <h3 className="text-base font-black text-white uppercase tracking-wider">Nenhum Registro</h3>
            <p className="text-xs text-slate-400 max-w-sm px-4">
              Não encontramos Pokémons com os filtros selecionados.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedType('')
                setSortBy('id-asc')
              }}
              className="mt-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-secondary to-primary text-slate-950 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-glow-cyan/20 cursor-pointer"
            >
              Redefinir Filtros
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between">
            {/* Pokemon Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {paginatedPokemons.map((pokemon) => (
                <PokemonCard
                  key={pokemon.id}
                  pokemonId={pokemon.id}
                  setPokemonModalData={setPokemonModalData}
                  setOpen={setOpen}
                  pokemonCache={pokemonCache}
                  onDataLoaded={handleDataLoaded}
                  isComparing={compareList.includes(pokemon.id)}
                  onCompareToggle={handleCompareToggle}
                  compareListLength={compareList.length}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

      </main>

      {/* FLOATING VS COMBAT COMPANION PROMPT (Guides the user when 1 Pokémon is selected) */}
      {compareList.length === 1 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-md p-4 rounded-2xl border border-secondary/40 bg-slate-950/90 backdrop-blur-md shadow-glow-cyan/20 animate-bounce flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-secondary/10 text-secondary animate-pulse">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-black text-secondary tracking-widest uppercase">Arena Versus</div>
              <div className="text-xs text-white">Selecione mais um Pokémon para duelar! (1/2)</div>
            </div>
          </div>
          <button 
            onClick={() => setCompareList([])}
            className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Footer Info */}
      <footer className="py-6 text-center border-t border-white/5 text-[9px] text-slate-600 font-mono tracking-widest uppercase bg-slate-950/40 backdrop-blur-md">
        &copy; {new Date().getFullYear()} PokéDex Premium.
      </footer>

      {/* Profile Detail Bottom Drawer */}
      {pokemonModalData && (
        <PokemonProfileModal
          pokemon={pokemonModalData}
          isOpen={open}
          onRequestClose={() => setOpen(false)}
        />
      )}

      {/* Battle Versus Arena Modal (Triggers when 2 Pokemons are selected!) */}
      {compareList.length === 2 && pokeVersusA && pokeVersusB && (
        <BattleVersusModal
          pokemonA={pokeVersusA}
          pokemonB={pokeVersusB}
          isOpen={compareOpen}
          onClose={() => {
            setCompareOpen(false)
            setCompareList([]) // Reset selection upon closing versus modal!
          }}
        />
      )}

    </div>
  )
}
