import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swords, ExternalLink } from 'lucide-react'
import PokemonTypeIcon, { typeStylingMap } from './PokemonTypeIcon'
import { getCachedPokemonDetail } from '@/services/pokemonService'

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

// Mapeamento de stat para rótulo curto e cor
const statConfig: Record<string, { label: string; color: string; bar: string }> = {
  hp:               { label: 'HP',    color: 'text-red-400',    bar: 'from-red-500 to-red-400' },
  attack:           { label: 'ATQ',   color: 'text-orange-400', bar: 'from-orange-500 to-orange-400' },
  defense:          { label: 'DEF',   color: 'text-blue-400',   bar: 'from-blue-500 to-blue-400' },
  'special-attack': { label: 'ATQ.E', color: 'text-yellow-400', bar: 'from-yellow-500 to-yellow-400' },
  'special-defense':{ label: 'DEF.E', color: 'text-indigo-400', bar: 'from-indigo-500 to-indigo-400' },
  speed:            { label: 'VEL',   color: 'text-emerald-400',bar: 'from-emerald-500 to-emerald-400' },
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
    if (pokemonCache[pokemonId]) {
      setData(pokemonCache[pokemonId])
      setLoading(false)
      return
    }

    let isMounted = true
    const loadPokemon = async () => {
      try {
        const parsedData = await getCachedPokemonDetail(parseInt(pokemonId))
        if (isMounted) {
          setData(parsedData)
          onDataLoaded(pokemonId, parsedData)
          setLoading(false)
        }
      } catch (err) {
        console.error('Error fetching pokemon details in PokemonCard:', err)
      }
    }
    loadPokemon()
    return () => { isMounted = false }
  }, [pokemonId, pokemonCache, onDataLoaded])

  // Skeleton premium
  if (loading || !data) {
    return (
      <div className="w-full rounded-[24px] bg-white/[0.03] border border-white/5 animate-pulse overflow-hidden">
        <div className="p-4 flex justify-between items-center">
          <div className="w-14 h-3 bg-white/10 rounded-full" />
          <div className="w-6 h-6 bg-white/10 rounded-lg" />
        </div>
        <div className="w-28 h-28 bg-white/10 rounded-full mx-auto my-4" />
        <div className="p-4 space-y-3">
          <div className="w-24 h-4 bg-white/10 rounded mx-auto" />
          <div className="flex justify-center gap-2">
            <div className="w-16 h-5 bg-white/10 rounded-full" />
            <div className="w-16 h-5 bg-white/10 rounded-full" />
          </div>
          <div className="space-y-1.5 pt-1">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-8 h-2.5 bg-white/10 rounded" />
                <div className="flex-1 h-1.5 bg-white/10 rounded-full" />
                <div className="w-5 h-2.5 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const primaryType = data.types[0]?.name.toLowerCase() || 'normal'
  const style = typeStylingMap[primaryType] || typeStylingMap.normal

  // 3 stats principais para mini-gráfico
  const topStats = data.stats.slice(0, 3)
  const totalStats = data.stats.reduce((acc: number, s: any) => acc + s.base_stat, 0)

  return (
    <div
      onClick={() => {
        setPokemonModalData(data)
        setOpen(true)
      }}
      className={`group relative flex flex-col w-full rounded-[24px] border overflow-hidden cursor-pointer select-none transition-all duration-400 hover:-translate-y-1.5 active:scale-[0.98] ${
        isComparing
          ? 'border-secondary ring-1 ring-secondary/40 shadow-glow-cyan/20'
          : `${style.border} hover:border-white/20`
      }`}
      style={{
        background: 'linear-gradient(160deg, #0a0f23 0%, #060a1a 100%)',
      }}
    >
      {/* Aura de fundo baseada no tipo */}
      <div
        className={`absolute -right-12 -top-12 w-36 h-36 rounded-full ${style.bg} filter blur-[55px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none`}
      />
      <div
        className={`absolute -left-10 -bottom-10 w-28 h-28 rounded-full ${style.bg} filter blur-[45px] opacity-[0.04] group-hover:opacity-10 transition-opacity duration-700 pointer-events-none`}
      />

      {/* Linha de cor do tipo no topo */}
      <div className={`h-0.5 w-full ${style.bg} opacity-60`} />

      {/* Header: número + badges + botão arena */}
      <div className="relative px-4 pt-3.5 pb-0 flex justify-between items-start z-10">
        <div className="flex flex-col gap-1">
          <span className="text-[9px] font-black font-mono text-white/25 tracking-widest">
            #{String(data.id).padStart(4, '0')}
          </span>
          {/* Badge lendário/mítico */}
          {(data.is_legendary || data.is_mythical) && (
            <span className="text-[6.5px] font-black px-1.5 py-0.5 rounded bg-violet-500/15 text-violet-400 border border-violet-500/20 uppercase tracking-wider w-fit">
              {data.is_mythical ? '✨ Mítico' : '👑 Lendário'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Link direto para a página de detalhe */}
          <Link
            href={`/pokemon/${data.id}`}
            onClick={e => e.stopPropagation()}
            className="p-1.5 rounded-lg border border-white/5 bg-white/5 text-white/30 hover:text-secondary hover:bg-secondary/10 hover:border-secondary/30 transition-all duration-200 cursor-pointer"
            title="Ver ficha completa"
          >
            <ExternalLink className="w-3 h-3" />
          </Link>

          {/* Botão arena */}
          <button
            onClick={e => {
              e.stopPropagation()
              onCompareToggle(pokemonId)
            }}
            disabled={!isComparing && compareListLength >= 2}
            className={`p-1.5 rounded-lg border transition-all duration-300 active:scale-90 disabled:opacity-20 disabled:pointer-events-none cursor-pointer ${
              isComparing
                ? 'bg-secondary text-slate-950 border-secondary shadow-glow-cyan/40 scale-105'
                : 'bg-white/5 text-white/35 border-white/10 hover:text-white hover:bg-white/10 hover:border-white/20'
            }`}
            title={isComparing ? 'Remover do combate' : 'Adicionar ao combate'}
          >
            <Swords className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Pokémon image */}
      <div className="relative w-28 h-28 sm:w-36 sm:h-36 mx-auto z-10 flex items-center justify-center mt-2 mb-1 transition-transform duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">
        {/* Círculo de glow atrás do sprite */}
        <div className={`absolute w-24 h-24 sm:w-32 sm:h-32 rounded-full ${style.bg} opacity-[0.07] group-hover:opacity-15 blur-md transition-all duration-500`} />
        <Image
          src={data.image}
          alt={data.name}
          fill
          sizes="(max-width: 640px) 112px, 144px"
          className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)] z-10"
        />
      </div>

      {/* Conteúdo inferior */}
      <div className="relative px-4 pb-4 pt-1 z-10 flex flex-col gap-2.5">
        {/* Nome e categoria */}
        <div className="text-center">
          {/* Nome em japonês — marca d'água */}
          <div className="text-[18px] font-black text-white/[0.03] absolute right-3 top-0 pointer-events-none leading-none select-none font-mono">
            {data.japan_name}
          </div>
          <h2 className="text-base sm:text-lg font-black text-white capitalize tracking-wide group-hover:text-secondary transition-colors duration-300 leading-tight">
            {data.name}
          </h2>
          <p className="text-[8px] text-slate-600 font-mono uppercase tracking-wider mt-0.5 truncate">
            {data.category}
          </p>
        </div>

        {/* Type badges */}
        <div className="flex justify-center gap-1.5 flex-wrap">
          {data.types.map((type: any) => (
            <PokemonTypeIcon
              key={type.id}
              type={type.name}
              haveName
              className="px-2.5 py-0.5 text-[9px]"
            />
          ))}
        </div>

        {/* Divisor */}
        <div className="w-full h-px bg-white/5" />

        {/* Mini stats bars */}
        <div className="flex flex-col gap-1.5">
          {topStats.map((stat: any) => {
            const key = stat.name.toLowerCase()
            const cfg = statConfig[key] || { label: stat.name, color: 'text-slate-300', bar: 'from-slate-500 to-slate-400' }
            const pct = Math.min(Math.round((stat.base_stat / 255) * 100), 100)
            return (
              <div key={stat.name} className="flex items-center gap-2">
                <span className={`text-[8px] font-black font-mono w-8 shrink-0 ${cfg.color}`}>
                  {cfg.label}
                </span>
                <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${cfg.bar} transition-all duration-700`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[8px] font-black text-white/50 w-6 text-right shrink-0">
                  {stat.base_stat}
                </span>
              </div>
            )
          })}
        </div>

        {/* Rodapé: total stats + peso */}
        <div className="flex items-center justify-between pt-0.5">
          <span className="text-[8px] font-black font-mono text-slate-600 uppercase tracking-wider">
            TOTAL
          </span>
          <span className={`text-[9px] font-black font-mono ${style.text || 'text-secondary'} ${style.bgAlpha} px-1.5 py-0.5 rounded border ${style.border}`}>
            {totalStats}
          </span>
        </div>
      </div>
    </div>
  )
}

export default PokemonCard
