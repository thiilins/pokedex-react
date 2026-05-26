'use client'

import PokemonTypeIcon, { typeStylingMap } from '@/components/PokemonTypeIcon'
import { fetchPokemonDetailAction } from '@/services/pokemonActions'
import { Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

interface IMiniCollectorCardProps {
  name: string
  id: string
  image: string
  isSelf: boolean
  subtitle?: string
  badgeText?: string
}

export const MiniCollectorCard: React.FC<IMiniCollectorCardProps> = ({
  name,
  id,
  image,
  isSelf,
  subtitle = 'VER REGISTRO'
}) => {
  const [types, setTypes] = useState<{ name: string; slot: number }[]>([])
  const [stats, setStats] = useState<{ name: string; base_stat: number }[]>([])
  const [isLegendary, setIsLegendary] = useState(false)
  const [category, setCategory] = useState('')

  // Busca dados extras do Pokémon para montar o card
  useEffect(() => {
    let isMounted = true
    const load = async () => {
      try {
        const detail = await fetchPokemonDetailAction(parseInt(id))
        if (!isMounted) return
        setTypes(detail.types)
        setStats(detail.stats.slice(0, 3).map((s: any) => ({ name: s.name, base_stat: s.base_stat })))
        setIsLegendary(detail.is_legendary || detail.is_mythical)
        setCategory(detail.category)
      } catch (_) {}
    }
    load()
    return () => {
      isMounted = false
    }
  }, [id])

  const primaryType = types[0]?.name?.toLowerCase() || 'normal'
  const style = typeStylingMap[primaryType] || typeStylingMap.normal

  const statConfig: Record<
    string,
    { label: string; bar: string; color: string }
  > = {
    hp: { label: 'HP', bar: 'from-red-500 to-red-400', color: 'text-red-400' },
    attack: {
      label: 'ATQ',
      bar: 'from-orange-500 to-orange-400',
      color: 'text-orange-400'
    },
    defense: {
      label: 'DEF',
      bar: 'from-blue-500 to-blue-400',
      color: 'text-blue-400'
    }
  }

  return (
    <Link
      href={`/pokemon/${id}`}
      className={`group relative flex flex-col w-[160px] sm:w-[180px] md:w-[200px] rounded-[20px] border overflow-hidden transition-all duration-400 hover:-translate-y-2 active:scale-[0.97] select-none flex-shrink-0 ${
        isSelf
          ? 'border-secondary ring-1 ring-secondary/40 shadow-[0_0_24px_rgba(0,240,255,0.15)]'
          : `${style.border} hover:border-white/25`
      }`}
      style={{
        background: 'linear-gradient(160deg, #0a0f23 0%, #060a1a 100%)'
      }}>
      {/* Linha de cor do tipo no topo */}
      <div
        className={`h-0.5 w-full ${style.bg} ${isSelf ? 'opacity-100' : 'opacity-50'}`}
      />

      {/* Aura de fundo */}
      <div
        className={`absolute -right-10 -top-10 w-32 h-32 rounded-full ${style.bg} filter blur-[50px] ${isSelf ? 'opacity-20' : 'opacity-0 group-hover:opacity-15'} transition-opacity duration-700 pointer-events-none`}
      />

      {/* Header: número + badge */}
      <div className="px-3.5 pt-3 pb-0 flex items-center justify-between z-10 relative">
        <span
          className={`text-[9px] font-black font-mono tracking-widest ${isSelf ? 'text-secondary' : 'text-white/25'}`}>
          #{String(id).padStart(4, '0')}
        </span>
        {(isSelf || isLegendary) && (
          <span
            className={`text-[6.5px] font-black px-1.5 py-0.5 rounded border uppercase tracking-wider flex items-center gap-0.5 ${
              isSelf
                ? 'bg-secondary/15 text-secondary border-secondary/30'
                : 'bg-violet-500/15 text-violet-400 border-violet-500/25'
            }`}>
            {isSelf ? (
              '● ATUAL'
            ) : (
              <>
                <Sparkles className="w-2 h-2" /> LENDÁRIO
              </>
            )}
          </span>
        )}
      </div>

      {/* Imagem com glow */}
      <div className="relative flex items-center justify-center pt-2 pb-1 z-10">
        <div
          className={`absolute w-20 h-20 rounded-full ${style.bg} opacity-[0.08] group-hover:opacity-[0.15] blur-lg transition-all duration-500`}
        />
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 transition-transform duration-500 group-hover:scale-110">
          <Image
            src={image}
            alt={name}
            fill
            className="object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)] z-10"
            unoptimized
          />
        </div>
      </div>

      {/* Nome e categoria */}
      <div className="text-center px-3 z-10 relative">
        <h3
          className={`text-sm font-black uppercase tracking-wide leading-tight transition-colors duration-300 ${isSelf ? 'text-secondary' : 'text-white group-hover:text-secondary'}`}>
          {name.replace(/-/g, ' ')}
        </h3>
        {category && (
          <p className="text-[7.5px] text-slate-600 font-mono uppercase tracking-wider mt-0.5 truncate">
            {category}
          </p>
        )}
      </div>

      {/* Type badges */}
      {types.length > 0 && (
        <div className="flex justify-center gap-1 flex-wrap px-3 mt-2 z-10 relative">
          {types.map(t => (
            <PokemonTypeIcon
              key={t.slot}
              type={t.name}
              haveName
              className="px-2 py-0.5 text-[8px]"
            />
          ))}
        </div>
      )}

      {/* Divisor */}
      <div className="mx-3 my-2.5 h-px bg-white/5 z-10 relative" />

      {/* Mini stats */}
      {stats.length > 0 && (
        <div className="px-3 flex flex-col gap-1.5 z-10 relative">
          {stats.map(stat => {
            const key = stat.name.toLowerCase()
            const cfg = statConfig[key] || {
              label: stat.name,
              bar: 'from-slate-500 to-slate-400',
              color: 'text-slate-300'
            }
            const pct = Math.min(Math.round((stat.base_stat / 255) * 100), 100)
            return (
              <div key={stat.name} className="flex items-center gap-2">
                <span
                  className={`text-[7.5px] font-black font-mono w-7 shrink-0 ${cfg.color}`}>
                  {cfg.label}
                </span>
                <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${cfg.bar}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[7.5px] font-black text-white/40 w-5 text-right shrink-0">
                  {stat.base_stat}
                </span>
              </div>
            )
          })}
        </div>
      )}

      {/* Rodapé: botão */}
      <div className="px-3 pb-3.5 pt-2.5 z-10 relative">
        <div
          className={`w-full text-center py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all duration-300 ${
            isSelf
              ? 'bg-secondary/15 text-secondary border-secondary/30'
              : `bg-white/5 text-slate-400 border-white/5 group-hover:${style.bgAlpha} group-hover:text-white group-hover:border-white/15`
          }`}>
          {isSelf ? '[ VISUALIZANDO ]' : subtitle}
        </div>
      </div>
    </Link>
  )
}
