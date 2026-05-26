'use client'
import PokemonTypeIcon from '@/components/PokemonTypeIcon'
import { BookOpen } from 'lucide-react'
import React from 'react'

interface IPokemonHeroInfoProps {
  data: any
  combatRating: string
  captureRarity: string
  rarityText: string
}

export const PokemonHeroInfo: React.FC<IPokemonHeroInfoProps> = ({
  data,
  combatRating,
  captureRarity,
  rarityText
}) => (
  <div className="relative bg-slate-950/40 border border-white/5 rounded-2xl p-6 overflow-hidden">
    {/* Nome japonês watermark */}
    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-8xl font-black text-white/[0.095] pointer-events-none select-none leading-none">
      {data.japan_name}
    </div>
    <div className="relative z-10 flex flex-col gap-3">
      {/* Badges de tipo e status */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[8px] font-mono font-black px-2.5 py-1 rounded-lg bg-secondary/15 text-secondary border border-secondary/25 tracking-widest uppercase">
          POKÉDEX DATABASE // FICHA
        </span>
        <PokemonTypeIcon
          type={data.types[0]?.name}
          haveName
          className="py-0.5"
        />
        {data.types[1] && (
          <PokemonTypeIcon
            type={data.types[1]?.name}
            haveName
            className="py-0.5"
          />
        )}
        {(data.is_legendary || data.is_mythical) && (
          <span className="text-[8px] font-black px-2 py-1 rounded-lg bg-violet-500/15 text-violet-400 border border-violet-500/25 uppercase tracking-wider">
            {data.is_mythical ? '✨ MÍTICO' : '👑 LENDÁRIO'}
          </span>
        )}
      </div>

      {/* Título */}
      <div className="flex items-baseline gap-3">
        <h1 className="text-4xl md:text-5xl font-black uppercase text-white tracking-wide">
          {data.name}
        </h1>
        <span className="text-sm font-mono text-slate-500">
          #{String(data.id).padStart(4, '0')}
        </span>
      </div>

      {/* Descrição */}
      <div className="p-4 rounded-2xl border-l-4 border-secondary bg-secondary/5 border-y border-r border-secondary/10">
        <div className="text-[9px] font-black text-secondary tracking-widest uppercase mb-2 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 animate-pulse" /> DESCRIÇÃO DA
          POKÉDEX
        </div>
        <p className="text-sm text-slate-200 leading-relaxed italic">
          "{data.description}"
        </p>
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
        {[
          { label: 'RATING', value: combatRating },
          {
            label: 'CAPTURA',
            value: `${captureRarity} (${data.capture_rate})`
          },
          {
            label: 'FELICIDADE',
            value: `${data.base_happiness >= 70 ? 'AMIGÁVEL' : 'HOSTIL'}`
          },
          { label: 'RARIDADE', value: rarityText }
        ].map(m => (
          <div
            key={m.label}
            className="p-3 bg-white/5 border border-white/5 rounded-xl">
            <div className="text-[7px] text-slate-500 font-black uppercase mb-1">
              {m.label}
            </div>
            <span className="text-xs font-black text-white">{m.value}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
)
