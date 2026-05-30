import React, { useState, useEffect, useMemo, useRef } from 'react'
import Image from 'next/image'
import { X, Swords, Trophy, Heart, Shield, Zap, ShieldAlert, Gauge, Star, Volume2, Play, Pause, RotateCcw, Gamepad2, Cpu } from 'lucide-react'
import PokemonTypeIcon, { typeStylingMap } from './PokemonTypeIcon'
import { getTypeEffectiveness, PokemonType } from '@/utils/typeMatchups'

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

// 3. DICTIONARY OF POPULAR FALLBACK MOVES
const POPULAR_MOVES: Record<string, { power: number, accuracy: number, pp: number, damageClass: 'physical' | 'special', type: string }> = {
  tackle: { power: 40, accuracy: 100, pp: 35, damageClass: 'physical', type: 'normal' },
  scratch: { power: 40, accuracy: 100, pp: 35, damageClass: 'physical', type: 'normal' },
  pound: { power: 40, accuracy: 100, pp: 35, damageClass: 'physical', type: 'normal' },
  'quick-attack': { power: 40, accuracy: 100, pp: 30, damageClass: 'physical', type: 'normal' },
  thunderbolt: { power: 90, accuracy: 100, pp: 15, damageClass: 'special', type: 'electric' },
  thunder: { power: 110, accuracy: 70, pp: 10, damageClass: 'special', type: 'electric' },
  'thunder-shock': { power: 40, accuracy: 100, pp: 30, damageClass: 'special', type: 'electric' },
  flamethrower: { power: 90, accuracy: 100, pp: 15, damageClass: 'special', type: 'fire' },
  'fire-blast': { power: 110, accuracy: 85, pp: 5, damageClass: 'special', type: 'fire' },
  ember: { power: 40, accuracy: 100, pp: 25, damageClass: 'special', type: 'fire' },
  surf: { power: 90, accuracy: 100, pp: 15, damageClass: 'special', type: 'water' },
  'hydro-pump': { power: 110, accuracy: 80, pp: 5, damageClass: 'special', type: 'water' },
  'water-gun': { power: 40, accuracy: 100, pp: 25, damageClass: 'special', type: 'water' },
  'giga-drain': { power: 75, accuracy: 100, pp: 10, damageClass: 'special', type: 'grass' },
  'solar-beam': { power: 120, accuracy: 100, pp: 10, damageClass: 'special', type: 'grass' },
  'vine-whip': { power: 45, accuracy: 100, pp: 25, damageClass: 'physical', type: 'grass' },
  psychic: { power: 90, accuracy: 100, pp: 10, damageClass: 'special', type: 'psychic' },
  psybeam: { power: 65, accuracy: 100, pp: 20, damageClass: 'special', type: 'psychic' },
  'ice-beam': { power: 90, accuracy: 100, pp: 10, damageClass: 'special', type: 'ice' },
  blizzard: { power: 110, accuracy: 70, pp: 5, damageClass: 'special', type: 'ice' },
  earthquake: { power: 100, accuracy: 100, pp: 10, damageClass: 'physical', type: 'ground' },
  'earth-power': { power: 90, accuracy: 100, pp: 10, damageClass: 'special', type: 'ground' },
  'body-slam': { power: 85, accuracy: 100, pp: 15, damageClass: 'physical', type: 'normal' },
  'hyper-beam': { power: 150, accuracy: 90, pp: 5, damageClass: 'special', type: 'normal' },
  'air-slash': { power: 75, accuracy: 95, pp: 15, damageClass: 'special', type: 'flying' },
  'wing-attack': { power: 60, accuracy: 100, pp: 35, damageClass: 'physical', type: 'flying' },
  'shadow-ball': { power: 80, accuracy: 100, pp: 15, damageClass: 'special', type: 'ghost' },
  'dark-pulse': { power: 80, accuracy: 100, pp: 15, damageClass: 'special', type: 'dark' },
  crunch: { power: 80, accuracy: 100, pp: 15, damageClass: 'physical', type: 'dark' },
  bite: { power: 60, accuracy: 100, pp: 25, damageClass: 'physical', type: 'dark' },
  'close-combat': { power: 120, accuracy: 100, pp: 5, damageClass: 'physical', type: 'fighting' },
  'aura-sphere': { power: 80, accuracy: 100, pp: 20, damageClass: 'special', type: 'fighting' },
  'karate-chop': { power: 50, accuracy: 100, pp: 25, damageClass: 'physical', type: 'fighting' },
  'dragon-pulse': { power: 85, accuracy: 100, pp: 10, damageClass: 'special', type: 'dragon' },
  'dragon-claw': { power: 80, accuracy: 100, pp: 15, damageClass: 'physical', type: 'dragon' },
  outrage: { power: 120, accuracy: 100, pp: 10, damageClass: 'physical', type: 'dragon' },
  'dazzling-gleam': { power: 80, accuracy: 100, pp: 10, damageClass: 'special', type: 'fairy' },
  moonblast: { power: 95, accuracy: 100, pp: 15, damageClass: 'special', type: 'fairy' },
  'flash-cannon': { power: 80, accuracy: 100, pp: 10, damageClass: 'special', type: 'steel' },
  'iron-head': { power: 80, accuracy: 100, pp: 15, damageClass: 'physical', type: 'steel' },
  'sludge-bomb': { power: 90, accuracy: 100, pp: 10, damageClass: 'special', type: 'poison' },
  'poison-jab': { power: 80, accuracy: 100, pp: 20, damageClass: 'physical', type: 'poison' },
  'bug-buzz': { power: 90, accuracy: 100, pp: 10, damageClass: 'special', type: 'bug' },
  'x-scissor': { power: 80, accuracy: 100, pp: 15, damageClass: 'physical', type: 'bug' },
  'stone-edge': { power: 100, accuracy: 80, pp: 5, damageClass: 'physical', type: 'rock' },
  'rock-slide': { power: 75, accuracy: 90, pp: 10, damageClass: 'physical', type: 'rock' },
}

