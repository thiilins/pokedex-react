'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface IPokemonVarietiesProps {
  varieties: { name: string; id: string; is_default: boolean }[]
  forms: { name: string; id: string; sprite: string; is_mega: boolean; is_battle_only: boolean }[]
  currentId: number
  getArtworkUrl: (id: string) => string
}

export const PokemonVarieties: React.FC<IPokemonVarietiesProps> = ({ varieties, forms, currentId, getArtworkUrl }) => {
  const hasVarieties = varieties.length > 1
  const hasForms = forms?.length > 1

  return (
    <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-5 flex flex-col gap-3">
      <div className="text-[9px] font-mono font-black text-slate-500 tracking-widest uppercase pb-2 border-b border-white/5">
        VARIAÇÕES E FORMAS
      </div>

      {!hasVarieties && !hasForms ? (
        <div className="flex flex-col items-center justify-center p-6 border border-white/5 bg-white/[0.02] rounded-xl text-center">
          <span className="text-[9px] text-slate-600 font-mono uppercase">Sem variações catalogadas.</span>
        </div>
      ) : (
        <div className="flex flex-col gap-2 overflow-y-auto max-h-[360px] pr-1 custom-scrollbar">
          {hasVarieties && varieties.map(v => {
            const isSelf = parseInt(v.id) === currentId
            return (
              <Link key={v.name} href={`/pokemon/${v.id}`}
                className={`p-3 rounded-xl border flex items-center gap-3 transition-all hover:scale-[1.01] ${
                  isSelf ? 'bg-secondary/10 border-secondary/30' : 'bg-white/5 border-white/5 hover:bg-white/10'
                }`}
              >
                <div className="w-9 h-9 flex-shrink-0 bg-slate-950/40 rounded-lg p-0.5">
                  <Image src={getArtworkUrl(v.id)} alt={v.name} width={32} height={32} className="object-contain" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[7px] font-mono text-slate-500 block">#{v.id}</span>
                  <span className={`text-xs font-black capitalize block truncate ${isSelf ? 'text-secondary' : 'text-white'}`}>{v.name.replace(/-/g, ' ')}</span>
                </div>
                <span className={`text-[6.5px] font-black px-1.5 py-0.5 rounded border uppercase whitespace-nowrap ${
                  v.is_default ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/10 text-slate-400 border-white/5'
                }`}>{v.is_default ? 'Original' : 'Variante'}</span>
              </Link>
            )
          })}

          {hasForms && (
            <>
              {hasVarieties && <div className="border-t border-white/5 my-1" />}
              <div className="text-[8px] font-mono font-black text-slate-500 uppercase tracking-widest mb-1">FORMAS ESTÉTICAS</div>
              {forms.map(f => (
                <div key={f.name} className="p-3 rounded-xl border border-white/5 bg-white/5 flex items-center gap-3 hover:bg-white/10 transition-colors">
                  <div className="w-8 h-8 flex-shrink-0 bg-slate-950/40 rounded-lg p-0.5">
                    <img src={f.sprite} alt={f.name} className="w-full h-full object-contain" crossOrigin="anonymous"
                      onError={(e: any) => { e.target.src = '/assets/img/fallback.png' }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-black text-white capitalize block truncate">{f.name.replace(/-/g, ' ')}</span>
                  </div>
                  <div className="flex gap-1">
                    {f.is_mega && <span className="text-[6px] font-black px-1 rounded bg-red-500/20 text-red-400 border border-red-500/30 uppercase">MEGA</span>}
                    {f.is_battle_only
                      ? <span className="text-[6px] font-black px-1 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 uppercase">BATALHA</span>
                      : <span className="text-[6px] font-black px-1 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 uppercase">ATIVO</span>
                    }
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
