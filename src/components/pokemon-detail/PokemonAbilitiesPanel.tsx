'use client'
import React from 'react'

interface IPokemonAbilitiesPanelProps {
  abilities: { name: string; is_hidden: boolean; slot: number; description: string }[]
}

export const PokemonAbilitiesPanel: React.FC<IPokemonAbilitiesPanelProps> = ({ abilities }) => (
  <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-5 flex flex-col gap-3">
    <div className="text-[9px] font-mono font-black text-slate-500 tracking-widest uppercase pb-2 border-b border-white/5">HABILIDADES</div>
    <div className="flex flex-col gap-3 overflow-y-auto max-h-[300px] pr-1 custom-scrollbar">
      {abilities.map(ab => (
        <div key={ab.name} className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1.5 hover:bg-white/10 transition-colors">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-sm font-black text-white capitalize">{ab.name.replace(/-/g, ' ')}</span>
            {ab.is_hidden
              ? <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/30 uppercase whitespace-nowrap animate-pulse">Oculta</span>
              : <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full bg-white/10 text-slate-400 uppercase whitespace-nowrap">Normal</span>
            }
          </div>
          <p className="text-xs text-slate-400 leading-relaxed italic">&quot;{ab.description}&quot;</p>
        </div>
      ))}
    </div>
  </div>
)
