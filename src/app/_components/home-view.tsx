'use client'

import BattleVersusModal from '@/components/BattleVersusModal'
import { FeaturedPokemonCard } from '@/components/FeaturedPokemonCard'
import Header from '@/components/Header'
import PokemonCard from '@/components/PokemonCard'
import PokemonProfileModal from '@/components/PokemonProfileModal'
import { typeStylingMap } from '@/components/PokemonTypeIcon'
import { usePokedex } from '@/contexts/PokedexContext'
import { ArrowUp, Shield, Swords } from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

export default function HomeView() {
  const {
    allPokemons,
    typeFilteredPokemons,
    loadingAll: loading,
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    sortBy,
    setSortBy,
    pokemonCache,
    setPokemonInCache: handleDataLoaded,
    compareList,
    setCompareList,
    compareOpen,
    setCompareOpen,
    toggleCompare: handleCompareToggle,
    handleSelectSlot,
    featuredPokemon
  } = usePokedex()

  const [visibleCount, setVisibleCount] = useState(24)

  // Modal State
  const [open, setOpen] = useState(false)
  const [pokemonModalData, setPokemonModalData] = useState<any>(null)

  // Back to Top Button scroll listener
  const [showBackToTop, setShowBackToTop] = useState(false)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true)
      } else {
        setShowBackToTop(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Reset page on search/type change
  useEffect(() => {
    setVisibleCount(24)
  }, [searchQuery, selectedType])

  // Filter & Sort
  const processedPokemons = useMemo(() => {
    let list =
      typeFilteredPokemons !== null ? typeFilteredPokemons : allPokemons

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(
        p => p.name.toLowerCase().includes(q) || p.id.toString() === q
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

  // Paginate using visibleCount for Infinite Scroll
  const paginatedPokemons = useMemo(() => {
    return processedPokemons.slice(0, visibleCount)
  }, [processedPokemons, visibleCount])

  // Infinite Scroll Trigger using IntersectionObserver Callback Ref
  const observerRef = React.useRef<IntersectionObserver | null>(null)
  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return
      if (observerRef.current) observerRef.current.disconnect()

      observerRef.current = new IntersectionObserver(
        entries => {
          if (
            entries[0].isIntersecting &&
            visibleCount < processedPokemons.length
          ) {
            setVisibleCount(prev =>
              Math.min(prev + 24, processedPokemons.length)
            )
          }
        },
        { threshold: 0.1, rootMargin: '200px' }
      )

      if (node) {
        observerRef.current.observe(node)
      }
    },
    [loading, processedPokemons.length, visibleCount]
  )

  // Tema Orgânico Dinâmico (Active Type Aura!)
  // If details modal is open, adapt the ambient orbs to the open Pokémon's element color!
  const activeType = useMemo(() => {
    if (open && pokemonModalData) {
      return pokemonModalData.types[0]?.name?.toLowerCase() || ''
    }
    // If Battle Versus is open, blend type colors dynamically
    if (compareOpen && compareList[0]) {
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

  // Retrieve A and B data from Cache for Versus Modal
  const pokeVersusA = useMemo(() => {
    if (compareList.length >= 1 && compareList[0])
      return pokemonCache[compareList[0]]
    return null
  }, [compareList, pokemonCache])

  const pokeVersusB = useMemo(() => {
    if (compareList.length >= 2 && compareList[1])
      return pokemonCache[compareList[1]]
    return null
  }, [compareList, pokemonCache])

  return (
    <div className="min-h-screen bg-background text-white flex flex-col relative overflow-hidden bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px]">
      {/* H1 da página — sempre presente no DOM (independente de filtros) para SEO/a11y */}
      <h1 className="sr-only">
        Pokédex — Todos os 1025 Pokémon com estatísticas, tipos e evoluções
      </h1>

      {/* Tema Orgânico Dinâmico: Glowing backdrop pulses in Pokémon's element color when active! */}
      <div
        className={`absolute top-[-10%] left-[-10%] w-[60%] h-[40%] rounded-full filter blur-[120px] pointer-events-none transition-all duration-700 ${
          styleAura ? `${styleAura.bg}/15 scale-110` : 'bg-secondary/5'
        } animate-pulse-glow`}
      />
      <div
        className={`absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] rounded-full filter blur-[120px] pointer-events-none transition-all duration-700 ${
          styleAura ? `${styleAura.bg}/15 scale-110` : 'bg-accent/5'
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
        onArenaOpen={() => setCompareOpen(true)}
        compareCount={compareList.filter(Boolean).length}
        loading={loading}
      />

      {/* Main Body */}
      <main
        id="main-content"
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8 flex flex-col justify-between relative z-10">
        {/* HERO BANNER */}
        {!searchQuery && !selectedType && (
          <section className="relative mb-8 md:mb-12 p-6 md:p-10 rounded-[28px] md:rounded-[36px] overflow-hidden border border-white/5 bg-slate-950/30 backdrop-blur-xl flex flex-col lg:flex-row items-center gap-6 md:gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
            <div className="absolute -left-12 -top-12 w-44 h-44 bg-secondary/15 filter blur-3xl animate-pulse-glow" />
            <div
              className="absolute -right-12 -bottom-12 w-44 h-44 bg-header/15 filter blur-3xl animate-pulse-glow"
              style={{ animationDelay: '1.5s' }}
            />
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
                <div
                  aria-hidden="true"
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-black tracking-[0.1em] sm:tracking-[0.2em] leading-none text-white uppercase select-none drop-shadow-[0_4px_20px_rgba(0,240,255,0.3)]">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-secondary via-accent to-header bg-[size:200%_auto] animate-shimmer">
                    POKÉDEX
                  </span>
                </div>
                <div className="text-[9px] md:text-[10px] font-mono font-medium tracking-[0.3em] text-white/40 uppercase">
                  SISTEMA DE NAVEGAÇÃO // CORE v2.5
                </div>
              </div>

              <p className="text-xs md:text-sm text-slate-400 max-w-xl leading-relaxed">
                Inspecione estatísticas de combate, elementos e conjuntos de
                golpes dos 1025 monstrinhos de todas as gerações da franquia
                principal. Uma plataforma interativa de alto desempenho
                construída para mestres treinadores.
              </p>

              {/* Status metrics grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md text-center lg:text-left hover:bg-white/10 hover:border-white/10 hover:shadow-glow-default transition-all duration-300 group">
                  <div className="text-xl md:text-2xl font-black text-secondary group-hover:scale-105 transition-transform duration-300">
                    1025
                  </div>
                  <div className="text-[9px] text-slate-500 uppercase font-black tracking-wider">
                    Espécies
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md text-center lg:text-left hover:bg-white/10 hover:border-white/10 hover:shadow-glow-default transition-all duration-300 group">
                  <div className="text-xl md:text-2xl font-black text-header group-hover:scale-105 transition-transform duration-300">
                    18
                  </div>
                  <div className="text-[9px] text-slate-500 uppercase font-black tracking-wider">
                    Elementos
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md text-center lg:text-left hover:bg-white/10 hover:border-white/10 hover:shadow-glow-default transition-all duration-300 group">
                  <div className="text-xl md:text-2xl font-black text-accent group-hover:scale-105 transition-transform duration-300">
                    Gen 9
                  </div>
                  <div className="text-[9px] text-slate-500 uppercase font-black tracking-wider">
                    Geração
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md text-center lg:text-left hover:bg-white/10 hover:border-white/10 hover:shadow-glow-default transition-all duration-300 group">
                  <div className="text-xl md:text-2xl font-black text-emerald-400 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center lg:justify-start gap-1">
                    ATIVO
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                    </span>
                  </div>
                  <div className="text-[9px] text-slate-500 uppercase font-black tracking-wider">
                    Servidor API
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Column — Pokémon do Dia */}
            {featuredPokemon && (
              <FeaturedPokemonCard pokemon={featuredPokemon} />
            )}
          </section>
        )}

        {/* Section title */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-6 rounded-full bg-secondary shadow-glow-cyan" />
            <h2 className="text-lg md:text-xl font-black tracking-wider uppercase text-white">
              {selectedType
                ? `Elemento: ${selectedType}`
                : searchQuery
                  ? `Resultados`
                  : 'Banco de Dados Pokémon'}
            </h2>
          </div>
          <span className="text-[10px] sm:text-xs font-mono text-slate-400 tracking-wider">
            {processedPokemons.length} Encontrados
          </span>
        </div>

        {/* Loading Spinner / Grid View */}
        {loading ? (
          <div
            role="status"
            aria-live="polite"
            className="flex-1 flex flex-col items-center justify-center py-20 gap-4">
            <div className="relative w-12 h-12 border-4 border-white/5 border-t-secondary rounded-full animate-spin shadow-glow-cyan/20" />
            <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase animate-pulse">
              Carregando PokéDex...
            </span>
          </div>
        ) : processedPokemons.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16 text-center space-y-4 border border-white/5 rounded-3xl bg-slate-950/20 backdrop-blur-md">
            <Shield className="w-10 h-10 text-slate-400 animate-bounce-slow" />
            <h3 className="text-base font-black text-white uppercase tracking-wider">
              Nenhum Registro
            </h3>
            <p className="text-xs text-slate-400 max-w-sm px-4">
              Não encontramos Pokémons com os filtros selecionados.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedType('')
                setSortBy('id-asc')
              }}
              className="mt-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-secondary to-primary text-slate-950 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-glow-cyan/20 cursor-pointer">
              Redefinir Filtros
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between">
            {/* Pokemon Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {paginatedPokemons.map(pokemon => (
                <PokemonCard
                  key={pokemon.id}
                  pokemonId={pokemon.id}
                  setPokemonModalData={setPokemonModalData}
                  setOpen={setOpen}
                  pokemonCache={pokemonCache}
                  onDataLoaded={handleDataLoaded}
                  isComparing={compareList.includes(pokemon.id)}
                  onCompareToggle={handleCompareToggle}
                  compareListLength={compareList.filter(Boolean).length}
                />
              ))}
            </div>

            {/* Infinite Scroll Sentinel */}
            {visibleCount < processedPokemons.length && (
              <div
                ref={sentinelRef}
                className="w-full py-10 flex justify-center items-center">
                <div className="relative w-8 h-8 border-2 border-white/5 border-t-secondary rounded-full animate-spin shadow-glow-cyan/10" />
              </div>
            )}
          </div>
        )}
      </main>

      {/* FLOATING VS COMBAT COMPANION PROMPT (Guides the user when 1 Pokémon is selected) */}
      {compareList.filter(Boolean).length === 1 && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-md p-4 rounded-2xl border border-secondary/40 bg-slate-950/90 backdrop-blur-md shadow-glow-cyan/20 animate-bounce flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-secondary/10 text-secondary animate-pulse">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-black text-secondary tracking-widest uppercase">
                Arena Versus
              </div>
              <div className="text-xs text-white">
                Selecione mais um Pokémon para duelar! (1/2)
              </div>
            </div>
          </div>
          <button
            onClick={() => setCompareList([])}
            className="text-xs text-slate-400 hover:text-white underline cursor-pointer">
            Cancelar
          </button>
        </div>
      )}

      {/* Footer Info */}
      <footer className="py-8 border-t border-white/5 bg-slate-950/40 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-[10px] text-slate-500 font-mono tracking-widest uppercase text-center md:text-left">
            &copy; {new Date().getFullYear()} PokéDex Premium. Todos os direitos
            reservados.
          </div>
        </div>
      </footer>

      {/* Profile Detail Bottom Drawer */}
      {pokemonModalData && (
        <PokemonProfileModal
          pokemon={pokemonModalData}
          isOpen={open}
          onRequestClose={() => setOpen(false)}
        />
      )}

      {/* Battle Versus Arena Modal */}
      {compareOpen && (
        <BattleVersusModal
          pokemonA={pokeVersusA}
          pokemonB={pokeVersusB}
          isOpen={compareOpen}
          onClose={() => {
            setCompareOpen(false)
            setCompareList([]) // Reset selection upon closing versus modal!
          }}
          allPokemons={allPokemons}
          pokemonCache={pokemonCache}
          onDataLoaded={handleDataLoaded}
          onSelectSlot={handleSelectSlot}
        />
      )}

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-secondary/30 text-secondary hover:text-white hover:bg-secondary hover:border-secondary hover:shadow-glow-cyan/50 transition-all duration-300 active:scale-90 shadow-[0_0_15px_rgba(0,240,255,0.15)] cursor-pointer select-none"
          title="Subir ao topo"
          aria-label="Subir ao topo">
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}
