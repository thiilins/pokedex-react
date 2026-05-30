'use client'

import React, { useMemo } from 'react'
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react'
import { getTypeEffectiveness, PokemonType } from '@/utils/typeMatchups'
import PokemonTypeIcon from '../PokemonTypeIcon'

interface ITypeEffectivenessProps {
  types: { name: string }[]
}

export const TypeEffectiveness: React.FC<ITypeEffectivenessProps> = ({ types }) => {
  const typeNames = useMemo(() => types.map(t => t.name), [types])
  const effectiveness = useMemo(() => getTypeEffectiveness(typeNames), [typeNames])

  // Agrupa os tipos de ataque pelos seus multiplicadores
  const grouped = useMemo(() => {
    const result = {
      x4: [] as PokemonType[],
      x2: [] as PokemonType[],
      x0_5: [] as PokemonType[],
      x0_25: [] as PokemonType[],
      x0: [] as PokemonType[]
    }

    Object.entries(effectiveness).forEach(([type, mult]) => {
      const t = type as PokemonType
      if (mult === 4) result.x4.push(t)
      else if (mult === 2) result.x2.push(t)
      else if (mult === 0.5) result.x0_5.push(t)
      else if (mult === 0.25) result.x0_25.push(t)
      else if (mult === 0) result.x0.push(t)
    })

    return result
  }, [effectiveness])

  const hasData = useMemo(() => {
    return (
      grouped.x4.length > 0 ||
      grouped.x2.length > 0 ||
      grouped.x0_5.length > 0 ||
      grouped.x0_25.length > 0 ||
      grouped.x0.length > 0
    )
  }, [grouped])

  return (
    <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-5 flex flex-col gap-4 text-left">
      <div className="text-[9px] font-mono font-black text-slate-500 tracking-widest uppercase pb-2 border-b border-white/5 flex items-center justify-between select-none">
        <span>EFICÁCIA ELEMENTAL // TÁTICA DE COMBATE</span>
        <span className="px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">DEFESA</span>
      </div>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center p-6 border border-white/5 bg-white/[0.01] rounded-xl text-center select-none uppercase">
          <span className="text-[9px] text-slate-400 font-mono tracking-wider">Sem dados de eficácia disponíveis.</span>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          
          {/* FRAQUEZAS (DANO RECEBIDO AUMENTADO) */}
          {(grouped.x4.length > 0 || grouped.x2.length > 0) && (
            <div className="space-y-2.5">
              <div className="text-[8px] font-mono font-black text-red-400 tracking-wider uppercase flex items-center gap-1 select-none">
                <ShieldAlert className="w-3.5 h-3.5 animate-pulse text-red-500" />
                Vulnerabilidades (Dano Recebido Aumentado)
              </div>
              <div className="flex flex-col gap-2">
                {grouped.x4.length > 0 && (
                  <div className="p-3 rounded-xl border border-red-500/20 bg-red-500/[0.02] flex items-center gap-3">
                    <span className="text-[8.5px] font-mono font-black text-red-500 shrink-0 select-none uppercase tracking-widest border border-red-500/30 px-1.5 py-0.5 rounded bg-red-500/5">
                      4x Fatal
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {grouped.x4.map(t => (
                        <PokemonTypeIcon key={t} type={t} haveName className="px-2.5 py-0.5 text-[8.5px]" />
                      ))}
                    </div>
                  </div>
                )}
                {grouped.x2.length > 0 && (
                  <div className="p-3 rounded-xl border border-orange-500/20 bg-orange-500/[0.01] flex items-center gap-3">
                    <span className="text-[8.5px] font-mono font-black text-orange-400 shrink-0 select-none uppercase tracking-widest border border-orange-500/30 px-1.5 py-0.5 rounded bg-orange-500/5">
                      2x Fraco
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {grouped.x2.map(t => (
                        <PokemonTypeIcon key={t} type={t} haveName className="px-2.5 py-0.5 text-[8.5px]" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* RESISTÊNCIAS (DANO RECEBIDO REDUZIDO) */}
          {(grouped.x0_5.length > 0 || grouped.x0_25.length > 0) && (
            <div className="space-y-2.5">
              <div className="text-[8px] font-mono font-black text-emerald-400 tracking-wider uppercase flex items-center gap-1 select-none">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Resistências (Dano Recebido Reduzido)
              </div>
              <div className="flex flex-col gap-2">
                {grouped.x0_5.length > 0 && (
                  <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.01] flex items-center gap-3">
                    <span className="text-[8.5px] font-mono font-black text-emerald-400 shrink-0 select-none uppercase tracking-widest border border-emerald-500/30 px-1.5 py-0.5 rounded bg-emerald-500/5">
                      0.5x Forte
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {grouped.x0_5.map(t => (
                        <PokemonTypeIcon key={t} type={t} haveName className="px-2.5 py-0.5 text-[8.5px]" />
                      ))}
                    </div>
                  </div>
                )}
                {grouped.x0_25.length > 0 && (
                  <div className="p-3 rounded-xl border border-cyan-500/20 bg-cyan-500/[0.01] flex items-center gap-3">
                    <span className="text-[8.5px] font-mono font-black text-cyan-400 shrink-0 select-none uppercase tracking-widest border border-cyan-500/30 px-1.5 py-0.5 rounded bg-cyan-500/5">
                      0.25x Resistente
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {grouped.x0_25.map(t => (
                        <PokemonTypeIcon key={t} type={t} haveName className="px-2.5 py-0.5 text-[8.5px]" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* IMUNIDADES (DANO NULO) */}
          {grouped.x0.length > 0 && (
            <div className="space-y-2.5">
              <div className="text-[8px] font-mono font-black text-indigo-400 tracking-wider uppercase flex items-center gap-1 select-none">
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                Imunidades (Dano Recebido Nulo)
              </div>
              <div className="p-3 rounded-xl border border-indigo-500/20 bg-indigo-500/[0.01] flex items-center gap-3">
                <span className="text-[8.5px] font-mono font-black text-indigo-400 shrink-0 select-none uppercase tracking-widest border border-indigo-500/30 px-1.5 py-0.5 rounded bg-indigo-500/5">
                  0x Imune
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {grouped.x0.map(t => (
                    <PokemonTypeIcon key={t} type={t} haveName className="px-2.5 py-0.5 text-[8.5px]" />
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  )
}
