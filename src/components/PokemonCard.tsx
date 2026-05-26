import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Swords } from 'lucide-react'
import PokemonTypeIcon, { typeStylingMap } from './PokemonTypeIcon'
import { api } from '@/services/api'
import getId from '@/utils/getId'

interface IProps {
  pokemonId: string
  setPokemonModalData: (pokemon: any) => void
  setOpen: (status: boolean) => void
  pokemonCache: Record<string, any>
  onDataLoaded: (id: string, data: any) => void
  isComparing: boolean
  onCompareToggle: (id: string) => void
  compareListLength: number
}

const PokemonCard: React.FC<IProps> = ({
  pokemonId,
  setOpen,
  setPokemonModalData,
  pokemonCache,
  onDataLoaded,
  isComparing,
  onCompareToggle,
  compareListLength
}) => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Check Cache first! (Performance Extrema)
    if (pokemonCache[pokemonId]) {
      setData(pokemonCache[pokemonId])
      setLoading(false)
      return
    }

    let isMounted = true
    const loadPokemon = async () => {
      try {
        const response = await api.get(`/pokemon/${pokemonId}`)
        
        // Fetch species details
        const speciesUrl = response.data.species.url.replace('https://pokeapi.co/api/v2', '')
        const speciesResponse = await api.get(speciesUrl)
        
        // Find Japanese name
        const japanNameObj = speciesResponse.data.names.find(
          (n: any) => n.language.name === 'ja-Hrkt' || n.language.name === 'ja'
        ) || speciesResponse.data.names[0]

        // Find Portuguese description
        const flavorEntry = speciesResponse.data.flavor_text_entries.find(
          (entry: any) => entry.language.name === 'pt' || entry.language.name === 'pt-BR'
        ) || speciesResponse.data.flavor_text_entries.find(
          (entry: any) => entry.language.name === 'en'
        )
        const flavorText = flavorEntry 
          ? flavorEntry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ').replace(/\r/g, ' ') 
          : 'Sem descrição registrada no banco de dados.'

        // Find genus
        const genusEntry = speciesResponse.data.genera.find(
          (g: any) => g.language.name === 'pt' || g.language.name === 'pt-BR'
        ) || speciesResponse.data.genera.find(
          (g: any) => g.language.name === 'en'
        )
        const category = genusEntry ? genusEntry.genus : 'Pokémon Misterioso'
        
        const parsedData = {
          name: response.data.name,
          japan_name: japanNameObj ? japanNameObj.name : response.data.name,
          id: response.data.id,
          order: response.data.order,
          forms: response.data.forms,
          description: flavorText,
          category: category,
          capture_rate: speciesResponse.data.capture_rate,
          base_happiness: speciesResponse.data.base_happiness,
          is_legendary: speciesResponse.data.is_legendary,
          is_mythical: speciesResponse.data.is_mythical,
          moves: response.data.moves.map((move: any) => ({
            name: move.move.name,
            id: +getId(move.move.url),
            url: move.move.url
          })),
          types: response.data.types.map((type: any) => ({
            slot: type.slot,
            name: type.type.name,
            id: +getId(type.type.url),
            url: type.type.url
          })),
          species: { id: getId(response.data.species.url), ...response.data.species },
          weight: response.data.weight,
          height: response.data.height,
          stats: response.data.stats.map((st: any) => ({
            name: st.stat.name,
            url: st.stat.url,
            id: getId(st.stat.url),
            effort: st.effort,
            base_stat: st.base_stat
          })),
          image:
            response.data.sprites?.other?.dream_world?.front_default ??
            response.data.sprites?.other['official-artwork']?.front_default ??
            response.data.sprites?.other?.home?.front_default ??
            '/assets/img/fallback.png'
        }

        if (isMounted) {
          setData(parsedData)
          onDataLoaded(pokemonId, parsedData) // Update parent Cache!
          setLoading(false)
        }
      } catch (err) {
        console.error('Error fetching pokemon details:', err)
      }
    }
    loadPokemon()

    return () => {
      isMounted = false
    }
  }, [pokemonId, pokemonCache, onDataLoaded])

  if (loading || !data) {
    return (
      <div className="w-full h-[280px] sm:h-[340px] rounded-[24px] sm:rounded-[32px] bg-white/5 border border-white/10 animate-pulse flex flex-col justify-between p-4 sm:p-6">
        <div className="flex justify-between items-start">
          <div className="w-12 h-3.5 bg-white/10 rounded-full" />
          <div className="w-6 h-6 bg-white/10 rounded-full" />
        </div>
        <div className="w-24 h-24 sm:w-36 sm:h-36 bg-white/10 rounded-full mx-auto" />
        <div className="space-y-2">
          <div className="w-20 h-4 bg-white/10 rounded mx-auto" />
          <div className="w-16 h-3 bg-white/10 rounded-full mx-auto" />
        </div>
      </div>
    )
  }

  const primaryType = data.types[0]?.name.toLowerCase() || 'normal'
  const style = typeStylingMap[primaryType] || typeStylingMap.normal

  return (
    <div
      onClick={() => {
        setPokemonModalData(data)
        setOpen(true)
      }}
      className={`group relative flex flex-col justify-between w-full h-[280px] sm:h-[340px] rounded-[24px] sm:rounded-[32px] border bg-gradient-to-b ${style.gradient} to-[#060b28]/95 backdrop-blur-md overflow-hidden cursor-pointer select-none transition-all duration-500 hover:-translate-y-2 hover:${style.glow} hover:border-white/20 active:scale-98 ${
        isComparing ? 'border-secondary ring-1 ring-secondary/50 shadow-glow-cyan/20' : style.border
      }`}
    >
      
      {/* Glow hover effect */}
      <div className={`absolute -right-20 -top-20 w-36 h-36 rounded-full ${style.bg} filter blur-[50px] opacity-0 group-hover:opacity-15 transition-all duration-700`} />

      {/* Top Header */}
      <div className="relative p-4 sm:p-6 pb-0 flex justify-between items-center z-10">
        <span className="text-[10px] font-black font-mono text-white/30 tracking-widest">
          #{String(data.id).padStart(4, '0')}
        </span>
        
        {/* Battle Versus Swords toggle button! */}
        <button
          onClick={(e) => {
            e.stopPropagation() // Avoid opening details modal!
            onCompareToggle(pokemonId)
          }}
          disabled={!isComparing && compareListLength >= 2}
          className={`p-1.5 rounded-lg border transition-all duration-300 active:scale-90 disabled:opacity-25 disabled:pointer-events-none cursor-pointer ${
            isComparing 
              ? 'bg-secondary text-slate-950 border-secondary shadow-glow-cyan/50 scale-105' 
              : 'bg-white/5 text-white/40 border-white/10 hover:text-white hover:bg-white/10 hover:border-white/20'
          }`}
          title={isComparing ? 'Remover do combate' : 'Adicionar ao combate'}
        >
          <Swords className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Floating Pokemon image - sized responsively */}
      <div className="relative w-28 h-28 sm:w-40 sm:h-40 mx-auto z-10 flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:animate-float">
        <Image
          src={data.image}
          alt={data.name}
          fill
          sizes="(max-width: 640px) 112px, 160px"
          className="object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.65)] sm:drop-shadow-[0_16px_22px_rgba(0,0,0,0.65)]"
        />
      </div>

      {/* Card Footer details */}
      <div className="relative p-4 sm:p-6 pt-0 text-center space-y-2 z-10">
        <h2 className="text-base sm:text-xl font-black text-white capitalize tracking-wide drop-shadow group-hover:text-secondary transition-colors duration-300">
          {data.name}
        </h2>
        <div className="flex justify-center gap-1.5 flex-wrap">
          {data.types.map((type: any) => (
            <PokemonTypeIcon key={type.id} type={type.name} haveName className="px-2 py-0.5 sm:px-3.5 sm:py-1 text-[9px] sm:text-[10px]" />
          ))}
        </div>
      </div>

    </div>
  )
}

export default PokemonCard
