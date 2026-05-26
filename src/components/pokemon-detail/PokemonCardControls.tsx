'use client'
import React from 'react'
import { Volume2, Library, RefreshCw } from 'lucide-react'
import { CollectorCard } from './CollectorCard'

interface IPokemonCardControlsProps {
  data: any
  selectedArtStyle: 'official' | 'home' | 'dream' | 'showdown'
  setSelectedArtStyle: (v: 'official' | 'home' | 'dream' | 'showdown') => void
  isShiny: boolean
  setIsShiny: (v: boolean) => void
  isFemale: boolean
  setIsFemale: (v: boolean) => void
  resolvedMainImage: string
  typeStyle: any
  downloading: boolean
  onRoar: () => void
  onDownload: () => void
}

export const PokemonCardControls: React.FC<IPokemonCardControlsProps> = ({
  data, selectedArtStyle, setSelectedArtStyle,
  isShiny, setIsShiny, isFemale, setIsFemale,
  resolvedMainImage, typeStyle, downloading,
  onRoar, onDownload
}) => {
  const artOptions = [
    { id: 'official', label: 'OFICIAL' },
    { id: 'home',     label: '3D HOME' },
    { id: 'dream',    label: 'VETOR',    disabled: !data.sprites_gallery?.dream },
    { id: 'showdown', label: 'LIVE',     disabled: !data.sprites_gallery?.showdown }
  ] as const

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Seletor de arte */}
      <div className="bg-slate-950/70 border border-white/5 rounded-2xl p-4 flex flex-col gap-3">
        <p className="text-[9px] font-mono font-black text-secondary tracking-widest uppercase border-b border-white/5 pb-2">
          SELETOR DE ARTE // HOLOGRAM ENGINE
        </p>
        <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-black/40 border border-white/5">
          {artOptions.map(opt => (
            <button
              key={opt.id}
              disabled={'disabled' in opt ? opt.disabled : false}
              onClick={() => setSelectedArtStyle(opt.id as any)}
              className={`py-1.5 rounded-lg text-[9px] font-black font-mono transition-all cursor-pointer ${
                selectedArtStyle === opt.id
                  ? 'bg-secondary text-slate-950 shadow-glow-cyan/20'
                  : 'text-slate-400 hover:text-white disabled:opacity-25 disabled:pointer-events-none'
              }`}
            >{opt.label}</button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsShiny(!isShiny)}
            className={`flex-1 py-2 rounded-xl border text-[9px] font-black font-mono flex items-center justify-center gap-1 transition-all cursor-pointer ${
              isShiny ? 'bg-amber-500/20 border-amber-400 text-amber-400 animate-pulse' : 'bg-black/20 border-white/5 text-slate-400 hover:text-white'
            }`}
          >✨ SHINY</button>
          {(data.sprites_gallery?.female || data.sprites_gallery?.home_female) && (
            <button
              onClick={() => setIsFemale(!isFemale)}
              className={`flex-1 py-2 rounded-xl border text-[9px] font-black font-mono flex items-center justify-center gap-1 transition-all cursor-pointer ${
                isFemale ? 'bg-pink-500/20 border-pink-400 text-pink-400' : 'bg-black/20 border-white/5 text-slate-400 hover:text-white'
              }`}
            >♀ FÊMEA</button>
          )}
        </div>
      </div>

      {/* Card */}
      <div className="flex justify-center">
        <CollectorCard
          data={data}
          selectedArtStyle={selectedArtStyle}
          isShiny={isShiny}
          isFemale={isFemale}
          resolvedMainImage={resolvedMainImage}
          typeStyle={typeStyle}
          downloading={downloading}
        />
      </div>

      {/* Botões de ação */}
      <div className="flex flex-col gap-2">
        {data.cries?.latest && (
          <button
            onClick={onRoar}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-secondary/10 border border-secondary/30 text-secondary hover:bg-secondary hover:text-slate-950 active:scale-95 transition-all cursor-pointer font-black text-xs uppercase tracking-widest w-full"
          >
            <Volume2 className="w-4 h-4" /> EMITIR RUGIDO
          </button>
        )}
        <button
          onClick={onDownload}
          disabled={downloading}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-accent to-emerald-500 text-slate-950 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer font-black text-xs uppercase tracking-widest w-full disabled:opacity-50 disabled:pointer-events-none"
        >
          {downloading
            ? <><RefreshCw className="w-4 h-4 animate-spin" /> GERANDO HD...</>
            : <><Library className="w-4 h-4" /> SALVAR CARD HD</>
          }
        </button>
      </div>
    </div>
  )
}
