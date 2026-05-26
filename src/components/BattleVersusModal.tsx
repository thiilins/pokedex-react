import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, Swords, Trophy, Award, Activity, Heart, Shield, Zap, ShieldAlert, Gauge, Star } from 'lucide-react'
import PokemonTypeIcon, { typeStylingMap } from './PokemonTypeIcon'

interface IProps {
  pokemonA: any
  pokemonB: any
  isOpen: boolean
  onClose: () => void
}

const BattleVersusModal: React.FC<IProps> = ({
  pokemonA,
  pokemonB,
  isOpen,
  onClose
}) => {
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

  // Calculate totals
  const totalA = pokemonA.stats.reduce((acc: number, curr: any) => acc + curr.base_stat, 0)
  const totalB = pokemonB.stats.reduce((acc: number, curr: any) => acc + curr.base_stat, 0)

  const typeA = pokemonA.types[0]?.name.toLowerCase() || 'normal'
  const styleA = typeStylingMap[typeA] || typeStylingMap.normal

  const typeB = pokemonB.types[0]?.name.toLowerCase() || 'normal'
  const styleB = typeStylingMap[typeB] || typeStylingMap.normal

  // Find Winner of a specific stat
  const getStatWinner = (statName: string) => {
    const statA = pokemonA.stats.find((s: any) => s.name.toLowerCase() === statName)?.base_stat || 0
    const statB = pokemonB.stats.find((s: any) => s.name.toLowerCase() === statName)?.base_stat || 0
    if (statA > statB) return 'A'
    if (statB > statA) return 'B'
    return 'TIE'
  }

  const statNameMap: Record<string, { label: string, icon: React.FC<any> }> = {
    hp: { label: 'HP / Vida', icon: Heart },
    attack: { label: 'Ataque', icon: Swords },
    defense: { label: 'Defesa', icon: Shield },
    'special-attack': { label: 'Atq. Esp.', icon: Zap },
    'special-defense': { label: 'Def. Esp.', icon: ShieldAlert },
    speed: { label: 'Velocidade', icon: Gauge }
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 transition-all duration-300 ${
        isOpen ? 'opacity-100 backdrop-blur-md' : 'opacity-0 backdrop-blur-none pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/90" onClick={onClose} />

      {/* Cyber Combat Arena Container */}
      <div
        className={`relative w-full max-w-5xl rounded-[36px] border border-white/10 bg-gradient-to-b from-[#030616]/95 via-[#080d24]/98 to-[#030616]/95 backdrop-blur-2xl overflow-y-auto max-h-[92vh] md:max-h-[85vh] shadow-2xl p-6 md:p-10 flex flex-col justify-between transition-all duration-300 z-10 ${
          isOpen ? 'scale-100 translate-y-0 shadow-[0_0_80px_rgba(0,240,255,0.3)]' : 'scale-95 translate-y-4'
        }`}
      >
        {/* Arena Grid Backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-full border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER SECTION (Battle Status) */}
        <div className="text-center space-y-2 mb-6 md:mb-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black bg-header/10 text-header border border-header/20 tracking-widest uppercase">
            <Swords className="w-4 h-4 animate-bounce-slow" /> Arena de Duelo Pokémon
          </div>
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-[0.1em] bg-clip-text text-transparent bg-gradient-to-r from-secondary via-accent to-header">
            CONFRONTO DE ATRIBUTOS
          </h2>
        </div>

        {/* MAIN DUEL LAYOUT */}
        <div className="flex flex-col lg:flex-row items-center gap-8 flex-1 relative z-10 mb-6">
          
          {/* LEFT CHAMPION: POKEMON A */}
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 relative w-full p-4 rounded-3xl bg-white/5 border border-white/5 overflow-hidden">
            
            {/* Type-based aura orb */}
            <div className={`absolute w-48 h-48 rounded-full ${styleA.bg} filter blur-[60px] opacity-20 -z-10 animate-pulse-glow`} />
            <div className="absolute -left-6 bottom-4 text-[6rem] font-black font-noto text-white/[0.02] pointer-events-none uppercase">
              {pokemonA.japan_name}
            </div>

            {totalA > totalB && (
              <span className="flex items-center gap-1.5 text-[10px] font-black tracking-widest text-secondary uppercase px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 shadow-glow-cyan/20 animate-pulse">
                <Trophy className="w-3.5 h-3.5 fill-secondary" /> Favorito
              </span>
            )}

            <div className="relative w-36 h-36 md:w-44 md:h-44 drop-shadow-[0_12px_20px_rgba(0,0,0,0.65)] hover:scale-105 transition-transform duration-500 animate-float">
              <Image
                src={pokemonA.image}
                alt={pokemonA.name}
                fill
                sizes="(max-width: 768px) 144px, 176px"
                className="object-contain"
              />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-white/30 tracking-wider">#{String(pokemonA.id).padStart(4, '0')}</span>
              <h3 className="text-xl md:text-2xl font-black capitalize text-white tracking-wide">{pokemonA.name}</h3>
              <div className="flex justify-center gap-1">
                {pokemonA.types.map((t: any) => (
                  <PokemonTypeIcon key={t.id} type={t.name} className="px-2 py-0.5 text-[9px]" />
                ))}
              </div>
            </div>

            {/* Total score box */}
            <div className="px-5 py-2.5 rounded-xl border border-white/5 bg-slate-950/40 text-center w-full max-w-[160px]">
              <div className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Combat Power</div>
              <div className="text-lg font-black text-secondary font-mono">{totalA}</div>
            </div>

          </div>

          {/* MIDDLE COLUMN: VS COMPARISON PANEL */}
          <div className="flex-[1.5] w-full flex flex-col justify-center space-y-4 md:space-y-5">
            
            {/* Stat confrontation rows */}
            {Object.keys(statNameMap).map((statKey) => {
              const config = statNameMap[statKey]
              const IconComponent = config.icon

              const valA = pokemonA.stats.find((s: any) => s.name.toLowerCase() === statKey)?.base_stat || 0
              const valB = pokemonB.stats.find((s: any) => s.name.toLowerCase() === statKey)?.base_stat || 0
              
              const winner = getStatWinner(statKey)

              // Percentage relative to maximum 255
              const percentA = Math.min(Math.round((valA / 255) * 100), 100)
              const percentB = Math.min(Math.round((valB / 255) * 100), 100)

              return (
                <div key={statKey} className="space-y-1.5">
                  
                  {/* Row titles & numbers */}
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className={`font-black ${winner === 'A' ? 'text-secondary' : 'text-slate-400'}`}>{valA}</span>
                      {winner === 'A' && <Trophy className="w-3.5 h-3.5 text-secondary animate-pulse" />}
                    </div>
                    
                    {/* Centered stat badge */}
                    <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-white/5 border border-white/5">
                      <IconComponent className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{config.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {winner === 'B' && <Trophy className="w-3.5 h-3.5 text-header animate-pulse" />}
                      <span className={`font-black ${winner === 'B' ? 'text-header' : 'text-slate-400'}`}>{valB}</span>
                    </div>
                  </div>

                  {/* Bipolar Dual Progress Bar (Spectacular fighter game select look!) */}
                  <div className="flex gap-1 items-center w-full">
                    {/* Left bar (A) - grows from right to left */}
                    <div className="flex-1 h-3 bg-white/5 rounded-l-full overflow-hidden flex justify-end border border-white/5">
                      <div 
                        className={`h-full rounded-l-full ${styleA.bg} transition-all duration-1000 ease-out`}
                        style={{ width: `${percentA}%` }}
                      />
                    </div>
                    
                    {/* Central division dot */}
                    <div className="w-1.5 h-3 rounded-full bg-white/20" />

                    {/* Right bar (B) - grows from left to right */}
                    <div className="flex-1 h-3 bg-white/5 rounded-r-full overflow-hidden flex justify-start border border-white/5">
                      <div 
                        className={`h-full rounded-r-full ${styleB.bg} transition-all duration-1000 ease-out`}
                        style={{ width: `${percentB}%` }}
                      />
                    </div>
                  </div>

                </div>
              )
            })}

          </div>

          {/* RIGHT CHAMPION: POKEMON B */}
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 relative w-full p-4 rounded-3xl bg-white/5 border border-white/5 overflow-hidden">
            
            {/* Type-based aura orb */}
            <div className={`absolute w-48 h-48 rounded-full ${styleB.bg} filter blur-[60px] opacity-20 -z-10 animate-pulse-glow`} />
            <div className="absolute -right-6 bottom-4 text-[6rem] font-black font-noto text-white/[0.02] pointer-events-none uppercase">
              {pokemonB.japan_name}
            </div>

            {totalB > totalA && (
              <span className="flex items-center gap-1.5 text-[10px] font-black tracking-widest text-header uppercase px-3 py-1 rounded-full bg-header/10 border border-header/20 shadow-glow-pink/20 animate-pulse">
                <Trophy className="w-3.5 h-3.5 fill-header" /> Favorito
              </span>
            )}

            <div className="relative w-36 h-36 md:w-44 md:h-44 drop-shadow-[0_12px_20px_rgba(0,0,0,0.65)] hover:scale-105 transition-transform duration-500 animate-float">
              <Image
                src={pokemonB.image}
                alt={pokemonB.name}
                fill
                sizes="(max-width: 768px) 144px, 176px"
                className="object-contain"
              />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-white/30 tracking-wider">#{String(pokemonB.id).padStart(4, '0')}</span>
              <h3 className="text-xl md:text-2xl font-black capitalize text-white tracking-wide">{pokemonB.name}</h3>
              <div className="flex justify-center gap-1">
                {pokemonB.types.map((t: any) => (
                  <PokemonTypeIcon key={t.id} type={t.name} className="px-2 py-0.5 text-[9px]" />
                ))}
              </div>
            </div>

            {/* Total score box */}
            <div className="px-5 py-2.5 rounded-xl border border-white/5 bg-slate-950/40 text-center w-full max-w-[160px]">
              <div className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Combat Power</div>
              <div className="text-lg font-black text-header font-mono">{totalB}</div>
            </div>

          </div>

        </div>

        {/* COMBAT CONCLUSION ROW */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
          
          {/* Winner announcement */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-glow-electric">
              <Star className="w-6 h-6 fill-slate-950" />
            </div>
            <div>
              <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Resultado Final da Batalha</div>
              <div className="text-lg font-black text-white uppercase tracking-wide">
                {totalA > totalB ? (
                  <span>🏆 <span className="text-secondary capitalize">{pokemonA.name}</span> é o Vencedor!</span>
                ) : totalB > totalA ? (
                  <span>🏆 <span className="text-header capitalize">{pokemonB.name}</span> é o Vencedor!</span>
                ) : (
                  <span>⚔️ Empate Técnico Perfeito!</span>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={onClose}
              className="flex-1 md:flex-none px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-white bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
            >
              Fechar Arena
            </button>
          </div>

        </div>

      </div>
    </div>
  )
}

export default BattleVersusModal
