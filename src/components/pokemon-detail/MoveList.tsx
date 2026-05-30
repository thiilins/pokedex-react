'use client'

import { Search } from 'lucide-react'
import React, { useMemo, useState } from 'react'

interface IMoveListProps {
  moves: any[]
  typeBgClass: string
  toggleMoveDetails: (name: string, url: string) => Promise<void>
  moveDetailsCache: Record<string, any>
  moveLoading: Record<string, boolean>
  expandedMove: string | null
}

export const MoveList: React.FC<IMoveListProps> = ({
  moves,
  typeBgClass,
  toggleMoveDetails,
  moveDetailsCache,
  moveLoading,
  expandedMove
}) => {
  const [filterQuery, setFilterQuery] = useState('')

  const filtered = useMemo(() => {
    if (!filterQuery.trim()) return moves
    const query = filterQuery.toLowerCase().trim()
    return moves.filter((m: any) => m.name.toLowerCase().includes(query))
  }, [moves, filterQuery])

  return (
    <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-5 gap-3 space-y-4 flex flex-col flex-1 text-left w-full h-full">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 select-none">
        <div className="text-[10px] font-mono font-black text-slate-500 tracking-widest uppercase">
          ARSENAL COMPLETO DE GOLPES // MOVES
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Filtrar golpes..."
            value={filterQuery}
            onChange={e => setFilterQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-[10px] rounded-lg border border-white/10 bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:border-secondary font-mono"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[360px] pr-1.5 space-y-2 custom-scrollbar">
        {filtered.length === 0 ? (
          <div className="text-[10px] text-slate-400 font-mono py-12 text-center select-none uppercase">
            Nenhum golpe correspondente no banco.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2 py-2 px-5">
            {filtered.map((m: any) => {
              const lvlDetail = m.details?.find(
                (d: any) => d.level_learned_at > 0
              )
              const lvl = lvlDetail ? lvlDetail.level_learned_at : 0
              const method = lvlDetail
                ? lvlDetail.move_learn_method.name
                : 'machine'
              const isExpanded = expandedMove === m.name
              const isLoading = moveLoading[m.name]
              const details = moveDetailsCache[m.name]

              return (
                <div
                  key={m.name}
                  className={`rounded-xl border transition-all duration-300 ${
                    isExpanded
                      ? 'bg-[#080d24]/60 border-secondary shadow-glow-cyan/5 scale-[1.01]'
                      : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10'
                  }`}>
                  <button
                    onClick={() => toggleMoveDetails(m.name, m.url)}
                    className="w-full flex items-center justify-between px-4 py-3 font-mono text-[10px] text-left text-white cursor-pointer select-none">
                    <div className="flex items-center gap-2 truncate">
                      <div
                        className={`w-2 h-2 rounded-full ${typeBgClass} shadow-sm animate-pulse`}
                      />
                      <span className="capitalize font-sans font-bold truncate text-white">
                        {m.name.replace(/-/g, ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[8px] font-black select-none">
                      {lvl > 0 ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          LVL {lvl}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase whitespace-nowrap">
                          {method.replace(/-/g, ' ')}
                        </span>
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-white/5 font-mono text-[9px] text-slate-300 space-y-3 animate-fadeIn">
                      {isLoading ? (
                        <div className="flex items-center justify-center py-4 gap-2 select-none">
                          <div className="w-4 h-4 border-2 border-white/5 border-t-secondary rounded-full animate-spin" />
                          <span className="text-[8px] tracking-widest text-slate-500 uppercase animate-pulse">
                            Sintonizando frequências...
                          </span>
                        </div>
                      ) : details ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-4 gap-2 text-center text-[8px] font-black uppercase select-none">
                            <div className="p-2 rounded-lg bg-slate-950/40 border border-white/5">
                              <div className="text-slate-500 mb-0.5">PP</div>
                              <div className="text-white text-[10px]">{details.pp}</div>
                            </div>
                            <div className="p-2 rounded-lg bg-slate-950/40 border border-white/5">
                              <div className="text-slate-500 mb-0.5">PODER</div>
                              <div className="text-amber-400 text-[10px]">{details.power}</div>
                            </div>
                            <div className="p-2 rounded-lg bg-slate-950/40 border border-white/5">
                              <div className="text-slate-500 mb-0.5">PRECISÃO</div>
                              <div className="text-emerald-400 text-[10px]">
                                {details.accuracy === '---' ? '---' : `${details.accuracy}%`}
                              </div>
                            </div>
                            <div className="p-2 rounded-lg bg-slate-950/40 border border-white/5 flex flex-col items-center justify-center">
                              <div className="text-slate-500 mb-0.5">CLASSE</div>
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                                details.damageClass === 'physical'
                                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                  : details.damageClass === 'special'
                                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                    : 'bg-slate-500/15 text-slate-400 border border-white/5'
                              }`}>
                                {details.damageClass === 'physical' ? 'FÍSICO' : details.damageClass === 'special' ? 'ESP.' : 'EFEITO'}
                              </span>
                            </div>
                          </div>

                          <div className="p-3 rounded-lg bg-slate-950/20 border border-white/5">
                            <p className="text-xs text-slate-200 leading-relaxed font-sans font-normal italic">
                              &ldquo;{details.description}&rdquo;
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-2 text-red-400 select-none">
                          Falha ao decodificar atributos do golpe.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
