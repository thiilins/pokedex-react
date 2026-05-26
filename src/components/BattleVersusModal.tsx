import React, { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { X, Swords, Trophy, Activity, Heart, Shield, Zap, ShieldAlert, Gauge, Star, Volume2 } from 'lucide-react'
import PokemonTypeIcon, { typeStylingMap } from './PokemonTypeIcon'

interface IProps {
  pokemonA: any
  pokemonB: any
  isOpen: boolean
  onClose: () => void
  allPokemons?: any[]
  pokemonCache?: Record<string, any>
  onDataLoaded?: (id: string, data: any) => void
  onSelectSlot?: (slot: 'A' | 'B', id: string | null) => void
}

// 1. FIGHTER SELECTOR COMPONENT (Direct Selection in Arena!)
const FighterSelector: React.FC<{
  slot: 'A' | 'B'
  allPokemons: any[]
  pokemonCache: Record<string, any>
  onSelect: (id: string) => void
}> = ({ slot, allPokemons, pokemonCache, onSelect }) => {
  const [query, setQuery] = useState('')
  
  const filtered = useMemo(() => {
    if (!query.trim()) return allPokemons.slice(0, 30) // First 30
    const q = query.toLowerCase().trim()
    return allPokemons.filter(
      (p) => p.name.toLowerCase().includes(q) || p.id.toString() === q
    ).slice(0, 30) // Limit to 30 for high performance
  }, [allPokemons, query])

  return (
    <div className="w-full h-full flex flex-col justify-between p-5 rounded-3xl bg-slate-950/60 border border-white/5 relative min-h-[380px] sm:min-h-[420px] select-none text-left">
      <div className="space-y-4 flex-1 flex flex-col">
        <div className="space-y-1">
          <div className="text-[9px] font-mono font-black text-secondary tracking-widest uppercase">
            LUTADOR {slot} // SELEÇÃO
          </div>
          <h4 className="text-sm font-black text-white uppercase tracking-wider">
            Escolha o Combatente
          </h4>
        </div>

        {/* Search input in the card */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por nome ou ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-3 pr-8 py-2 text-xs rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:border-secondary focus:bg-white/10 transition-all font-mono"
          />
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto max-h-[220px] border border-white/5 bg-slate-950/40 rounded-xl p-2 space-y-1 custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="text-[10px] text-slate-600 font-mono py-6 text-center">Nenhum Pokémon encontrado.</div>
          ) : (
            filtered.map((p) => {
              const cached = pokemonCache[p.id]
              const displayTypes = cached ? cached.types.map((t: any) => t.name) : []

              return (
                <button
                  key={p.id}
                  onClick={() => onSelect(p.id)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left bg-white/[0.02] border border-white/5 hover:bg-secondary/15 hover:border-secondary/30 text-white hover:text-white transition-all text-xs font-mono group cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[9px] text-slate-500 group-hover:text-slate-400">
                      #{String(p.id).padStart(4, '0')}
                    </span>
                    <span className="capitalize font-sans font-bold group-hover:text-secondary truncate">
                      {p.name}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {displayTypes.map((type: string) => (
                      <span key={type} className="text-[7px] font-black uppercase px-1 py-0.5 rounded bg-white/10 text-white/70">
                        {type}
                      </span>
                    ))}
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-white/5 text-center">
        <span className="text-[8px] text-slate-500 font-mono uppercase tracking-wider">
          Total: 1025 monstrinhos
        </span>
      </div>
    </div>
  )
}

// 2. FIGHTER LOADER SPINNING CARD
const FighterLoader: React.FC<{ slot: 'A' | 'B' }> = ({ slot }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-950/60 border border-white/5 min-h-[380px] sm:min-h-[420px]">
      <div className="relative w-10 h-10 border-2 border-white/5 border-t-secondary rounded-full animate-spin shadow-glow-cyan/25" />
      <span className="text-[9px] text-slate-400 font-mono tracking-widest uppercase mt-4 animate-pulse">
        Carregando Lutador {slot}...
      </span>
    </div>
  )
}

// MAIN ARENA COMPONENT
const BattleVersusModal: React.FC<IProps> = ({
  pokemonA,
  pokemonB,
  isOpen,
  onClose,
  allPokemons = [],
  pokemonCache = {},
  onSelectSlot
}) => {
  const [isRendered, setIsRendered] = useState(false)

  // Track if slot has selection but details are not loaded in cache yet
  const [selectedSlotA, setSelectedSlotA] = useState<string | null>(null)
  const [selectedSlotB, setSelectedSlotB] = useState<string | null>(null)

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

  // Sync internal slot selections with parent props when they are populated
  useEffect(() => {
    if (pokemonA) setSelectedSlotA(pokemonA.id.toString())
  }, [pokemonA])

  useEffect(() => {
    if (pokemonB) setSelectedSlotB(pokemonB.id.toString())
  }, [pokemonB])

  if (!isOpen && !isRendered) return null

  // Calculate totals safely
  const totalA = pokemonA?.stats ? pokemonA.stats.reduce((acc: number, curr: any) => acc + curr.base_stat, 0) : 0
  const totalB = pokemonB?.stats ? pokemonB.stats.reduce((acc: number, curr: any) => acc + curr.base_stat, 0) : 0

  const typeA = pokemonA?.types?.[0]?.name?.toLowerCase() || 'normal'
  const styleA = typeStylingMap[typeA] || typeStylingMap.normal

  const typeB = pokemonB?.types?.[0]?.name?.toLowerCase() || 'normal'
  const styleB = typeStylingMap[typeB] || typeStylingMap.normal

  // Find Winner of a specific stat safely
  const getStatWinner = (statName: string) => {
    if (!pokemonA?.stats || !pokemonB?.stats) return 'TIE'
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

  const handleSelectFighter = (slot: 'A' | 'B', id: string) => {
    if (slot === 'A') {
      setSelectedSlotA(id)
    } else {
      setSelectedSlotB(id)
    }
    if (onSelectSlot) {
      onSelectSlot(slot, id)
    }
  }

  const handleClearFighter = (slot: 'A' | 'B') => {
    if (slot === 'A') {
      setSelectedSlotA(null)
    } else {
      setSelectedSlotB(null)
    }
    if (onSelectSlot) {
      onSelectSlot(slot, null)
    }
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
        className={`relative w-full max-w-5xl rounded-[36px] border border-white/10 bg-gradient-to-b from-[#030616]/95 via-[#080d24]/98 to-[#030616]/95 backdrop-blur-2xl overflow-y-auto max-h-[92vh] md:max-h-[85vh] shadow-2xl p-5 md:p-10 flex flex-col justify-between transition-all duration-300 z-10 ${
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
        <div className="text-center space-y-2 mb-5 md:mb-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black bg-header/10 text-header border border-header/20 tracking-widest uppercase">
            <Swords className="w-4 h-4" /> Arena de Duelo Pokémon
          </div>
          <h2 className="text-xl md:text-3xl font-black uppercase tracking-[0.1em] bg-clip-text text-transparent bg-gradient-to-r from-secondary via-accent to-header">
            CONFRONTO DE ATRIBUTOS
          </h2>
        </div>

        {/* MAIN DUEL LAYOUT */}
        <div className="flex flex-col lg:flex-row items-stretch gap-6 flex-1 relative z-10 mb-6">
          
          {/* LEFT CHAMPION: SLOT A */}
          <div className="flex-1 flex flex-col items-center justify-center">
            {!selectedSlotA ? (
              <FighterSelector 
                slot="A" 
                allPokemons={allPokemons} 
                pokemonCache={pokemonCache} 
                onSelect={(id) => handleSelectFighter('A', id)} 
              />
            ) : !pokemonA ? (
              <FighterLoader slot="A" />
            ) : (
              <div className="flex-1 w-full flex flex-col items-center justify-between text-center space-y-4 relative p-5 rounded-3xl bg-white/5 border border-white/5 overflow-hidden min-h-[380px] sm:min-h-[420px]">
                {/* Type-based aura orb */}
                <div className={`absolute w-48 h-48 rounded-full ${styleA.bg} filter blur-[60px] opacity-20 -z-10 animate-pulse-glow`} />
                <div className="absolute -left-6 bottom-4 text-[6rem] font-black font-noto text-white/[0.02] pointer-events-none uppercase">
                  {pokemonA.japan_name}
                </div>

                {/* Slot header controller */}
                <div className="w-full flex justify-between items-center relative z-10">
                  {totalA > totalB && pokemonB && (
                    <span className="flex items-center gap-1.5 text-[9px] font-black tracking-widest text-secondary uppercase px-2.5 py-0.5 rounded-full bg-secondary/10 border border-secondary/20 shadow-glow-cyan/20 animate-pulse">
                      <Trophy className="w-3 h-3 fill-secondary" /> Favorito
                    </span>
                  )}
                  {!(totalA > totalB && pokemonB) && <div />}

                  <button
                    onClick={() => handleClearFighter('A')}
                    className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/55 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer select-none"
                  >
                    Trocar Lutador
                  </button>
                </div>

                <div className="relative w-32 h-32 md:w-36 md:h-36 drop-shadow-[0_12px_20px_rgba(0,0,0,0.65)] hover:scale-105 transition-transform duration-500 animate-float my-2">
                  <Image
                    src={pokemonA.image}
                    alt={pokemonA.name}
                    fill
                    sizes="(max-width: 768px) 128px, 144px"
                    className="object-contain"
                  />
                </div>

                <div className="space-y-1.5 relative z-10">
                  <span className="text-[10px] font-mono text-white/30 tracking-wider">#{String(pokemonA.id).padStart(4, '0')}</span>
                  <div className="flex items-center justify-center gap-2">
                    <h3 className="text-xl font-black capitalize text-white tracking-wide">{pokemonA.name}</h3>
                    {pokemonA.cries?.latest && (
                      <button
                        onClick={() => {
                          const audio = new Audio(pokemonA.cries.latest)
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
                  <div className="flex justify-center gap-1">
                    {pokemonA.types.map((t: any) => (
                      <PokemonTypeIcon key={t.id} type={t.name} className="px-2 py-0.5 text-[9px]" />
                    ))}
                  </div>
                </div>

                {/* Total score box */}
                <div className="px-5 py-2 rounded-xl border border-white/5 bg-slate-950/40 text-center w-full max-w-[150px] relative z-10 mt-2">
                  <div className="text-[8px] text-slate-500 font-black uppercase tracking-wider">Combat Power</div>
                  <div className="text-base font-black text-secondary font-mono leading-none mt-1">{totalA}</div>
                </div>
              </div>
            )}
          </div>

          {/* MIDDLE COLUMN: VS COMPARISON PANEL */}
          <div className="flex-[1.2] w-full flex flex-col justify-center space-y-4 md:space-y-5">
            {pokemonA && pokemonB ? (
              Object.keys(statNameMap).map((statKey) => {
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
                        {winner === 'A' && <Trophy className="w-3 h-3 text-secondary animate-pulse" />}
                      </div>
                      
                      {/* Centered stat badge */}
                      <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-white/5 border border-white/5">
                        <IconComponent className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{config.label}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {winner === 'B' && <Trophy className="w-3 h-3 text-header animate-pulse" />}
                        <span className={`font-black ${winner === 'B' ? 'text-header' : 'text-slate-400'}`}>{valB}</span>
                      </div>
                    </div>

                    {/* Bipolar Dual Progress Bar */}
                    <div className="flex gap-1 items-center w-full">
                      {/* Left bar (A) - grows from right to left */}
                      <div className="flex-1 h-2.5 bg-white/5 rounded-l-full overflow-hidden flex justify-end border border-white/5">
                        <div 
                          className={`h-full rounded-l-full ${styleA.bg} transition-all duration-1000 ease-out`}
                          style={{ width: `${percentA}%` }}
                        />
                      </div>
                      
                      {/* Central division dot */}
                      <div className="w-1 h-2.5 rounded-full bg-white/20" />

                      {/* Right bar (B) - grows from left to right */}
                      <div className="flex-1 h-2.5 bg-white/5 rounded-r-full overflow-hidden flex justify-start border border-white/5">
                        <div 
                          className={`h-full rounded-r-full ${styleB.bg} transition-all duration-1000 ease-out`}
                          style={{ width: `${percentB}%` }}
                        />
                      </div>
                    </div>

                  </div>
                )
              })
            ) : (
              <div className="h-full min-h-[220px] lg:min-h-0 flex-1 flex flex-col items-center justify-center p-8 border border-white/5 rounded-3xl bg-slate-950/30 text-center space-y-4">
                <div className="p-3 rounded-2xl bg-white/5 text-slate-500 border border-white/5">
                  <Swords className="w-8 h-8 animate-pulse text-slate-400" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest font-mono">Simulador de Atributos</div>
                  <p className="text-xs text-slate-400 max-w-xs mt-1.5 leading-relaxed">
                    Selecione Pokémons nas laterais para carregar as estatísticas e simular o combate de atributos.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT CHAMPION: SLOT B */}
          <div className="flex-1 flex flex-col items-center justify-center">
            {!selectedSlotB ? (
              <FighterSelector 
                slot="B" 
                allPokemons={allPokemons} 
                pokemonCache={pokemonCache} 
                onSelect={(id) => handleSelectFighter('B', id)} 
              />
            ) : !pokemonB ? (
              <FighterLoader slot="B" />
            ) : (
              <div className="flex-1 w-full flex flex-col items-center justify-between text-center space-y-4 relative p-5 rounded-3xl bg-white/5 border border-white/5 overflow-hidden min-h-[380px] sm:min-h-[420px]">
                {/* Type-based aura orb */}
                <div className={`absolute w-48 h-48 rounded-full ${styleB.bg} filter blur-[60px] opacity-20 -z-10 animate-pulse-glow`} />
                <div className="absolute -right-6 bottom-4 text-[6rem] font-black font-noto text-white/[0.02] pointer-events-none uppercase">
                  {pokemonB.japan_name}
                </div>

                {/* Slot header controller */}
                <div className="w-full flex justify-between items-center relative z-10">
                  {totalB > totalA && pokemonA && (
                    <span className="flex items-center gap-1.5 text-[9px] font-black tracking-widest text-header uppercase px-2.5 py-0.5 rounded-full bg-header/10 border border-header/20 shadow-glow-pink/20 animate-pulse">
                      <Trophy className="w-3 h-3 fill-header" /> Favorito
                    </span>
                  )}
                  {!(totalB > totalA && pokemonA) && <div />}

                  <button
                    onClick={() => handleClearFighter('B')}
                    className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/55 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer select-none"
                  >
                    Trocar Lutador
                  </button>
                </div>

                <div className="relative w-32 h-32 md:w-36 md:h-36 drop-shadow-[0_12px_20px_rgba(0,0,0,0.65)] hover:scale-105 transition-transform duration-500 animate-float my-2">
                  <Image
                    src={pokemonB.image}
                    alt={pokemonB.name}
                    fill
                    sizes="(max-width: 768px) 128px, 144px"
                    className="object-contain"
                  />
                </div>

                <div className="space-y-1.5 relative z-10">
                  <span className="text-[10px] font-mono text-white/30 tracking-wider">#{String(pokemonB.id).padStart(4, '0')}</span>
                  <div className="flex items-center justify-center gap-2">
                    <h3 className="text-xl font-black capitalize text-white tracking-wide">{pokemonB.name}</h3>
                    {pokemonB.cries?.latest && (
                      <button
                        onClick={() => {
                          const audio = new Audio(pokemonB.cries.latest)
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
                  <div className="flex justify-center gap-1">
                    {pokemonB.types.map((t: any) => (
                      <PokemonTypeIcon key={t.id} type={t.name} className="px-2 py-0.5 text-[9px]" />
                    ))}
                  </div>
                </div>

                {/* Total score box */}
                <div className="px-5 py-2 rounded-xl border border-white/5 bg-slate-950/40 text-center w-full max-w-[150px] relative z-10 mt-2">
                  <div className="text-[8px] text-slate-500 font-black uppercase tracking-wider">Combat Power</div>
                  <div className="text-base font-black text-header font-mono leading-none mt-1">{totalB}</div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* COMBAT CONCLUSION ROW */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
          
          {/* Winner announcement */}
          {pokemonA && pokemonB ? (
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-glow-electric">
                <Star className="w-6 h-6 fill-slate-950 animate-pulse" />
              </div>
              <div className="text-left">
                <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Resultado Final da Batalha</div>
                <div className="text-base md:text-lg font-black text-white uppercase tracking-wide">
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
          ) : (
            <div className="flex items-center gap-2.5 text-slate-500 font-mono text-[9px] uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-500"></span>
              </span>
              <span>Aguardando seleção de ambos os lutadores...</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={onClose}
              className="flex-1 md:flex-none px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-white bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 transition-all cursor-pointer select-none"
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
