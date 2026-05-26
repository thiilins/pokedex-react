'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Trophy, ArrowRight, Weight, Ruler, Sparkles } from 'lucide-react'
import PokemonTypeIcon from '@/components/PokemonTypeIcon'

interface IFeaturedPokemonCardProps {
  pokemon: {
    id: number
    name: string
    image: string
    types: { name: string; slot: number }[]
    stats: { name: string; val: number }[]
    height: number
    weight: number
    category?: string
    is_legendary?: boolean
    is_mythical?: boolean
  }
}

const statColorMap: Record<string, string> = {
  hp: 'text-red-400',
  attack: 'text-orange-400',
  defense: 'text-blue-400',
  'special-attack': 'text-yellow-400',
  'special-defense': 'text-indigo-400',
  speed: 'text-emerald-400'
}

const statLabelMap: Record<string, string> = {
  hp: 'HP',
  attack: 'ATQ',
  defense: 'DEF',
  'special-attack': 'ATQ.E',
  'special-defense': 'DEF.E',
  speed: 'VEL'
}

export const FeaturedPokemonCard: React.FC<IFeaturedPokemonCardProps> = ({
  pokemon
}) => {
  const primaryType = pokemon.types[0]?.name?.toLowerCase() || 'normal'

  // Mapa de glow por tipo
  const typeGlowMap: Record<string, string> = {
    fire: 'rgba(239,68,68,0.25)',
    water: 'rgba(59,130,246,0.25)',
    grass: 'rgba(34,197,94,0.25)',
    electric: 'rgba(250,204,21,0.25)',
    psychic: 'rgba(236,72,153,0.25)',
    ice: 'rgba(6,182,212,0.25)',
    dragon: 'rgba(124,58,237,0.25)',
    dark: 'rgba(87,83,78,0.25)',
    fairy: 'rgba(244,114,182,0.25)',
    ghost: 'rgba(99,102,241,0.25)',
    fighting: 'rgba(185,28,28,0.25)',
    poison: 'rgba(168,85,247,0.25)',
    ground: 'rgba(217,119,6,0.25)',
    rock: 'rgba(180,160,56,0.25)',
    bug: 'rgba(132,204,22,0.25)',
    flying: 'rgba(129,140,248,0.25)',
    steel: 'rgba(100,116,139,0.25)',
    normal: 'rgba(168,168,120,0.2)'
  }

  const typeGlow = typeGlowMap[primaryType] || typeGlowMap.normal

  return (
    <div
      className="relative w-full max-w-xs md:max-w-sm overflow-hidden order-1 lg:order-2 flex-shrink-0"
      style={{ borderRadius: '28px' }}
    >
      {/* Card principal */}
      <div
        className="relative rounded-[28px] border border-white/10 bg-[#060c20]/80 backdrop-blur-xl overflow-hidden shadow-2xl"
        style={{
          boxShadow: `0 0 40px ${typeGlow}, 0 20px 50px rgba(0,0,0,0.5)`
        }}
      >
        {/* Grid holográfico de fundo */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.007)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.007)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

        {/* Aura de cor por tipo */}
        <div
          className="absolute -right-10 -top-10 w-40 h-40 rounded-full filter blur-[60px] pointer-events-none"
          style={{ background: typeGlow }}
        />
        <div
          className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full filter blur-[50px] pointer-events-none opacity-60"
          style={{ background: typeGlow }}
        />

        {/* Conteúdo */}
        <div className="relative z-10 p-5">

          {/* Header: badge + número */}
          <div className="flex items-center justify-between mb-4">
            <span className="flex items-center gap-1.5 text-[9px] font-black tracking-widest text-amber-400 uppercase px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20">
              <Trophy className="w-3 h-3" />
              DESTAQUE DO DIA
            </span>
            <div className="flex items-center gap-2">
              {(pokemon.is_legendary || pokemon.is_mythical) && (
                <span className="text-[7px] font-black px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/25 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  {pokemon.is_mythical ? 'MÍTICO' : 'LENDÁRIO'}
                </span>
              )}
              <span className="text-[10px] font-mono text-slate-500 font-bold">
                #{String(pokemon.id).padStart(4, '0')}
              </span>
            </div>
          </div>

          {/* Imagem centralizada com glow */}
          <div className="relative flex items-center justify-center py-2">
            {/* Anel de brilho atrás da imagem */}
            <div
              className="absolute w-36 h-36 rounded-full filter blur-[30px] opacity-40 animate-pulse"
              style={{ background: typeGlow }}
            />
            <div className="relative w-36 h-36 md:w-44 md:h-44 animate-float drop-shadow-[0_16px_32px_rgba(0,0,0,0.7)] z-10">
              <Image
                src={pokemon.image}
                alt={pokemon.name}
                fill
                priority
                sizes="176px"
                className="object-contain"
              />
            </div>
          </div>

          {/* Nome e tipos */}
          <div className="text-center mt-3 space-y-2">
            <h3 className="text-2xl md:text-3xl font-black text-white capitalize tracking-wide leading-none">
              {pokemon.name}
            </h3>
            {pokemon.category && (
              <p className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">
                {pokemon.category}
              </p>
            )}
            {/* Type badges reais */}
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              {pokemon.types.map(t => (
                <PokemonTypeIcon key={t.slot} type={t.name} haveName />
              ))}
            </div>
          </div>

          {/* Métricas físicas */}
          <div className="flex justify-center gap-4 mt-3 text-[9px] font-mono text-slate-400">
            <div className="flex items-center gap-1">
              <Weight className="w-3 h-3 text-slate-500" />
              <span>{(pokemon.weight / 10).toFixed(1)} kg</span>
            </div>
            <div className="w-px h-3 bg-white/10 self-center" />
            <div className="flex items-center gap-1">
              <Ruler className="w-3 h-3 text-slate-500" />
              <span>{(pokemon.height / 10).toFixed(1)} m</span>
            </div>
          </div>

          {/* Stats — até 3 */}
          <div className="grid grid-cols-3 gap-1.5 mt-4 border-t border-white/5 pt-3">
            {pokemon.stats.slice(0, 3).map(st => {
              const key = st.name.toLowerCase()
              return (
                <div
                  key={st.name}
                  className="px-2 py-2 rounded-xl bg-white/5 border border-white/5 text-center hover:bg-white/10 transition-colors"
                >
                  <div className="text-[7.5px] text-slate-500 uppercase font-mono font-bold mb-0.5 truncate">
                    {statLabelMap[key] || st.name}
                  </div>
                  <div className={`text-sm font-black ${statColorMap[key] || 'text-white'}`}>
                    {st.val}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Botão de navegação para a página do Pokémon */}
          <Link
            href={`/pokemon/${pokemon.id}`}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-95 select-none group"
            style={{
              background: `linear-gradient(135deg, ${typeGlow.replace('0.25', '0.6')}, rgba(0,240,255,0.15))`,
              border: `1px solid ${typeGlow.replace('0.25', '0.4')}`,
              color: 'white',
              boxShadow: `0 4px 20px ${typeGlow}`
            }}
          >
            <span>VER FICHA COMPLETA</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  )
}
