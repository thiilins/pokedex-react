import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import PokemonTypeIcon, { typeStylingMap } from './PokemonTypeIcon'
import { api } from '@/services/api'
import getId from '@/utils/getId'

interface IProps {
  pokemonId: string
  setPokemonModalData: (pokemon: any) => void
  setOpen: (status: boolean) => void
}

const PokemonCard: React.FC<IProps> = ({
  pokemonId,
  setOpen,
  setPokemonModalData
}) => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const loadPokemon = async () => {
      try {
        const response = await api.get(`/pokemon/${pokemonId}`)
        
        // Fetch species details
        const speciesUrl = response.data.species.url.replace('https://pokeapi.co/api/v2', '')
        const speciesResponse = await api.get(speciesUrl)
        
        // Find Japanese name in names array
        const japanNameObj = speciesResponse.data.names.find(
          (n: any) => n.language.name === 'ja-Hrkt' || n.language.name === 'ja'
        ) || speciesResponse.data.names[0]

        // Find Portuguese description or fallback to English
        const flavorEntry = speciesResponse.data.flavor_text_entries.find(
          (entry: any) => entry.language.name === 'pt' || entry.language.name === 'pt-BR'
        ) || speciesResponse.data.flavor_text_entries.find(
          (entry: any) => entry.language.name === 'en'
        )
        const flavorText = flavorEntry 
          ? flavorEntry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ').replace(/\r/g, ' ') 
          : 'Sem descrição registrada no banco de dados.'

        // Find genus (category) in Portuguese or English
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
  }, [pokemonId])

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
      className={`group relative flex flex-col justify-between w-full h-[280px] sm:h-[340px] rounded-[24px] sm:rounded-[32px] border ${style.border} bg-gradient-to-b ${style.gradient} to-[#060b28]/95 backdrop-blur-md overflow-hidden cursor-pointer select-none transition-all duration-500 hover:-translate-y-2 hover:${style.glow} hover:border-white/20 active:scale-98`}
    >
      
      {/* Glow hover effect */}
      <div className={`absolute -right-20 -top-20 w-36 h-36 rounded-full ${style.bg} filter blur-[50px] opacity-0 group-hover:opacity-15 transition-all duration-700`} />

      {/* Top Header */}
      <div className="relative p-4 sm:p-6 pb-0 flex justify-between items-center z-10">
        <span className="text-[10px] font-black font-mono text-white/30 tracking-widest">
          #{String(data.id).padStart(4, '0')}
        </span>
        
        {/* Pokéball logo */}
        <svg 
          viewBox="0 0 512 512" 
          className="w-5 h-5 text-white/10 group-hover:text-white/25 group-hover:rotate-180 transition-all duration-700 pointer-events-none"
          fill="currentColor"
        >
          <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zm0 48c105 0 191.8 77.2 206.1 178.9h-82C368.1 184 317.4 152 256 152s-112.1 32-124.1 74.9h-82C64.2 125.2 151 48 256 48zm0 416c-105 0-191.8-77.2-206.1-178.9h82c12 42.9 62.7 74.9 124.1 74.9s112.1-32 124.1-74.9h82c-14.3 101.7-81.1 178.9-206.1 178.9zm0-232c-26.5 0-48 21.5-48 48s21.5 48 48 48s48-21.5 48-48s-21.5-48-48-48z"/>
        </svg>
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
