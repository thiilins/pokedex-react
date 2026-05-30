import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Ruler, Weight, Award, Star, Compass, Heart, Swords, Shield, Zap, ShieldAlert, Gauge, Sparkles, Volume2 } from 'lucide-react'
import PokemonTypeIcon, { typeStylingMap } from './PokemonTypeIcon'
import { pokemonTypesIcons } from './PokemonTypeIconData'
import { useModalA11y } from '@/hooks/useModalA11y'

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

  // A11y: focus trap + ESC + retorno de foco + scroll lock.
  const dialogRef = useModalA11y<HTMLDivElement>(isOpen, onRequestClose)

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true)
    } else {
      const timer = setTimeout(() => setIsRendered(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if ((!isOpen && !isRendered) || !pokemon) return null

  const primaryType = pokemon.types?.[0]?.name?.toLowerCase() || 'normal'
  const style = typeStylingMap[primaryType] || typeStylingMap.normal

  // Max stat percentage calculation
  const getStatPercent = (val: number) => {
    return Math.min(Math.round((val / 255) * 100), 100)
  }

  // Calculate Combat Rating
  const totalStats = (pokemon.stats ?? []).reduce((acc: number, curr: any) => acc + curr.base_stat, 0)

  const statCardConfig: Record<string, { icon: React.FC<any>, label: string, color: string, gradient: string }> = {
    hp: { icon: Heart, label: 'HP / Vida', color: 'text-red-500', gradient: 'from-red-600 to-red-400' },
    attack: { icon: Swords, label: 'Ataque', color: 'text-orange-500', gradient: 'from-orange-600 to-orange-400' },
    defense: { icon: Shield, label: 'Defesa', color: 'text-blue-500', gradient: 'from-blue-600 to-blue-400' },
    'special-attack': { icon: Zap, label: 'Atq. Esp.', color: 'text-yellow-400', gradient: 'from-yellow-500 to-yellow-300' },
    'special-defense': { icon: ShieldAlert, label: 'Def. Esp.', color: 'text-indigo-400', gradient: 'from-indigo-600 to-indigo-400' },
    speed: { icon: Gauge, label: 'Velocidade', color: 'text-emerald-400', gradient: 'from-emerald-600 to-emerald-400' }
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ${
        isOpen ? 'opacity-100 backdrop-blur-md' : 'opacity-0 backdrop-blur-none pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/85" onClick={onRequestClose} aria-hidden="true" />

      {/* Main Console Container */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Detalhes de ${pokemon.name}`}
        tabIndex={-1}
        className={`relative w-full rounded-[36px] border ${style.border} bg-[#040714]/95 backdrop-blur-2xl overflow-y-auto md:overflow-hidden shadow-[0_0_60px_rgba(0,240,255,0.15)] flex flex-col md:flex-row transition-all duration-300 max-h-[92vh] md:max-h-[85vh] md:max-w-4xl z-10 focus:outline-none ${
          isOpen ? 'scale-100 translate-y-0 shadow-[0_0_60px_rgba(0,240,255,0.2)]' : 'scale-95 translate-y-4'
        }`}
      >
        {/* Swipe drag handle for mobile drawer view */}
        <div className="md:hidden flex justify-center py-3.5 w-full absolute top-0 left-0 z-20" onClick={onRequestClose}>
          <div className="w-12 h-1 rounded-full bg-white/20 hover:bg-white/35 transition-colors cursor-pointer" />
        </div>

        {/* LEFT COLUMN: COLLECTOR COMBAT CARD */}
        <div className="relative p-5 sm:p-6 md:p-8 flex items-center justify-center z-10 w-full md:w-auto md:min-w-[360px] border-b md:border-b-0 md:border-r border-white/5 pt-10 md:pt-8">
          
          {/* THE HOLOGRAPHIC CARD CONTAINER */}
          <div 
            className={`relative w-full max-w-sm h-[380px] md:h-[480px] rounded-[32px] overflow-hidden border ${style.border} bg-gradient-to-br ${style.gradient} to-[#030616]/95 shadow-[0_15px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between p-6 select-none`}
          >
            {/* Tech grid backdrop */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

            {/* TCG Holographic Card Scanline Animation Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] via-white/[0.07] to-transparent h-1/2 w-full -z-5 animate-scanline pointer-events-none" />

            {/* Glowing type core */}
            <div className={`absolute w-52 h-52 rounded-full ${style.bg} filter blur-[60px] opacity-35 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10`} />

            {/* CARD HEADER DETAILS (TCG horizontal name plate!) */}
            <div className="flex justify-between items-center relative z-10">
              
              {/* TCG Style Name & ID Plate */}
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-mono font-black text-white/55 tracking-widest leading-none">
                  NO. {String(pokemon.id).padStart(4, '0')}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-lg md:text-xl font-black tracking-wide text-white uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                    {pokemon.name}
                  </span>
                  
                  {pokemon.cries?.latest && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        const audio = new Audio(pokemon.cries.latest)
                        audio.volume = 0.35
                        audio.play().catch(err => console.error("Audio failed:", err))
                      }}
                      className="p-1 rounded bg-white/10 border border-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-all active:scale-90 cursor-pointer shadow-sm select-none"
                      title="Ouvir Rugido"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Type capsule icons (Standard absolute sizes!) */}
              <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 shadow-sm select-none">
                {pokemon.types.map((t: any) => {
                  const IconComp = pokemonTypesIcons[t.name.toLowerCase()]
                  const typeColors = typeStylingMap[t.name.toLowerCase()] || typeStylingMap.normal
                  
                  return (
                    <div 
                      key={t.id} 
                      className={`rounded-full flex items-center justify-center text-white ${typeColors.bg} border border-white/10 shadow-sm`}
                      style={{ width: '28px', height: '28px', minWidth: '28px', minHeight: '28px' }}
                      title={t.name}
                    >
                      {IconComp && (
                        <IconComp 
                          style={{ width: '16px', height: '16px' }} 
                          className="text-white" 
                        />
                      )}
                    </div>
                  )
                })}
              </div>

            </div>

            {/* CARD CENTER: Outlined Japanese name & floating art */}
            <div className="relative flex-1 flex flex-col items-center justify-center my-3">
              
              {/* Thin outlined Japanese font watermark */}
              <div className="font-noto text-5xl md:text-6xl font-black text-white/[0.08] tracking-widest absolute top-4 text-center select-none uppercase pointer-events-none leading-none">
                {pokemon.japan_name}
              </div>

              {/* Rotating circles */}
              <div className="absolute w-44 h-44 md:w-56 md:h-56 rounded-full border border-white/10 bg-white/[0.02] -z-10 animate-spin-slow" />
              <div className="absolute w-36 h-36 md:w-44 md:h-44 rounded-full border border-white/5 bg-white/[0.01] -z-10" />

              {/* Artwork */}
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

            {/* CARD FOOTER: DADOS & DUST TEXTURE */}
            <div className="flex justify-between items-end relative z-10 mt-auto">
              
              {/* Faint Texturing Vertical Name */}
              <div className="absolute left-0 bottom-0 select-none pointer-events-none origin-bottom-left -rotate-90 -translate-y-4 translate-x-2">
                <span className="text-[2.2rem] md:text-[2.8rem] font-black tracking-widest text-white/[0.06] uppercase font-sans whitespace-nowrap leading-none block">
                  {pokemon.name}
                </span>
              </div>

              {/* Right Side: Category & physical metrics */}
              <div className="ml-auto text-right space-y-1.5 font-mono">
                <div className="text-[9px] text-white/70 tracking-wider uppercase font-black">
                  {pokemon.category}
                </div>
                
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

        {/* RIGHT COLUMN: HIGH-TECH CYBER COMBAT CONSOLE TAB DETAILS */}
        <div className="flex-[1.2] flex flex-col p-6 md:p-8 md:pl-4 z-10 relative">
          
          {/* Universal Close button - Highly visible and sleek */}
          <button
            onClick={onRequestClose}
            className="absolute top-4 right-4 p-2 rounded-full border border-white/10 bg-[#040714]/85 backdrop-blur-md text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer z-50 shadow-md"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Cyber Menu Tabs (Controller Neon Buttons look!) */}
          <div
            role="tablist"
            aria-label="Seções do Pokémon"
            className="flex gap-2 border-b border-white/10 pb-4 mb-6 mt-2 md:mt-0">
            {(['about', 'stats', 'moves'] as const).map((tab) => {
              const isActive = activeTab === tab
              const tabLabels = { about: 'Sobre', stats: 'Combate', moves: 'Golpes' }

              return (
                <button
                  key={tab}
                  role="tab"
                  id={`tab-${tab}`}
                  aria-selected={isActive}
                  aria-controls={`tabpanel-${tab}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveTab(tab)}
                  onKeyDown={e => {
                    const order = ['about', 'stats', 'moves'] as const
                    const idx = order.indexOf(tab)
                    if (e.key === 'ArrowRight') {
                      e.preventDefault()
                      setActiveTab(order[(idx + 1) % order.length])
                    } else if (e.key === 'ArrowLeft') {
                      e.preventDefault()
                      setActiveTab(order[(idx - 1 + order.length) % order.length])
                    }
                  }}
                  className={`flex-1 md:flex-none px-4 py-2.5 text-xs font-black tracking-widest uppercase rounded-xl transition-all duration-300 active:scale-95 cursor-pointer border focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary ${
                    isActive
                      ? `${style.bg} ${style.text} ${style.border} shadow-glow-default scale-102`
                      : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border-white/5'
                  }`}
                >
                  {tabLabels[tab]}
                </button>
              )
            })}
          </div>

          {/* Tab Panel Terminals */}
          <div className="flex-1 flex flex-col justify-start min-h-[260px] md:min-h-0 bg-slate-950/40 border border-white/5 rounded-3xl p-5 md:p-6 shadow-inner relative overflow-hidden">
            
            {/* Ambient console cyber mesh backdrop */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

            {/* TAB: ABOUT (Holographic database terminal) */}
            {activeTab === 'about' && (
              <div
                role="tabpanel"
                id="tabpanel-about"
                aria-labelledby="tab-about"
                className="space-y-4 md:space-y-5 animate-fadeIn relative z-10">
                
                {/* Description holographic terminal cell */}
                <div className="relative p-4 rounded-2xl border-l-4 border-secondary bg-secondary/5 border-y border-r border-secondary/15 backdrop-blur-md overflow-hidden">
                  <div className="absolute right-3 bottom-3 text-secondary/5 pointer-events-none">
                    <Compass className="w-16 h-16" />
                  </div>
                  <div className="text-[9px] font-black text-secondary tracking-widest uppercase mb-1.5 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 animate-spin-slow" /> BANCO DE PESQUISAS // DADOS OFICIAIS
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed italic">
                    "{pokemon.description}"
                  </p>
                </div>

                {/* Additional metrics inside cyber cells */}
                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="text-[9px] text-slate-500 font-black uppercase">TAXA DE CAPTURA</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm font-black text-white">{pokemon.capture_rate} / 255</span>
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                        {Math.round((pokemon.capture_rate / 255) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="text-[9px] text-slate-500 font-black uppercase">FELICIDADE BASE</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm font-black text-white">{pokemon.base_happiness}</span>
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-secondary/10 text-secondary">
                        RATING
                      </span>
                    </div>
                  </div>
                </div>

                {/* Technical metadata capsules */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono text-center">
                  <div className="px-4 py-2.5 rounded-xl border border-white/5 bg-white/[0.02]">
                    <span className="text-slate-500 uppercase text-[9px] block">Nº ORDEM POKEDEX</span>
                    <span className="font-black text-white text-sm">#{pokemon.order || pokemon.id}</span>
                  </div>
                  <div className="px-4 py-2.5 rounded-xl border border-white/5 bg-white/[0.02]">
                    <span className="text-slate-500 uppercase text-[9px] block">ESPÉCIE POKÉMON</span>
                    <span className="font-black text-white text-sm capitalize">{pokemon.species?.name || pokemon.name}</span>
                  </div>
                </div>

              </div>
            )}

            {/* TAB: COMBAT STATS (Reactor status console!) */}
            {activeTab === 'stats' && (
              <div
                role="tabpanel"
                id="tabpanel-stats"
                aria-labelledby="tab-stats"
                className="space-y-4 animate-fadeIn relative z-10">
                
                {/* Grand Combat Index Power Level Radar Badge (Dragon Ball look!) */}
                <div className="flex items-center justify-between p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 relative overflow-hidden shadow-glow-electric/5">
                  <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Star className="w-5 h-5 fill-amber-500/20 animate-spin-slow" />
                    </div>
                    <div>
                      <div className="text-[9px] text-amber-500/80 font-black tracking-widest uppercase">POWER LEVEL // ATRIBUTOS GERAIS</div>
                      <div className="text-xs text-slate-400 font-mono">Índice Total de Combate</div>
                    </div>
                  </div>
                  <div className="text-3xl font-black text-amber-400 tracking-widest font-mono drop-shadow-[0_2px_8px_rgba(245,158,11,0.3)] animate-pulse">
                    {totalStats}
                  </div>
                </div>

                {/* Grid of Custom Combat Stat Cards (Vibrant Reactor styling!) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pokemon.stats.map((stat: any) => {
                    const normName = stat.name.toLowerCase()
                    const config = statCardConfig[normName] || { icon: Star, label: stat.name, color: 'text-slate-300', gradient: 'from-slate-500 to-slate-400' }
                    const IconComponent = config.icon
                    const percent = getStatPercent(stat.base_stat)

                    return (
                      <div 
                        key={stat.name}
                        className="p-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between space-y-2.5 hover:bg-white/10 hover:border-white/10 hover:shadow-glow-default transition-all duration-300"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className={`p-2 rounded-xl bg-white/5 border border-white/5 ${config.color}`}>
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest font-mono">
                              {config.label}
                            </span>
                          </div>
                          <span className="text-base font-black text-white font-mono leading-none">
                            {stat.base_stat}
                          </span>
                        </div>

                        {/* Reactor thick custom gradient progress bar */}
                        <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden border border-white/5">
                          <div 
                            className={`h-full rounded-full bg-gradient-to-r ${config.gradient} transition-all duration-1000 ease-out`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>

              </div>
            )}

            {/* TAB: MOVES (Futuristic Weapons Grid Matrix!) */}
            {activeTab === 'moves' && (
              <div
                role="tabpanel"
                id="tabpanel-moves"
                aria-labelledby="tab-moves"
                className="relative flex-1 min-h-[180px] md:min-h-0 relative z-10">
                <div className="absolute inset-0 overflow-y-auto pr-1.5 space-y-2 max-h-[220px] md:max-h-[250px] custom-scrollbar">
                  <div className="grid grid-cols-2 gap-2">
                    {pokemon.moves.map((move: any) => (
                      <div
                        key={move.name}
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-white/5 bg-white/5 text-[10px] font-mono text-white capitalize hover:bg-white/10 hover:border-white/10 transition-all select-none cursor-default"
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <div className={`w-1.5 h-1.5 rounded-full ${style.bg} shadow-sm animate-pulse`} />
                          <span className="truncate">{move.name.replace('-', ' ')}</span>
                        </div>
                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-white/10 text-white/50 tracking-wider">
                          LVL
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Action Footer */}
          <div className="border-t border-white/10 pt-4 mt-5 flex flex-col sm:flex-row gap-3 justify-end relative z-10 w-full">
            <Link
              href={`/pokemon/${pokemon.id}`}
              onClick={onRequestClose}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-slate-950 bg-gradient-to-r from-secondary to-accent hover:scale-[1.02] hover:shadow-glow-cyan/20 active:scale-95 transition-all cursor-pointer text-center select-none"
            >
              Ficha Completa // Ver Mais
            </Link>
            <button
              onClick={onRequestClose}
              className="px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-slate-400 bg-white/5 border border-white/10 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer text-center select-none"
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
