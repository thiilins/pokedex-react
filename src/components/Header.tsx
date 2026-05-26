import React from 'react'
import Image from 'next/image'
import { Search, SlidersHorizontal, Swords } from 'lucide-react'
import { typeStylingMap } from './PokemonTypeIcon'

interface IHeaderProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedType: string
  setSelectedType: (type: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
  onArenaOpen: () => void
  compareCount: number
  loading: boolean
}

const Header: React.FC<IHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  sortBy,
  setSortBy,
  onArenaOpen,
  compareCount,
  loading
}) => {
  const pokemonTypes = Object.keys(typeStylingMap)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#040714]/90 backdrop-blur-md px-4 sm:px-6 py-3.5 relative">
      <div className="mx-auto flex max-w-7xl flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Logo and branding */}
        <div className="flex items-center justify-between sm:justify-start gap-4">
          <div className="flex items-center gap-3 cursor-pointer select-none group" onClick={() => {
            setSearchQuery('')
            setSelectedType('')
            setSortBy('id-asc')
          }}>
            <div className="relative w-32 h-8 sm:w-36 sm:h-10 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/assets/img/logo.svg"
                alt="Pokédex Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
            <span className="hidden md:inline-block text-[9px] font-black px-2 py-0.5 rounded bg-secondary/15 text-secondary border border-secondary/20 tracking-wider">
              NEXUS CORE
            </span>
          </div>

          {/* Sleek Powered By tag directly in header for permanent visibility */}
          <a
            href="https://thiagolins.dev.br"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300 hover:scale-[1.02] active:scale-97 select-none group/logo"
          >
            <span className="text-[7px] font-mono text-slate-500 tracking-wider group-hover/logo:text-slate-400 transition-colors">
              POWERED BY
            </span>
            <div className="flex items-center gap-1.5">
              <div className="relative w-4 h-4 flex items-center justify-center">
                <Image
                  src="/assets/img/thiagolins-dev.svg"
                  alt="Thiago Lins Logo"
                  width={16}
                  height={16}
                  className="object-contain filter brightness-100 group-hover/logo:animate-pulse"
                />
              </div>
              <span className="font-sans font-black text-[9px] text-white tracking-wide group-hover/logo:text-secondary transition-colors uppercase">
                Thiago Lins
              </span>
            </div>
          </a>

          {/* Arena Duelo Launcher Button (Mobile - Clean and highly responsive!) */}
          <button
            onClick={onArenaOpen}
            className="flex sm:hidden items-center gap-1.5 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-950 bg-gradient-to-r from-secondary to-accent rounded-xl shadow-glow-cyan/25 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer select-none"
          >
            <Swords className="w-3.5 h-3.5 text-slate-950" />
            Arena {compareCount > 0 && `(${compareCount})`}
          </button>
        </div>

        {/* Filters and search controls */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center flex-1 max-w-4xl justify-end">
          
          {/* Search Input */}
          <div className="relative flex-1 min-w-[160px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-400 transition-all duration-300 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary focus:bg-white/10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Controls Select grid */}
          <div className="flex items-center gap-2">
            
            {/* Filter by Type */}
            <div className="relative flex-1 sm:flex-none">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full appearance-none pl-3 pr-8 py-2 text-xs sm:text-sm rounded-xl border border-white/10 bg-white/5 text-white cursor-pointer transition-all duration-300 focus:outline-none focus:border-secondary focus:bg-white/10"
              >
                <option value="" className="bg-background text-white">Todos os Tipos</option>
                {pokemonTypes.map((type) => (
                  <option key={type} value={type} className="bg-background text-white capitalize">
                    {type}
                  </option>
                ))}
              </select>
              <SlidersHorizontal className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 pointer-events-none text-slate-400" />
            </div>

            {/* Sort Order Selector */}
            <div className="relative flex-1 sm:flex-none">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none pl-3 pr-8 py-2 text-xs sm:text-sm rounded-xl border border-white/10 bg-white/5 text-white cursor-pointer transition-all duration-300 focus:outline-none focus:border-secondary focus:bg-white/10"
              >
                <option value="id-asc" className="bg-background text-white">Nº Crescente</option>
                <option value="id-desc" className="bg-background text-white">Nº Decrescente</option>
                <option value="name-asc" className="bg-background text-white">Nome A-Z</option>
                <option value="name-desc" className="bg-background text-white">Nome Z-A</option>
              </select>
            </div>

            {/* Desktop Arena Duelo Launcher Button (Clean static gradient, responsive on hover!) */}
            <button
              onClick={onArenaOpen}
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-950 bg-gradient-to-r from-secondary to-accent rounded-xl shadow-glow-cyan/20 hover:scale-105 hover:shadow-glow-cyan/35 active:scale-95 transition-all duration-300 cursor-pointer whitespace-nowrap select-none"
            >
              <Swords className="w-4 h-4 text-slate-950" />
              Arena de Duelo {compareCount > 0 && `(${compareCount})`}
            </button>

          </div>

        </div>

      </div>

      {/* Dynamic sleek tech loading progress strip (Accompanies the loading right below header!) */}
      {loading && (
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-secondary/20 via-secondary to-secondary/20 bg-[length:200%_auto] animate-shimmer" />
      )}
    </header>
  )
}

export default Header