interface ICombatMove {
  name: string
  power: number
  accuracy: number
  pp: number
  damageClass: 'physical' | 'special'
  type: string
}

// Extract Pokemon stats with robust check
const getBaseStat = (pokemon: any, statName: string): number => {
  if (!pokemon?.stats) return 80
  const stat = pokemon.stats.find((s: any) => s.name.toLowerCase() === statName || s.stat?.name.toLowerCase() === statName)
  return stat ? (stat.base_stat ?? stat.val ?? 80) : 80
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

  // Arena Modes: 'compare' | 'auto' | 'manual'
  const [arenaMode, setArenaMode] = useState<'compare' | 'auto' | 'manual'>('compare')

  // Combat States
  const [battleState, setBattleState] = useState<'idle' | 'running' | 'paused' | 'finished'>('idle')
  const [hpA, setHpA] = useState(100)
  const [hpB, setHpB] = useState(100)
  const [maxHpA, setMaxHpA] = useState(100)
  const [maxHpB, setMaxHpB] = useState(100)
  const [activeTurn, setActiveTurn] = useState<'A' | 'B'>('A')
  const [combatLog, setCombatLog] = useState<{ id: string; text: string; type: 'info' | 'dmg-a' | 'dmg-b' | 'miss' | 'crit' | 'system' }[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const [combatWinner, setCombatWinner] = useState<'A' | 'B' | null>(null)

  // Track if slot has selection but details are not loaded in cache yet
  const [selectedSlotA, setSelectedSlotA] = useState<string | null>(null)
  const [selectedSlotB, setSelectedSlotB] = useState<string | null>(null)

  // Auto simulation timer ref
  const autoSimTimerRef = useRef<NodeJS.Timeout | null>(null)
  const logContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      const timer = setTimeout(() => setIsRendered(false), 300)
      resetBattleState()
      return () => {
        clearTimeout(timer)
        if (autoSimTimerRef.current) clearInterval(autoSimTimerRef.current)
      }
    }
  }, [isOpen])

  // Sync internal slot selections with parent props when they are populated
  useEffect(() => {
    if (pokemonA) setSelectedSlotA(pokemonA.id.toString())
  }, [pokemonA])

  useEffect(() => {
    if (pokemonB) setSelectedSlotB(pokemonB.id.toString())
  }, [pokemonB])

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }, [combatLog])

  if (!isOpen && !isRendered) return null

  // Stats calculation
  const totalA = pokemonA?.stats ? pokemonA.stats.reduce((acc: number, curr: any) => acc + (curr.base_stat ?? curr.val ?? 0), 0) : 0
  const totalB = pokemonB?.stats ? pokemonB.stats.reduce((acc: number, curr: any) => acc + (curr.base_stat ?? curr.val ?? 0), 0) : 0

  const typeA = pokemonA?.types?.[0]?.name?.toLowerCase() || 'normal'
  const styleA = typeStylingMap[typeA] || typeStylingMap.normal

  const typeB = pokemonB?.types?.[0]?.name?.toLowerCase() || 'normal'
  const styleB = typeStylingMap[typeB] || typeStylingMap.normal

  const statNameMap: Record<string, { label: string, icon: React.FC<any> }> = {
    hp: { label: 'HP / Vida', icon: Heart },
    attack: { label: 'Ataque', icon: Swords },
    defense: { label: 'Defesa', icon: Shield },
    'special-attack': { label: 'Atq. Esp.', icon: Zap },
    'special-defense': { label: 'Def. Esp.', icon: ShieldAlert },
    speed: { label: 'Velocidade', icon: Gauge }
  }

  // Find Winner of a specific stat safely
  const getStatWinner = (statName: string) => {
    if (!pokemonA?.stats || !pokemonB?.stats) return 'TIE'
    const statValA = getBaseStat(pokemonA, statName)
    const statValB = getBaseStat(pokemonB, statName)
    if (statValA > statValB) return 'A'
    if (statValB > statValA) return 'B'
    return 'TIE'
  }

  // Resolve equipped and fallback moves
  const getFighterMoves = (pokemon: any): ICombatMove[] => {
    if (!pokemon) return []

    // Use first 4 moves from pokemon's move list with smart attribute resolution
    const pokeMoves = pokemon.moves || []
    const firstFour = pokeMoves.slice(0, 4)
    const pokemonType = pokemon.types?.[0]?.name?.toLowerCase() || 'normal'
    const pokemonAtk = getBaseStat(pokemon, 'attack')
    const pokemonSpAtk = getBaseStat(pokemon, 'special-attack')
    const bestDamageClass = pokemonSpAtk > pokemonAtk ? 'special' : 'physical'

    return firstFour.map((m: any) => {
      const name = m.name || m.move?.name || 'tackle'
      const normName = name.toLowerCase()
      if (POPULAR_MOVES[normName]) {
        return {
          name: name,
          ...POPULAR_MOVES[normName]
        }
      }
      // Balanced dynamic fallback move
      return {
        name: name,
        power: 55,
        accuracy: 95,
        pp: 15,
        damageClass: bestDamageClass,
        type: pokemonType
      }
    })
  }

  const movesA = getFighterMoves(pokemonA)
  const movesB = getFighterMoves(pokemonB)

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
    resetBattleState()
  }

  // BATTLE ENGINE LOGICS

  const resetBattleState = () => {
    if (autoSimTimerRef.current) {
      clearInterval(autoSimTimerRef.current)
      autoSimTimerRef.current = null
    }
    setBattleState('idle')
    setCombatLog([])
    setCombatWinner(null)
    setIsThinking(false)
  }

  const startBattle = (mode: 'auto' | 'manual') => {
    if (!pokemonA || !pokemonB) return
    resetBattleState()
    
    // Scale HP and stats
    const hpValA = getBaseStat(pokemonA, 'hp') * 2 + 110
    const hpValB = getBaseStat(pokemonB, 'hp') * 2 + 110

    setHpA(hpValA)
    setMaxHpA(hpValA)
    setHpB(hpValB)
    setMaxHpB(hpValB)

    // Decidir quem começa com base na velocidade
    const spdA = getBaseStat(pokemonA, 'speed')
    const spdB = getBaseStat(pokemonB, 'speed')
    const goesFirst = spdA >= spdB ? 'A' : 'B'
    setActiveTurn(goesFirst)

    setArenaMode(mode)
    setBattleState('running')

    // Play sounds
    if (pokemonA.cries?.latest) {
      const audio = new Audio(pokemonA.cries.latest)
      audio.volume = 0.25
      audio.play().catch(() => {})
    }

    setCombatLog([
      { id: '1', text: `⚔️ ARENA VERSUS ATIVADA! CONFRONTO INICIADO!`, type: 'system' },
      { id: '2', text: `🛡️ Combatente A: ${pokemonA.name.toUpperCase()} (HP: ${hpValA})`, type: 'info' },
      { id: '3', text: `🛡️ Combatente B: ${pokemonB.name.toUpperCase()} (HP: ${hpValB})`, type: 'info' },
      { id: '4', text: `⚡ ${goesFirst === 'A' ? pokemonA.name.toUpperCase() : pokemonB.name.toUpperCase()} tem maior iniciativa e ataca primeiro!`, type: 'system' }
    ])

    if (mode === 'auto') {
      // Começa loop de auto-simulação
      runAutoBatalhaStep(hpValA, hpValB, goesFirst)
    } else {
      // Modo manual iniciado. Se for o turno da IA (B), executa ação dela
      if (goesFirst === 'B') {
        executaTurnoIA(hpValA, hpValB)
      }
    }
  }

  // Cálculo tático de Dano
  const calculaDano = (atacante: any, defensor: any, move: ICombatMove) => {
    // Stat check
    const atkStat = move.damageClass === 'special' ? getBaseStat(atacante, 'special-attack') + 50 : getBaseStat(atacante, 'attack') + 50
    const defStat = move.damageClass === 'special' ? getBaseStat(defensor, 'special-defense') + 50 : getBaseStat(defensor, 'defense') + 50

    // Matchup multiplier
    const defenderTypeStrings = defensor.types.map((t: any) => t.name)
    const effectivenessMap = getTypeEffectiveness(defenderTypeStrings)
    const typeMult = effectivenessMap[move.type.toLowerCase() as PokemonType] ?? 1.0

    // Random check accuracy
    const rollAcc = Math.random() * 100
    if (rollAcc > move.accuracy) {
      return { damage: 0, isMiss: true, isCrit: false, multiplier: typeMult }
    }

    // Critical roll (6.25%)
    const isCrit = Math.random() < 0.0625
    const critMult = isCrit ? 1.5 : 1.0

    // Standard formula modified
    const baseDmg = (((2 * 50 / 5 + 2) * move.power * (atkStat / defStat)) / 50 + 2)
    const randomFactor = 0.85 + Math.random() * 0.15
    const finalDmg = Math.floor(baseDmg * typeMult * critMult * randomFactor)

    return { damage: Math.max(1, finalDmg), isMiss: false, isCrit, multiplier: typeMult }
  }

  // Escolha ótima de movimento para simulação rápida ou IA
  const escolheMelhorGolpe = (atacante: any, defensor: any, moves: ICombatMove[]): ICombatMove => {
    if (moves.length === 0) return { name: 'tackle', power: 40, accuracy: 100, pp: 35, damageClass: 'physical', type: 'normal' }
    
    // Choose move that yields maximum potential damage
    let bestMove = moves[0]
    let maxEst = -1

    moves.forEach(m => {
      const defenderTypeStrings = defensor.types.map((t: any) => t.name)
      const effectivenessMap = getTypeEffectiveness(defenderTypeStrings)
      const mult = effectivenessMap[m.type.toLowerCase() as PokemonType] ?? 1.0
      
      const dmgClass = m.damageClass === 'special' ? 'special-attack' : 'attack'
      const atkVal = getBaseStat(atacante, dmgClass)
      const estDmg = m.power * atkVal * mult
      
      if (estDmg > maxEst) {
        maxEst = estDmg
        bestMove = m
      }
    })

    return bestMove
  }

  // Loop de Auto Batalha
  const runAutoBatalhaStep = (currentHpA: number, currentHpB: number, turn: 'A' | 'B') => {
    let hpNowA = currentHpA
    let hpNowB = currentHpB
    let nextTurn = turn

    autoSimTimerRef.current = setInterval(() => {
      if (hpNowA <= 0 || hpNowB <= 0) {
        if (autoSimTimerRef.current) {
          clearInterval(autoSimTimerRef.current)
          autoSimTimerRef.current = null
        }
        setBattleState('finished')
        const winnerSide = hpNowA > 0 ? 'A' : 'B'
        setCombatWinner(winnerSide)
        
        const winnerName = winnerSide === 'A' ? pokemonA.name.toUpperCase() : pokemonB.name.toUpperCase()
        setCombatLog(prev => [
          ...prev,
          { id: Math.random().toString(), text: `🏆 CONFRONTO TERMINADO! O VENCEDOR É ${winnerName}!`, type: 'system' }
        ])
        return
      }

      // Executa o turno
      if (nextTurn === 'A') {
        const move = escolheMelhorGolpe(pokemonA, pokemonB, movesA)
        const result = calculaDano(pokemonA, pokemonB, move)
        
        let newLogText = `💥 ${pokemonA.name.toUpperCase()} usou ${move.name.replace(/-/g, ' ').toUpperCase()}!`
        let logType: 'info' | 'dmg-a' | 'dmg-b' | 'miss' | 'crit' | 'system' = 'dmg-a'

        if (result.isMiss) {
          newLogText += ` ...mas ERROU o ataque!`
          logType = 'miss'
        } else {
          hpNowB = Math.max(0, hpNowB - result.damage)
          setHpB(hpNowB)
          newLogText += ` Causa ${result.damage} de dano.`
          if (result.isCrit) {
            newLogText += ` (GOLPE CRÍTICO!)`
            logType = 'crit'
          }
          if (result.multiplier > 1) {
            newLogText += ` (Super Efetivo!)`
          } else if (result.multiplier === 0) {
            newLogText += ` (Não afeta!)`
          } else if (result.multiplier < 1) {
            newLogText += ` (Não foi muito efetivo...)`
          }
        }

        setCombatLog(prev => [
          ...prev,
          { id: Math.random().toString(), text: newLogText, type: logType }
        ])
        nextTurn = 'B'
        setActiveTurn('B')
      } else {
        const move = escolheMelhorGolpe(pokemonB, pokemonA, movesB)
        const result = calculaDano(pokemonB, pokemonA, move)
        
        let newLogText = `💥 ${pokemonB.name.toUpperCase()} usou ${move.name.replace(/-/g, ' ').toUpperCase()}!`
        let logType: 'info' | 'dmg-a' | 'dmg-b' | 'miss' | 'crit' | 'system' = 'dmg-b'

        if (result.isMiss) {
          newLogText += ` ...mas ERROU o ataque!`
          logType = 'miss'
        } else {
          hpNowA = Math.max(0, hpNowA - result.damage)
          setHpA(hpNowA)
          newLogText += ` Causa ${result.damage} de dano.`
          if (result.isCrit) {
            newLogText += ` (GOLPE CRÍTICO!)`
            logType = 'crit'
          }
          if (result.multiplier > 1) {
            newLogText += ` (Super Efetivo!)`
          } else if (result.multiplier === 0) {
            newLogText += ` (Não afeta!)`
          } else if (result.multiplier < 1) {
            newLogText += ` (Não foi muito efetivo...)`
          }
        }

        setCombatLog(prev => [
          ...prev,
          { id: Math.random().toString(), text: newLogText, type: logType }
        ])
        nextTurn = 'A'
        setActiveTurn('A')
      }
    }, 1200)
  }

  // Turno Manual do Usuário
  const executaTurnoManualJogador = (move: ICombatMove) => {
    if (battleState !== 'running' || activeTurn !== 'A' || isThinking) return

    // Calcula ataque do Jogador A contra oponente B
    const result = calculaDano(pokemonA, pokemonB, move)
    let newLogText = `⚔️ Você comandou ${pokemonA.name.toUpperCase()} para usar ${move.name.replace(/-/g, ' ').toUpperCase()}!`
    let logType: 'info' | 'dmg-a' | 'dmg-b' | 'miss' | 'crit' | 'system' = 'dmg-a'

    let newHpB = hpB

    if (result.isMiss) {
      newLogText += ` ...mas ERROU o ataque!`
      logType = 'miss'
    } else {
      newHpB = Math.max(0, hpB - result.damage)
      setHpB(newHpB)
      newLogText += ` Causa ${result.damage} de dano no oponente.`
      if (result.isCrit) {
        newLogText += ` (CRÍTICO!)`
        logType = 'crit'
      }
      if (result.multiplier > 1) {
        newLogText += ` (Super Efetivo!)`
      } else if (result.multiplier === 0) {
        newLogText += ` (Não afetou!)`
      } else if (result.multiplier < 1) {
        newLogText += ` (Não muito efetivo...)`
      }
    }

    setCombatLog(prev => [
      ...prev,
      { id: Math.random().toString(), text: newLogText, type: logType }
    ])

    // Verifica se B desmaiou
    if (newHpB <= 0) {
      setBattleState('finished')
      setCombatWinner('A')
      setCombatLog(prev => [
        ...prev,
        { id: Math.random().toString(), text: `🏆 PARABÉNS! ${pokemonA.name.toUpperCase()} VENCEU O DUELO!`, type: 'system' }
      ])
      if (pokemonA.cries?.latest) {
        const audio = new Audio(pokemonA.cries.latest)
        audio.volume = 0.25
        audio.play().catch(() => {})
      }
      return
    }

    // Passa turno para B (IA)
    setActiveTurn('B')
    setIsThinking(true)
    
    // IA pensa e ataca
    setTimeout(() => {
      executaTurnoIA(hpA, newHpB)
    }, 1500)
  }

  // Turno da IA
  const executaTurnoIA = (currentHpA: number, currentHpB: number) => {
    if (!pokemonB) return
    setIsThinking(false)

    // IA escolhe o melhor golpe
    const move = escolheMelhorGolpe(pokemonB, pokemonA, movesB)
    const result = calculaDano(pokemonB, pokemonA, move)

    let newLogText = `👹 Oponente ${pokemonB.name.toUpperCase()} atacou usando ${move.name.replace(/-/g, ' ').toUpperCase()}!`
    let logType: 'info' | 'dmg-a' | 'dmg-b' | 'miss' | 'crit' | 'system' = 'dmg-b'

    let newHpA = currentHpA

    if (result.isMiss) {
      newLogText += ` ...mas ERROU!`
      logType = 'miss'
    } else {
      newHpA = Math.max(0, currentHpA - result.damage)
      setHpA(newHpA)
      newLogText += ` Causa ${result.damage} de dano em você.`
      if (result.isCrit) {
        newLogText += ` (CRÍTICO ADVERSÁRIO!)`
        logType = 'crit'
      }
      if (result.multiplier > 1) {
        newLogText += ` (Super Efetivo!)`
      } else if (result.multiplier === 0) {
        newLogText += ` (Sem efeito!)`
      } else if (result.multiplier < 1) {
        newLogText += ` (Resistido...)`
      }
    }

    setCombatLog(prev => [
      ...prev,
      { id: Math.random().toString(), text: newLogText, type: logType }
    ])

    // Verifica se A desmaiou
    if (newHpA <= 0) {
      setBattleState('finished')
      setCombatWinner('B')
      setCombatLog(prev => [
        ...prev,
        { id: Math.random().toString(), text: `💀 DERROTA! O oponente ${pokemonB.name.toUpperCase()} superou seu Pokémon.`, type: 'system' }
      ])
      if (pokemonB.cries?.latest) {
        const audio = new Audio(pokemonB.cries.latest)
        audio.volume = 0.25
        audio.play().catch(() => {})
      }
      return
    }

    // Volta o turno para o jogador
    setActiveTurn('A')
  }

  // Pausar/Retomar simulação rápida
  const togglePauseAutoBattle = () => {
    if (battleState === 'running') {
      if (autoSimTimerRef.current) {
        clearInterval(autoSimTimerRef.current)
        autoSimTimerRef.current = null
      }
      setBattleState('paused')
      setCombatLog(prev => [...prev, { id: Math.random().toString(), text: `⏸️ Simulação pausada.`, type: 'system' }])
    } else if (battleState === 'paused') {
      setBattleState('running')
      setCombatLog(prev => [...prev, { id: Math.random().toString(), text: `▶️ Retomando simulação rápida...`, type: 'system' }])
      runAutoBatalhaStep(hpA, hpB, activeTurn)
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
            {arenaMode === 'compare' ? 'CONFRONTO DE ATRIBUTOS' : arenaMode === 'auto' ? 'SIMULAÇÃO TÁTICA RÁPIDA' : 'ARENA DE DUELO RPG'}
          </h2>

          {/* Engine Mode Toggle Selector */}
          {pokemonA && pokemonB && battleState === 'idle' && (
            <div className="flex justify-center items-center gap-2 mt-4 relative z-20">
              <button
                onClick={() => setArenaMode('compare')}
                className={`px-4 py-2 rounded-xl text-[9px] font-mono font-black tracking-wider uppercase border transition-all cursor-pointer ${
                  arenaMode === 'compare'
                    ? 'bg-white/15 text-white border-white/30 shadow-glow-cyan/10'
                    : 'bg-black/40 border-white/5 text-slate-500 hover:text-slate-300'
                }`}
              >
                📊 ATRIBUTOS
              </button>
              <button
                onClick={() => startBattle('auto')}
                className={`px-4 py-2 rounded-xl text-[9px] font-mono font-black tracking-wider uppercase border transition-all cursor-pointer flex items-center gap-1 bg-gradient-to-r hover:scale-105 active:scale-95 ${
                  arenaMode === 'auto'
                    ? 'from-amber-500 to-yellow-400 text-slate-950 border-amber-300 shadow-glow-electric animate-pulse'
                    : 'bg-black/40 border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" /> MODO AUTOMÁTICO
              </button>
              <button
                onClick={() => startBattle('manual')}
                className={`px-4 py-2 rounded-xl text-[9px] font-mono font-black tracking-wider uppercase border transition-all cursor-pointer flex items-center gap-1 bg-gradient-to-r hover:scale-105 active:scale-95 ${
                  arenaMode === 'manual'
                    ? 'from-secondary to-cyan-500 text-slate-950 border-secondary shadow-glow-cyan animate-pulse'
                    : 'bg-black/40 border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5" /> RPG DE TURNOS (MANUAL)
              </button>
            </div>
          )}
        </div>

        {/* COMPARISON SCREEN ('compare') */}
        {arenaMode === 'compare' && (
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

                  const valA = getBaseStat(pokemonA, statKey)
                  const valB = getBaseStat(pokemonB, statKey)
                  
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
                      Selecione Pokémons nas laterais para carregar as estatísticas e simular o confronto.
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
        )}

        {/* COMBAT SIMULATOR ENGINE ACTIVE (Auto or Manual) */}
        {arenaMode !== 'compare' && pokemonA && pokemonB && (
          <div className="flex flex-col gap-4 flex-1 relative z-10 mb-4 w-full animate-fadeIn select-none">

            {/* ══════════════════════════════════════════════════════════
                RPG MANUAL MODE — Classic Pokemon Battlefield Layout
                ══════════════════════════════════════════════════════════ */}
            {arenaMode === 'manual' && battleState !== 'finished' && (
              <div className="flex flex-col gap-3">

                {/* BATTLEFIELD ARENA */}
                <div
                  className="relative w-full rounded-3xl overflow-hidden border border-white/8 h-[340px] md:h-[420px]"
                  style={{ background: 'linear-gradient(180deg, #050b1f 0%, #0a0f28 50%, #0d1535 100%)' }}
                >
                  {/* Grid scanlines overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
                  {/* Ground divider line */}
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                  {/* ── OPPONENT (B) — top-right ── */}
                  <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-3 z-30">
                    {/* HP Card B */}
                    <div className="flex-1 max-w-[220px] bg-slate-950/80 border border-white/10 rounded-2xl p-3 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <div className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">OPONENTE</div>
                          <div className="text-sm font-black capitalize text-white leading-tight">{pokemonB.name}</div>
                        </div>
                        <div className="flex gap-1">
                          {pokemonB.types.map((t: any) => (
                            <span key={t.id} className="text-[7px] font-black uppercase px-1.5 py-0.5 rounded bg-white/10 text-white/80">{t.name}</span>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex justify-between text-[7px] font-mono text-slate-400">
                          <span className="font-black text-white/60">HP</span>
                          <span className={`font-black ${(hpB / maxHpB) > 0.5 ? 'text-emerald-400' : (hpB / maxHpB) > 0.2 ? 'text-amber-400' : 'text-red-400'}`}>{hpB} / {maxHpB}</span>
                        </div>
                        <div className="w-full h-3.5 rounded-full bg-black/50 border border-white/10 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              (hpB / maxHpB) > 0.5 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                              (hpB / maxHpB) > 0.2 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
                              'bg-gradient-to-r from-red-600 to-rose-400 animate-pulse'
                            }`}
                            style={{ width: `${(hpB / maxHpB) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Turn indicator B */}
                    <div className={`px-2.5 py-1 rounded-xl text-[8px] font-mono font-black uppercase tracking-widest border transition-all ${
                      activeTurn === 'B'
                        ? 'bg-red-500/20 text-red-400 border-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.3)] animate-pulse'
                        : 'bg-white/3 text-slate-600 border-white/5'
                    }`}>
                      {activeTurn === 'B' ? (isThinking ? '🧠 Pensando…' : '⚡ Atacando') : '🛡 Guard'}
                    </div>
                  </div>

                  {/* Sprite B — top right, smaller (enemy position) */}
                  <div className={`absolute right-4 top-14 md:right-12 md:top-16 w-32 h-32 md:w-40 md:h-40 transition-all duration-300 z-10 ${activeTurn === 'B' ? 'scale-105' : 'scale-95 opacity-80'}`}>
                    <div className={`absolute inset-0 rounded-full ${styleB.bg} filter blur-2xl opacity-30`} />
                    <Image src={pokemonB.image} alt={pokemonB.name} fill className="object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]" />
                  </div>

                  {/* Sprite A — bottom left, bigger (player position) */}
                  <div className={`absolute left-2 bottom-2 md:left-8 md:bottom-6 w-40 h-40 md:w-52 md:h-52 transition-all duration-300 z-20 ${activeTurn === 'A' ? 'scale-105 animate-float' : 'scale-95 opacity-80'}`}>
                    <div className={`absolute inset-0 rounded-full ${styleA.bg} filter blur-2xl opacity-35`} />
                    <Image src={pokemonA.image} alt={pokemonA.name} fill className="object-contain drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] scale-x-[-1]" />
                  </div>

                  {/* ── PLAYER (A) — bottom-right HP card ── */}
                  <div className="absolute bottom-4 right-4 left-4 flex items-end justify-end gap-3 z-30 pointer-events-none">
                    {/* Turn indicator A */}
                    <div className={`px-2.5 py-1 rounded-xl text-[8px] font-mono font-black uppercase tracking-widest border transition-all ${
                      activeTurn === 'A'
                        ? 'bg-secondary/20 text-secondary border-secondary/40 shadow-[0_0_12px_rgba(0,240,255,0.3)] animate-pulse'
                        : 'bg-white/3 text-slate-600 border-white/5'
                    }`}>
                      {activeTurn === 'A' ? '⚡ Seu turno' : '🛡 Guard'}
                    </div>

                    {/* HP Card A */}
                    <div className="flex-1 max-w-[220px] bg-slate-950/80 border border-white/10 rounded-2xl p-3 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex gap-1">
                          {pokemonA.types.map((t: any) => (
                            <span key={t.id} className="text-[7px] font-black uppercase px-1.5 py-0.5 rounded bg-white/10 text-white/80">{t.name}</span>
                          ))}
                        </div>
                        <div className="text-right">
                          <div className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">JOGADOR</div>
                          <div className="text-sm font-black capitalize text-white leading-tight">{pokemonA.name}</div>
                        </div>
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex justify-between text-[7px] font-mono text-slate-400">
                          <span className={`font-black ${(hpA / maxHpA) > 0.5 ? 'text-emerald-400' : (hpA / maxHpA) > 0.2 ? 'text-amber-400' : 'text-red-400'}`}>{hpA} / {maxHpA}</span>
                          <span className="font-black text-white/60">HP</span>
                        </div>
                        <div className="w-full h-3.5 rounded-full bg-black/50 border border-white/10 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              (hpA / maxHpA) > 0.5 ? 'bg-gradient-to-r from-secondary to-teal-400' :
                              (hpA / maxHpA) > 0.2 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
                              'bg-gradient-to-r from-red-600 to-rose-400 animate-pulse'
                            }`}
                            style={{ width: `${(hpA / maxHpA) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* LAST ACTION LOG (1-2 lines compact) */}
                <div className="rounded-2xl border border-white/5 bg-[#030611]/90 px-4 py-2.5 font-mono text-[9px] min-h-[40px] flex items-center gap-2">
                  <span className="text-slate-600 text-[7px] uppercase tracking-widest shrink-0">LOG</span>
                  <div className="flex-1 space-y-0.5">
                    {combatLog.slice(-2).map(log => (
                      <div key={log.id} className={`leading-snug ${
                        log.type === 'system' ? 'text-amber-400' :
                        log.type === 'dmg-a' ? 'text-emerald-400 font-bold' :
                        log.type === 'dmg-b' ? 'text-pink-400 font-bold' :
                        log.type === 'crit' ? 'text-yellow-300 font-black uppercase animate-pulse' :
                        log.type === 'miss' ? 'text-purple-400' : 'text-slate-300'
                      }`}>{log.text}</div>
                    ))}
                    {combatLog.length === 0 && <span className="text-slate-600">Pronto para batalhar…</span>}
                  </div>
                </div>

                {/* MOVE BUTTONS — 2x2 grid, large and tactile */}
                <div className={`grid grid-cols-2 gap-3 transition-opacity duration-300 ${activeTurn !== 'A' || isThinking ? 'opacity-40 pointer-events-none' : ''}`}>
                  {movesA.map((move) => {
                    const defenderTypeStrings = pokemonB.types.map((t: any) => t.name)
                    const effectivenessMap = getTypeEffectiveness(defenderTypeStrings)
                    const mult = effectivenessMap[move.type.toLowerCase() as PokemonType] ?? 1.0
                    const multLabel = mult === 0 ? 'IMUNE' : mult !== 1 ? `×${mult}` : ''
                    const multClass = mult > 1 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : mult === 0 ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                      : mult < 1 ? 'bg-red-500/20 text-red-300 border-red-500/30' : ''
                    const isPhysical = move.damageClass === 'physical'

                    return (
                      <button
                        key={move.name}
                        onClick={() => executaTurnoManualJogador(move)}
                        disabled={activeTurn !== 'A' || isThinking}
                        className="group relative flex flex-col gap-2 p-4 rounded-2xl bg-[#0a0f28] border border-white/8 hover:border-secondary/60 hover:bg-secondary/5 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] active:scale-95 transition-all duration-150 cursor-pointer text-left overflow-hidden"
                      >
                        {/* Glow on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-secondary/0 to-secondary/0 group-hover:from-secondary/5 group-hover:to-transparent transition-all duration-300 pointer-events-none rounded-2xl" />

                        <div className="flex items-center justify-between gap-2 relative z-10">
                          <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg border ${
                            isPhysical ? 'bg-orange-500/15 text-orange-300 border-orange-500/25' : 'bg-blue-500/15 text-blue-300 border-blue-500/25'
                          }`}>
                            {move.type}
                          </span>
                          {multLabel && (
                            <span className={`text-[8px] font-black px-2 py-0.5 rounded-lg border ${multClass}`}>
                              {multLabel}
                            </span>
                          )}
                        </div>

                        <div className="relative z-10">
                          <div className="text-sm font-black capitalize text-white group-hover:text-secondary transition-colors leading-tight">
                            {move.name.replace(/-/g, ' ')}
                          </div>
                          <div className="flex gap-3 mt-1 text-[8px] font-mono text-slate-500">
                            <span>POW <strong className="text-slate-300">{move.power}</strong></span>
                            <span>ACC <strong className="text-slate-300">{move.accuracy}%</strong></span>
                            <span className={`${isPhysical ? 'text-orange-400' : 'text-blue-400'}`}>{isPhysical ? 'FÍS' : 'ESP'}</span>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                  {Array.from({ length: Math.max(0, 4 - movesA.length) }).map((_, i) => (
                    <div key={i} className="p-4 rounded-2xl border border-dashed border-white/5 text-[9px] font-mono text-slate-700 flex items-center justify-center">
                      —
                    </div>
                  ))}
                </div>

                {/* Waiting for AI indicator */}
                {activeTurn === 'B' && (
                  <div className="flex items-center justify-center gap-2 py-2 text-[9px] font-mono text-slate-500 animate-pulse">
                    <div className="w-3 h-3 border border-t-header border-white/10 rounded-full animate-spin" />
                    <span>{isThinking ? `${pokemonB.name.toUpperCase()} está escolhendo um golpe…` : `${pokemonB.name.toUpperCase()} está atacando!`}</span>
                  </div>
                )}
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════
                AUTO SIMULATION MODE — Split Screen Layout
                ══════════════════════════════════════════════════════════ */}
            {arenaMode === 'auto' && battleState !== 'finished' && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4" style={{ minHeight: 380 }}>

                {/* LEFT SIDE — Visual battlefield with both Pokémon + HP bars */}
                <div className="md:col-span-2 flex flex-col gap-3 justify-between rounded-3xl border border-white/8 bg-gradient-to-b from-[#050b1f] to-[#0d1535] p-5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                  {/* Fighter B (opponent — top) */}
                  <div className="flex flex-col items-end gap-2 relative z-10">
                    <div className={`flex justify-between w-full items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/70 border ${activeTurn === 'B' ? 'border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'border-white/5'}`}>
                      <div>
                        <div className="text-[7px] font-mono text-slate-500 uppercase">Oponente</div>
                        <div className="text-xs font-black capitalize text-white">{pokemonB.name}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-[8px] font-mono font-black ${(hpB / maxHpB) > 0.5 ? 'text-emerald-400' : (hpB / maxHpB) > 0.2 ? 'text-amber-400' : 'text-red-400 animate-pulse'}`}>
                          {hpB} / {maxHpB}
                        </div>
                        <div className="w-24 h-2.5 rounded-full bg-black/50 border border-white/10 overflow-hidden mt-0.5">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              (hpB / maxHpB) > 0.5 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                              (hpB / maxHpB) > 0.2 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
                              'bg-gradient-to-r from-red-600 to-rose-400 animate-pulse'
                            }`}
                            style={{ width: `${(hpB / maxHpB) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className={`relative w-24 h-24 self-end transition-all duration-300 ${activeTurn === 'B' ? 'scale-110' : 'scale-95 opacity-75'}`}>
                      <div className={`absolute inset-0 rounded-full ${styleB.bg} blur-2xl opacity-40`} />
                      <Image src={pokemonB.image} alt={pokemonB.name} fill className="object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]" />
                    </div>
                  </div>

                  {/* VS divider */}
                  <div className="flex items-center gap-2 relative z-10">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                    <div className="w-8 h-8 rounded-full border border-white/15 bg-white/5 flex items-center justify-center">
                      <Swords className="w-4 h-4 text-white/40" />
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                  </div>

                  {/* Fighter A (player — bottom) */}
                  <div className="flex flex-col items-start gap-2 relative z-10">
                    <div className={`relative w-24 h-24 self-start transition-all duration-300 ${activeTurn === 'A' ? 'scale-110' : 'scale-95 opacity-75'}`}>
                      <div className={`absolute inset-0 rounded-full ${styleA.bg} blur-2xl opacity-40`} />
                      <Image src={pokemonA.image} alt={pokemonA.name} fill className="object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] scale-x-[-1]" />
                    </div>

                    <div className={`flex justify-between w-full items-center gap-2 px-3 py-2 rounded-xl bg-slate-950/70 border ${activeTurn === 'A' ? 'border-secondary/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]' : 'border-white/5'}`}>
                      <div>
                        <div className="text-[7px] font-mono text-slate-500 uppercase">Jogador A</div>
                        <div className="text-xs font-black capitalize text-white">{pokemonA.name}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-[8px] font-mono font-black ${(hpA / maxHpA) > 0.5 ? 'text-emerald-400' : (hpA / maxHpA) > 0.2 ? 'text-amber-400' : 'text-red-400 animate-pulse'}`}>
                          {hpA} / {maxHpA}
                        </div>
                        <div className="w-24 h-2.5 rounded-full bg-black/50 border border-white/10 overflow-hidden mt-0.5">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              (hpA / maxHpA) > 0.5 ? 'bg-gradient-to-r from-secondary to-teal-400' :
                              (hpA / maxHpA) > 0.2 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
                              'bg-gradient-to-r from-red-600 to-rose-400 animate-pulse'
                            }`}
                            style={{ width: `${(hpA / maxHpA) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Auto controls at the bottom of the left panel */}
                  {(battleState === 'running' || battleState === 'paused') && (
                    <div className="flex gap-2 justify-center relative z-10">
                      <button
                        onClick={togglePauseAutoBattle}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[9px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95"
                      >
                        {battleState === 'running' ? <><Pause className="w-3 h-3" /> Pausar</> : <><Play className="w-3 h-3" /> Retomar</>}
                      </button>
                      <button
                        onClick={resetBattleState}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-[9px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95"
                      >
                        <RotateCcw className="w-3 h-3" /> Reset
                      </button>
                    </div>
                  )}
                </div>

                {/* RIGHT SIDE — Terminal combat log */}
                <div className="md:col-span-3 flex flex-col rounded-3xl border border-white/8 bg-[#020509] overflow-hidden" style={{ minHeight: 380 }}>
                  {/* Terminal header bar */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8 bg-[#040810]">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                    </div>
                    <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest ml-1">BATTLE_LOG — ARENA VERSUS v2</span>
                    {battleState === 'running' && (
                      <div className="ml-auto flex items-center gap-1.5">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        </span>
                        <span className="text-[7px] font-mono text-emerald-500 uppercase tracking-widest">LIVE</span>
                      </div>
                    )}
                    {battleState === 'paused' && (
                      <span className="ml-auto text-[7px] font-mono text-amber-500 uppercase tracking-widest">⏸ PAUSED</span>
                    )}
                  </div>

                  {/* Log entries */}
                  <div ref={logContainerRef} className="flex-1 overflow-y-auto p-4 space-y-1.5 font-mono text-[9px] custom-scrollbar" style={{ maxHeight: 340 }}>
                    {combatLog.length === 0 && (
                      <div className="text-slate-700 py-8 text-center">
                        <div className="animate-pulse">$ aguardando dados de combate…</div>
                      </div>
                    )}
                    {combatLog.map((log, i) => (
                      <div key={log.id} className="flex gap-2 items-start leading-relaxed">
                        <span className="text-slate-700 shrink-0 text-[7px] pt-0.5 w-5 text-right">{i + 1}</span>
                        <span className={`flex-1 ${
                          log.type === 'system' ? 'text-amber-400 font-bold' :
                          log.type === 'dmg-a' ? 'text-emerald-400' :
                          log.type === 'dmg-b' ? 'text-pink-400' :
                          log.type === 'crit' ? 'text-yellow-300 font-black uppercase tracking-wide animate-pulse' :
                          log.type === 'miss' ? 'text-purple-400' : 'text-slate-400'
                        }`}>{log.type === 'system' ? '> ' : '  '}{log.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════
                RESULT SCREEN — Winner (both modes)
                ══════════════════════════════════════════════════════════ */}
            {battleState === 'finished' && combatWinner && (
              <div className="relative rounded-3xl border border-white/10 bg-slate-950/80 backdrop-blur overflow-hidden p-8 text-center space-y-5">
                {/* Radial glow bg */}
                <div className={`absolute inset-0 pointer-events-none ${combatWinner === 'A' ? 'bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.08)_0%,transparent_65%)]' : 'bg-[radial-gradient(ellipse_at_center,rgba(255,0,128,0.08)_0%,transparent_65%)]'}`} />

                {/* Winner sprite big */}
                <div className="flex justify-center relative">
                  <div className="relative w-28 h-28">
                    <div className={`absolute inset-0 rounded-full ${combatWinner === 'A' ? styleA.bg : styleB.bg} blur-3xl opacity-50 animate-pulse`} />
                    <Image
                      src={combatWinner === 'A' ? pokemonA.image : pokemonB.image}
                      alt={combatWinner === 'A' ? pokemonA.name : pokemonB.name}
                      fill
                      className="object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.8)] animate-float"
                    />
                  </div>
                </div>

                <div className="space-y-1 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[9px] font-mono font-black uppercase tracking-widest">
                    <Trophy className="w-3.5 h-3.5" /> Duelo Concluído
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-wide mt-2">
                    {combatWinner === 'A' ? (
                      <span className="text-secondary">{pokemonA.name}</span>
                    ) : (
                      <span className="text-header">{pokemonB.name}</span>
                    )}
                    <span className="text-white"> venceu!</span>
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed mt-2">
                    {combatWinner === 'A'
                      ? `${pokemonA.name} saiu vitorioso da arena. Revanche?`
                      : `${pokemonB.name} dominou o confronto. Não desista, tente de novo!`}
                  </p>
                </div>

                <div className="flex justify-center gap-3 relative z-10">
                  <button
                    onClick={() => startBattle(arenaMode)}
                    className="px-7 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-950 bg-gradient-to-r from-secondary to-cyan-400 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                  >
                    Revanche
                  </button>
                  <button
                    onClick={resetBattleState}
                    className="px-7 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest text-white bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                  >
                    Voltar
                  </button>
                </div>
              </div>
            )}

          </div>
        )}


        {/* COMBAT CONCLUSION ROW */}

        {/* COMBAT CONCLUSION ROW */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
          
          {/* Winner announcement */}
          {arenaMode === 'compare' && pokemonA && pokemonB ? (
            <div className="flex items-center gap-3 text-left">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-glow-electric">
                <Star className="w-6 h-6 fill-slate-950 animate-pulse" />
              </div>
              <div>
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
          ) : arenaMode !== 'compare' ? (
            <div className="flex items-center gap-2.5 text-slate-500 font-mono text-[9px] uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-500"></span>
              </span>
              <span>
                {battleState === 'running' ? 'Sintonização de Duelo em Tempo Real...' : 'Aguardando Comandos...'}
              </span>
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
            {arenaMode !== 'compare' && (
              <button
                onClick={() => {
                  resetBattleState()
                  setArenaMode('compare')
                }}
                className="flex-1 md:flex-none px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-white bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 transition-all cursor-pointer select-none"
              >
                Voltar Comparador
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 md:flex-none px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-slate-950 bg-gradient-to-r from-red-500 to-pink-500 hover:scale-102 active:scale-95 transition-all cursor-pointer select-none"
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
