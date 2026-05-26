import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, Ruler, Weight, Award, Star, Compass, Heart, Swords, Shield, Zap, ShieldAlert, Gauge, Sparkles } from 'lucide-react'
import PokemonTypeIcon, { typeStylingMap } from './PokemonTypeIcon'
import { pokemonTypesIcons } from './PokemonTypeIconData'

interface IProps {
  pokemon: any
  isOpen: boolean
  onRequestClose: () => void
}

const PokemonProfileModal: React.FC<IProps> = ({
  pokemon,
  isOpen,
  onRequestClose
}) => {
  const [activeTab, setActiveTab] = useState<'about' | 'stats' | 'moves'>('about')
  const [isRendered, setIsRendered] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true)
      document.body.style.overflow = 'hidden' 
    } else {
      document.body.style.overflow = ''
      const timer = setTimeout(() => setIsRendered(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isOpen && !isRendered) return null

  const primaryType = pokemon.types[0]?.name.toLowerCase() || 'normal'
  const style = typeStylingMap[primaryType] || typeStylingMap.normal

  // Max stat percentage calculation
  const getStatPercent = (val: number) => {
    return Math.min(Math.round((val / 255) * 100), 100)
  }

  // Calculate Combat Rating
  const totalStats = pokemon.stats.reduce((acc: number, curr: any) => acc + curr.base_stat, 0)

  const statCardConfig: Record<string, { icon: React.FC<any>, label: string, color: string }> = {
    hp: { icon: Heart, label: 'HP / Vida', color: 'text-red-500' },
    attack: { icon: Swords, label: 'Ataque', color: 'text-orange-500' },
    defense: { icon: Shield, label: 'Defesa', color: 'text-blue-500' },
    'special-attack': { icon: Zap, label: 'Atq. Esp.', color: 'text-yellow-400' },
    'special-defense': { icon: ShieldAlert, label: 'Def. Esp.', color: 'text-indigo-400' },
    speed: { icon: Gauge, label: 'Velocidade', color: 'text-emerald-400' }
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 transition-all duration-300 ${
        isOpen ? 'opacity-100 backdrop-blur-md' : 'opacity-0 backdrop-blur-none pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80" onClick={onRequestClose} />

      {/* Main Console Container */}
      <div
        className={`relative w-full rounded-t-[36px] md:rounded-[36px] border ${style.border} bg-gradient-to-br from-[#080d24]/95 via-[#040714]/98 to-[#0b0f2a]/95 backdrop-blur-2xl overflow-y-auto md:overflow-hidden shadow-2xl flex flex-col md:flex-row transition-all duration-300 max-h-[95vh] md:max-h-[85vh] md:max-w-4xl z-10 bottom-0 md:bottom-auto left-0 md:left-auto right-0 md:right-auto absolute md:relative ${
          isOpen 
            ? 'translate-y-0 md:scale-100 md:translate-y-0 shadow-[0_0_60px_rgba(0,240,255,0.25)]' 
            : 'translate-y-full md:scale-95 md:translate-y-4'
        }`}
      >
        
        {/* Swipe drag handle for mobile drawer */}
        <div className="md:hidden flex justify-center py-3.5 w-full absolute top-0 left-0 z-20" onClick={onRequestClose}>
          <div className="w-12 h-1 rounded-full bg-white/20 hover:bg-white/35 transition-colors cursor-pointer" />
        </div>

        {/* LEFT COLUMN: SPECTACULAR HIGH-FIDELITY COLLECTOR COMBAT CARD! */}
        <div className="relative p-5 sm:p-6 md:p-8 flex items-center justify-center z-10 w-full md:w-auto md:min-w-[360px]">
          
          {/* THE HOLOGRAPHIC CARD CONTAINER */}
          <div 
            className={`relative w-full max-w-sm h-[380px] md:h-[480px] rounded-[32px] overflow-hidden border ${style.border} bg-gradient-to-br ${style.gradient} to-[#030616]/95 shadow-[0_15px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between p-6 select-none`}
          >
            {/* Tech grid mesh backdrop on card */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

            {/* Glowing background type color core */}
            <div className={`absolute w-52 h-52 rounded-full ${style.bg} filter blur-[60px] opacity-35 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10`} />

            {/* CARD HEADER DETAILS */}
            <div className="flex justify-between items-center relative z-10">
              
              {/* Top Left: Outlined ID Badge */}
              <div className="border-2 border-white/30 bg-white/10 px-3 py-1 rounded-2xl text-[11px] font-mono font-black tracking-widest text-white shadow-sm">
                #{String(pokemon.id).padStart(4, '0')}
              </div>

              {/* Top Right: Custom white/glass type capsule containing element icon badges! */}
              <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 shadow-sm">
                {pokemon.types.map((t: any) => {
                  const IconComp = pokemonTypesIcons[t.name.toLowerCase()]
                  const typeColors = typeStylingMap[t.name.toLowerCase()] || typeStylingMap.normal
                  
                  return (
                    <div 
                      key={t.id} 
                      className={`w-6.5 h-6.5 rounded-full flex items-center justify-center text-white ${typeColors.bg} border border-white/10 p-1.5 shadow-sm`}
                      title={t.name}
                    >
                      {IconComp && <IconComp className="w-full h-full text-white" />}
                    </div>
                  )
                })}
              </div>

            </div>

            {/* CARD CENTER: Translucent Japanese name backdrop & Floating Artwork */}
            <div className="relative flex-1 flex flex-col items-center justify-center relative my-3">
              
              {/* Translucent outlined Japanese character watermarks */}
              <div className="font-noto text-5xl md:text-6xl font-black text-white/[0.08] tracking-widest absolute top-4 text-center select-none uppercase pointer-events-none leading-none">
                {pokemon.japan_name}
              </div>

              {/* Inner glowing circle core */}
              <div className="absolute w-44 h-44 md:w-56 md:h-56 rounded-full border border-white/10 bg-white/[0.02] -z-10 animate-spin-slow" />
              <div className="absolute w-36 h-36 md:w-44 md:h-44 rounded-full border border-white/5 bg-white/[0.01] -z-10" />

              {/* Majestic floating Pokémon artwork */}
              <div className="relative w-44 h-44 md:w-52 md:h-52 drop-shadow-[0_16px_25px_rgba(0,0,0,0.65)] hover:scale-105 transition-transform duration-500 animate-float">
                <Image
                  src={pokemon.image}
                  alt={pokemon.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 176px, 208px"
                  className="object-contain"
                />
              </div>

            </div>

            {/* CARD FOOTER DETAILS */}
            <div className="flex justify-between items-end relative z-10 mt-auto">
              
              {/* Left Side: Huge VERTICAL name, just like in Bulbasaur design! */}
              <div className="absolute left-0 bottom-0 select-none pointer-events-none origin-bottom-left -rotate-90 -translate-y-4 translate-x-2">
                <span className="text-[2.2rem] md:text-[2.8rem] font-black tracking-widest text-white/10 uppercase font-sans whitespace-nowrap leading-none block">
                  {pokemon.name}
                </span>
              </div>

              {/* Right Side: Small, high-tech Combat Category */}
              <div className="ml-auto text-right space-y-1.5 font-mono">
                <div className="text-[9px] text-white/50 tracking-wider uppercase font-black">
                  {pokemon.category}
                </div>
                
                {/* Micro Metrics Grid inside the card */}
                <div className="flex gap-3 text-right text-[10px] font-bold text-white/90">
                  <div className="flex items-center gap-1">
                    <Weight className="w-3.5 h-3.5 text-white/60" />
                    <span>{(pokemon.weight / 10).toFixed(1)} kg</span>
                  </div>
                  <div className="flex items-center gap-1 border-l border-white/10 pl-2">
                    <Ruler className="w-3.5 h-3.5 text-white/60" />
                    <span>{(pokemon.height / 10).toFixed(1)} m</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: HIGH-TECH COMBAT TERMINAL TAB DETAILS */}
        <div className="flex-[1.2] flex flex-col p-6 md:p-8 md:pl-4 z-10 relative">
          
          {/* Close Button */}
          <button
            onClick={onRequestClose}
            className="hidden md:flex absolute top-4 right-4 p-2 rounded-full border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Cyber Menu Tabs */}
          <div className="flex gap-2 border-b border-white/10 pb-4 mb-5 md:mb-6 mt-2 md:mt-0">
            {(['about', 'stats', 'moves'] as const).map((tab) => {
              const isActive = activeTab === tab
              const tabLabels = { about: 'Sobre', stats: 'Combate', moves: 'Golpes' }

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 md:flex-none px-4 py-2.5 text-xs font-black tracking-widest uppercase rounded-xl transition-all duration-300 active:scale-95 cursor-pointer ${
                    isActive
                      ? `${style.bg} ${style.text} shadow-lg scale-102`
                      : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {tabLabels[tab]}
                </button>
              )
            })}
          </div>

          {/* Panel Container */}
          <div className="flex-1 flex flex-col justify-start min-h-[260px] md:min-h-0">
            
            {/* TAB: ABOUT (Holographic Description & Research Stats) */}
            {activeTab === 'about' && (
              <div className="space-y-4 md:space-y-5 animate-fadeIn">
                
                {/* Holographic Description Box */}
                <div className="relative p-4 rounded-2xl border border-secondary/20 bg-secondary/5 backdrop-blur-md overflow-hidden">
                  <div className="absolute right-3 bottom-3 text-secondary/5 pointer-events-none">
                    <Compass className="w-20 h-20" />
                  </div>
                  <div className="text-[9px] font-black text-secondary tracking-widest uppercase mb-1.5 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 animate-spin-slow" /> Registro da PokéDex
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "{pokemon.description}"
                  </p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 text-xs font-mono">
                  <div className="space-y-1">
                    <div className="text-[9px] text-slate-500 font-black uppercase">Taxa de Captura</div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{pokemon.capture_rate} / 255</span>
                      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-emerald-400" style={{ width: `${(pokemon.capture_rate / 255) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[9px] text-slate-500 font-black uppercase">Felicidade Base</div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{pokemon.base_happiness}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-secondary" style={{ width: `${(pokemon.base_happiness / 140) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info Row */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-slate-400">Nº ORDEM POKEDEX</span>
                    <span className="font-bold text-white">#{pokemon.order}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">ESPÉCIE POKÉMON</span>
                    <span className="font-bold text-white capitalize">{pokemon.species.name}</span>
                  </div>
                </div>

              </div>
            )}

            {/* TAB: COMBAT STATS (Gorgeous Game console Grid of Metric Cards!) */}
            {activeTab === 'stats' && (
              <div className="space-y-4 animate-fadeIn">
                
                {/* Grand Combat Index Badge */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-white/10 bg-slate-950/40 relative overflow-hidden shadow-glow-cyan/5">
                  <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-secondary/10 to-transparent pointer-events-none" />
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-secondary/15 text-secondary">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[9px] text-slate-400 font-black uppercase">Índice Total de Combate</div>
                      <div className="text-xs text-slate-500 font-mono">Somatório Geral de Atributos</div>
                    </div>
                  </div>
                  <div className="text-2xl font-black text-secondary tracking-widest font-mono">
                    {totalStats}
                  </div>
                </div>

                {/* Grid of Custom Combat Stat Cards */}
                <div className="grid grid-cols-2 gap-3">
                  {pokemon.stats.map((stat: any) => {
                    const normName = stat.name.toLowerCase()
                    const config = statCardConfig[normName] || { icon: Star, label: stat.name, color: 'text-slate-300' }
                    const IconComponent = config.icon
                    const percent = getStatPercent(stat.base_stat)

                    return (
                      <div 
                        key={stat.name}
                        className="p-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between space-y-2 hover:bg-white/10 hover:border-white/10 transition-colors duration-300"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-1.5">
                            <div className={`p-1.5 rounded-lg bg-white/5 ${config.color}`}>
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider truncate max-w-[80px]">
                              {config.label}
                            </span>
                          </div>
                          <span className="text-sm font-black text-white font-mono">
                            {stat.base_stat}
                          </span>
                        </div>

                        {/* Stat micro progress bar */}
                        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${style.bg} transition-all duration-1000 ease-out`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>

              </div>
            )}

            {/* TAB: MOVES (Compact holographic moves grid) */}
            {activeTab === 'moves' && (
              <div className="relative flex-1 min-h-[180px] md:min-h-0">
                <div className="absolute inset-0 overflow-y-auto pr-1 space-y-1.5 max-h-[220px] md:max-h-[260px] custom-scrollbar">
                  <div className="flex flex-wrap gap-2">
                    {pokemon.moves.map((move: any) => (
                      <div
                        key={move.name}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/5 bg-white/5 text-[10px] font-mono text-white capitalize hover:bg-white/10 hover:border-white/10 transition-all select-none cursor-default"
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${style.bg}`} />
                        {move.name.replace('-', ' ')}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Action Footer row */}
          <div className="border-t border-white/10 pt-4 mt-5 flex justify-end">
            <button
              onClick={onRequestClose}
              className={`w-full md:w-auto px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-white bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 transition-all cursor-pointer`}
            >
              Fechar Registro
            </button>
          </div>

        </div>

      </div>
    </div>
  )
}

export default PokemonProfileModal
