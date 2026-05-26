'use client'

import { Layers } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

interface IRetroSpritesGalleryProps {
  retroSprites: any[]
}

export const RetroSpritesGallery: React.FC<IRetroSpritesGalleryProps> = ({
  retroSprites
}) => {
  return (
    <div className="space-y-4 flex flex-col flex-1 text-left w-full h-full">
      <div className="text-[10px] font-mono font-black text-slate-500 tracking-widest uppercase">
        GALERIA CRONOLÓGICA DE SPRITES RETRÔ // PIXEL ART
      </div>

      {retroSprites.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-2 border border-white/5 rounded-2xl bg-slate-950/20">
          <Layers className="w-8 h-8 text-slate-600 animate-pulse" />
          <span className="text-[10px] text-slate-500 font-black uppercase font-mono tracking-widest">
            Sem Sprites
          </span>
          <p className="text-xs text-slate-400 max-w-xs">
            Nenhum sprite clássico catalogado nas pastas de versões.
          </p>
        </div>
      ) : (
        <div className="overflow-y-auto pr-1.5 flex-1 custom-scrollbar">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {retroSprites.map((sp: any, idx: number) => (
              <div
                key={`${sp.gameName}-${idx}`}
                style={{
                  background:
                    'linear-gradient(135deg, #131722 0%, #0c0e14 100%)',
                  boxShadow: 'inset 0 0 10px rgba(255,255,255,0.02)'
                }}
                className="p-3.5 rounded-2xl border border-white/10 hover:border-secondary/40 hover:scale-[1.04] transition-all flex flex-col items-center justify-between text-center min-h-[120px] relative select-none overflow-hidden group shadow-md">
                {/* Tech micro corners inside stand */}
                <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-white/10 rounded-tl" />
                <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-white/10 rounded-tr" />
                <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-white/10 rounded-bl" />
                <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-white/10 rounded-br" />

                {/* Pixel Art Sprite Image in GameBoy style cartridge placeholder */}
                <div className="relative w-14 h-14 flex items-center justify-center my-1 select-none pointer-events-none drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-300">
                  <Image
                    src={sp.spriteUrl}
                    alt={sp.gameName}
                    fill
                    unoptimized
                    className="object-contain pixelated"
                  />
                </div>

                {/* Micro LED light glowing on active sprite */}
                <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40" />

                <div
                  className="text-[7.5px] font-mono font-black text-secondary group-hover:text-white uppercase tracking-wider block leading-tight truncate w-full mt-2 transition-colors duration-300"
                  title={sp.gameName}>
                  {sp.gameName}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
