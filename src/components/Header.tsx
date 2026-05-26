import React from 'react'
import Image from 'next/image'
import { Search, SlidersHorizontal } from 'lucide-react'
import { typeStylingMap } from './PokemonTypeIcon'

interface IHeaderProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedType: string
  setSelectedType: (type: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
}

const Header: React.FC<IHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  sortBy,
  setSortBy
}) => {
  const pokemonTypes = Object.keys(typeStylingMap)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-background/80 backdrop-blur-md px-6 py-4">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Logo and branding */}
        <div className="flex items-center gap-3 cursor-pointer select-none group" onClick={() => {
          setSearchQuery('')
          setSelectedType('')
          setSortBy('id-asc')
        }}>
          <div className="relative w-36 h-10 transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/assets/img/logo.svg"
              alt="Pokédex Logo"
              fill
              priority
              className="object-contain"
            />
          </div>
          <span className="hidden md:inline-block text-xs font-semibold px-2 py-0.5 rounded bg-red/20 text-red border border-red/30 animate-pulse">
            UPGRADED
          </span>
        </div>

        {/* Filters and search controls */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center flex-1 max-w-3xl justify-end">
          
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nome ou ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-400 transition-all duration-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white/10"
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
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 text-sm rounded-xl border border-white/10 bg-white/5 text-white cursor-pointer transition-all duration-300 focus:outline-none focus:border-primary focus:bg-white/10"
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
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 text-sm rounded-xl border border-white/10 bg-white/5 text-white cursor-pointer transition-all duration-300 focus:outline-none focus:border-primary focus:bg-white/10"
              >
                <option value="id-asc" className="bg-background text-white">Nº Crescente</option>
                <option value="id-desc" className="bg-background text-white">Nº Decrescente</option>
                <option value="name-asc" className="bg-background text-white">Nome A-Z</option>
                <option value="name-desc" className="bg-background text-white">Nome Z-A</option>
              </select>
            </div>

          </div>

        </div>

      </div>
    </header>
  )
}

export default Header
