'use client'
import React from 'react'
import { AlertCircle } from 'lucide-react'

interface IPokemonHeldItemsProps {
  heldItems: { name: string; displayName: string; sprite: string; version_details: { versionName: string; rarity: number }[] }[]
}

export const PokemonHeldItems: React.FC<IPokemonHeldItemsProps> = ({ heldItems }) => (
  <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-5 flex flex-col gap-3">
    <div className="text-[9px] font-mono font-black text-slate-500 tracking-widest uppercase pb-2 border-b border-white/5">ITENS PORTADOS</div>
    {heldItems?.length > 0 ? (
      <div className="flex flex-col gap-2 overflow-y-auto max-h-[240px] pr-1 custom-scrollbar">
        {heldItems.map(hi => (
          <div key={hi.name} className="p-2.5 rounded-xl border border-white/5 bg-white/5 flex items-center gap-2.5 hover:bg-white/10 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-slate-950/40 border border-white/5 flex items-center justify-center flex-shrink-0">
              <img src={hi.sprite} alt={hi.name} className="w-6 h-6 object-contain" crossOrigin="anonymous"
                onError={(e: any) => { e.target.src = '/assets/img/fallback.png' }} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black text-white truncate">{hi.displayName}</p>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {hi.version_details.slice(0, 2).map((vd, i) => (
                  <span key={i} className="text-[6.5px] font-black px-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase whitespace-nowrap">
                    {vd.versionName}: {vd.rarity}%
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center p-6 border border-white/5 bg-white/[0.02] rounded-xl text-center">
        <AlertCircle className="w-5 h-5 text-slate-700 mb-1" />
        <span className="text-[9px] text-slate-600 font-mono uppercase">Sem itens portados.</span>
      </div>
    )}
  </div>
)
