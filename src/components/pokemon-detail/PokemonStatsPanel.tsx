'use client'
import {
  Gauge,
  Heart,
  Shield,
  ShieldAlert,
  Star,
  Swords,
  Zap
} from 'lucide-react'
import React from 'react'

interface IPokemonStatsPanelProps {
  stats: { name: string; base_stat: number }[]
  totalStats: number
}

const STAT_CONFIG: Record<
  string,
  { icon: React.FC<any>; label: string; color: string; gradient: string }
> = {
  hp: {
    icon: Heart,
    label: 'HP / Vida',
    color: 'text-red-500',
    gradient: 'from-red-600 to-red-400'
  },
  attack: {
    icon: Swords,
    label: 'Ataque',
    color: 'text-orange-500',
    gradient: 'from-orange-600 to-orange-400'
  },
  defense: {
    icon: Shield,
    label: 'Defesa',
    color: 'text-blue-500',
    gradient: 'from-blue-600 to-blue-400'
  },
  'special-attack': {
    icon: Zap,
    label: 'Atq. Esp.',
    color: 'text-yellow-400',
    gradient: 'from-yellow-500 to-yellow-300'
  },
  'special-defense': {
    icon: ShieldAlert,
    label: 'Def. Esp.',
    color: 'text-indigo-400',
    gradient: 'from-indigo-600 to-indigo-400'
  },
  speed: {
    icon: Gauge,
    label: 'Velocidade',
    color: 'text-emerald-400',
    gradient: 'from-emerald-600 to-emerald-400'
  }
}

export const PokemonStatsPanel: React.FC<IPokemonStatsPanelProps> = ({
  stats,
  totalStats
}) => (
  <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-5 flex flex-col gap-3 h-full">
    <div className="flex items-center justify-between text-[9px] font-mono font-black text-slate-500 tracking-widest uppercase pb-2 border-b border-white/5">
      <span>ATRIBUTOS DE COMBATE</span>
      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
        TOTAL {totalStats}
      </span>
    </div>
    <div className="flex flex-col gap-2.5">
      {stats.map(stat => {
        const key = stat.name.toLowerCase()
        const cfg = STAT_CONFIG[key] || {
          icon: Star,
          label: stat.name,
          color: 'text-slate-300',
          gradient: 'from-slate-500 to-slate-400'
        }
        const Icon = cfg.icon
        const pct = Math.min(Math.round((stat.base_stat / 255) * 100), 100)
        return (
          <div key={stat.name} className="flex items-center gap-2.5">
            <span
              className={`${cfg.color} p-1 rounded bg-white/5 flex-shrink-0`}>
              <Icon className="w-3 h-3" />
            </span>
            <span className="font-mono font-black text-slate-300 text-[8px] tracking-widest w-14 shrink-0 uppercase">
              {cfg.label}
            </span>
            <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${cfg.gradient}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="font-mono font-black text-white text-[10px] w-7 text-right shrink-0">
              {stat.base_stat}
            </span>
          </div>
        )
      })}
    </div>
  </div>
)
