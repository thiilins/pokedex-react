'use client'

import { pokemonTypesIcons } from '@/components/PokemonTypeIconData'
import { Ruler, Weight } from 'lucide-react'
import React from 'react'

interface ICollectorCardProps {
  data: any
  selectedArtStyle: 'official' | 'home' | 'dream' | 'showdown'
  isShiny: boolean
  isFemale: boolean
  resolvedMainImage: string
  typeStyle: any // Type styling from standard maps
  downloading: boolean
}

export const CollectorCard: React.FC<ICollectorCardProps> = ({
  data,
  selectedArtStyle,
  isShiny,
  isFemale,
  resolvedMainImage,
  typeStyle,
  downloading
}) => {
  const primaryType = data.types[0]?.name.toLowerCase() || 'normal'

  // Type color map for custom styles
  const tcgColorMap: Record<
    string,
    { bg: string; text: string; border: string; accent: string }
  > = {
    fire: {
      bg: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
      text: '#7f1d1d',
      border: '#b91c1c',
      accent: '#ef4444'
    },
    water: {
      bg: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      text: '#0c4a6e',
      border: '#0369a1',
      accent: '#3b82f6'
    },
    grass: {
      bg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
      text: '#14532d',
      border: '#15803d',
      accent: '#22c55e'
    },
    electric: {
      bg: 'linear-gradient(135deg, #fefdf0 0%, #fef9c3 100%)',
      text: '#713f12',
      border: '#a16207',
      accent: '#eab308'
    },
    psychic: {
      bg: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
      text: '#701a75',
      border: '#a21caf',
      accent: '#d946ef'
    },
    ice: {
      bg: 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)',
      text: '#164e63',
      border: '#0e7490',
      accent: '#06b6d4'
    },
    dragon: {
      bg: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
      text: '#581c87',
      border: '#6b21a8',
      accent: '#a855f7'
    },
    dark: {
      bg: 'linear-gradient(135deg, #fafaf9 0%, #f5f5f4 100%)',
      text: '#1c1917',
      border: '#44403c',
      accent: '#78716c'
    },
    fairy: {
      bg: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
      text: '#4c0519',
      border: '#be123c',
      accent: '#f43f5e'
    },
    normal: {
      bg: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
      text: '#262626',
      border: '#525252',
      accent: '#737373'
    }
  }
  const defaultTcgColor = {
    bg: 'linear-gradient(135deg, #fdfbf7 0%, #f5f0e1 100%)',
    text: '#1c1917',
    border: '#854d0e',
    accent: '#d97706'
  }
  const tcgStyle = tcgColorMap[primaryType] || defaultTcgColor

  // Sound roar triggers safely
  const triggerRoar = () => {
    if (data.cries?.latest) {
      const audio = new Audio(data.cries.latest)
      audio.volume = 0.35
      audio.play().catch(err => console.error('Audio roar failed:', err))
    }
  }

  // 1. TCG CLASSIC THEME
  if (selectedArtStyle === 'official') {
    return OfficialTCGCollectorCard(data, resolvedMainImage, isShiny, tcgStyle)
  }

  // 2. 3D HOME NEON CYBERPUNK THEME
  if (selectedArtStyle === 'home') {
    return Home3DCollectorCard(data, resolvedMainImage, isShiny, typeStyle)
  }

  // 3. COMIC POP HALFTONE THEME (VECTOR)
  if (selectedArtStyle === 'dream') {
    return DreamComicComponent(data, typeStyle, resolvedMainImage)
  }

  // 4. RETRO GAMEBOY DMG LCD THEME (LIVE/SHOWDOWN)
  return retroGameBoyComponent(data, resolvedMainImage)
}
export const OfficialTCGCollectorCard = (
  data: any,
  resolvedMainImage: any,
  isShiny: boolean,
  tcgStyle: any
) => {
  return (
    <div
      id="pokemon-collector-card"
      style={{
        background: tcgStyle.bg,
        borderColor: tcgStyle.border,
        boxShadow: isShiny
          ? '0 25px 60px rgba(217, 119, 6, 0.4)'
          : '0 25px 60px rgba(0, 0, 0, 0.55)'
      }}
      className="relative w-full max-w-sm h-[530px] rounded-[36px] border-[12px] flex flex-col justify-between p-6 select-none shadow-2xl font-serif text-slate-900 overflow-hidden">
      {/* Dynamic fonts injected safely */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&display=swap');
          .font-cinzel { font-family: 'Cinzel', serif; }
        `
        }}
      />

      {/* Textured vintage parchment overlay */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Vintage Frame borders */}
      <div className="absolute inset-1.5 border border-amber-800/10 rounded-[20px] pointer-events-none" />

      {/* Header Ribbon Nameplate */}
      <div className="flex justify-between items-center relative z-10 border-b-2 border-amber-900/25 pb-2">
        <div className="flex flex-col text-left">
          <span
            style={{ color: tcgStyle.border }}
            className="text-[10px] font-mono font-black tracking-widest leading-none">
            TCG COLLECTION | CARD #{String(data.id).padStart(4, '0')}
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className="text-2xl font-cinzel font-black tracking-wide uppercase"
              style={{ color: tcgStyle.text }}>
              {data.name}
            </span>
          </div>
        </div>

        {/* Types capsule icons */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-white/40 border border-amber-950/20 shadow-sm">
          {data.types.map((t: any) => {
            const IconComp = pokemonTypesIcons[t.name.toLowerCase()]
            return (
              <div
                key={t.id}
                style={{ background: tcgStyle.border }}
                className="w-7 h-7 rounded-full flex items-center justify-center text-white border border-white/20 shadow-sm"
                title={t.name}>
                {IconComp && <IconComp className="w-4 h-4 text-white" />}
              </div>
            )
          })}
        </div>
      </div>

      {/* Centered Artwork Box */}
      <div className="relative flex-1 flex flex-col items-center justify-center my-4 bg-white/20 border-2 border-amber-900/15 rounded-2xl shadow-inner p-4 overflow-hidden">
        {/* Subtle marble radial gradient behind pokemon */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.6)_0%,transparent_80%)] pointer-events-none" />

        {/* Rotating collector background stamp */}
        <div className="absolute w-44 h-44 rounded-full border border-amber-900/10 -z-5 animate-spin-slow flex items-center justify-center">
          <span className="font-cinzel text-[7px] text-amber-900/15 tracking-widest font-black uppercase">
            • POKÉDEX OFFICIAL PARCHMENT STAMP •
          </span>
        </div>

        <div className="relative w-60  h-60 rop-shadow-[0_12px_24px_rgba(0,0,0,0.35)] hover:scale-105 transition-transform duration-500  flex items-center justify-center">
          <img
            src={resolvedMainImage}
            alt={data.name}
            crossOrigin="anonymous"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Vintage physical metrics container */}
      <div className="bg-white/30 border border-amber-900/10 rounded-xl p-3 flex justify-between items-center text-xs relative z-10 shadow-sm">
        <div
          className="text-left font-mono text-[9px] uppercase font-bold"
          style={{ color: tcgStyle.text }}>
          <div>{data.category}</div>
          <div className="text-[7px] text-slate-500 font-normal">
            ESPÉCIE ORIGINAL
          </div>
        </div>
        <div
          className="flex gap-4 font-mono font-bold text-[10px]"
          style={{ color: tcgStyle.text }}>
          <div className="flex items-center gap-1">
            <Weight className="w-3.5 h-3.5 opacity-70" />
            <span>{(data.weight / 10).toFixed(1)} kg</span>
          </div>
          <div className="flex items-center gap-1 border-l border-amber-900/15 pl-3">
            <Ruler className="w-3.5 h-3.5 opacity-70" />
            <span>{(data.height / 10).toFixed(1)} m</span>
          </div>
        </div>
      </div>

      {/* Footer brand details */}
      <div className="flex justify-between items-center text-[7px] font-mono tracking-wider opacity-60 mt-3 border-t border-amber-900/10 pt-2 text-slate-700">
        <span>KANTO EDITION CARD ©1996</span>{' '}
        <span className="font-black">{data.japan_name}</span>
        <span className="font-black">THIAGOLINS DEV.BR</span>
      </div>
    </div>
  )
}

export const retroGameBoyComponent = (data: any, resolvedMainImage: any) => {
  return (
    <div
      id="pokemon-collector-card"
      style={{
        background: '#a3a3a3',
        borderColor: '#737373',
        boxShadow:
          '0 25px 60px rgba(0,0,0,0.5), inset -4px -4px 0px #525252, inset 4px 4px 0px #e5e5e5'
      }}
      className="relative w-full max-w-sm h-[530px] rounded-[36px] border-[12px] flex flex-col justify-between p-6 select-none overflow-hidden font-mono text-[#0f380f]">
      {/* Dynamic Press Start 2P font */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        .font-pixel { font-family: 'Press Start 2P', monospace; }
        .pixelated { image-rendering: pixelated; }
      `
        }}
      />

      {/* Retro handheld speaker lines on case back */}
      <div className="absolute right-4 bottom-4 w-12 h-12 opacity-15 pointer-events-none bg-[repeating-linear-gradient(45deg,#000,#000_2px,transparent_2px,transparent_6px)]" />

      {/* Screen Frame Box with glass trim */}
      <div className="bg-[#7f7f7f] border-[4px] border-b-[16px] border-t-[8px] border-neutral-800 rounded-lg p-3 flex flex-col justify-between h-[360px] shadow-inner relative">
        {/* Double classic screen lines (blue and magenta strips) */}
        <div className="absolute top-[-4px] left-8 right-8 h-[2px] bg-gradient-to-r from-blue-700 via-purple-700 to-red-700 opacity-60" />

        {/* Flashing retro battery LED indicator */}
        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse border border-red-950 shadow-[0_0_8px_#dc2626]" />
          <span className="text-[5px] text-[#e5e5e5] font-sans font-black">
            BATTERY
          </span>
        </div>

        {/* Green Screen Wrapper */}
        <div
          style={{ background: '#8bac0f' }}
          className="flex-1 rounded border-2 border-neutral-700 p-3 flex flex-col justify-between relative overflow-hidden select-none">
          {/* LCD scanline mesh grid */}
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
              backgroundSize: '3px 3px'
            }}
          />

          {/* LCD Header */}
          <div className="flex justify-between items-start border-b border-[#306230] pb-1">
            <div className="text-left font-pixel text-[8px] tracking-tighter uppercase font-bold leading-relaxed">
              #{String(data.id).padStart(4, '0')}
              <div className="text-[12px] mt-1">{data.name}</div>
              {data.japan_name}
            </div>
          </div>

          {/* GameBoy Screen Sprite Display */}
          <div className="flex-1 flex items-center justify-center relative my-2">
            <div className="relative w-32 h-32 flex items-center justify-center select-none pointer-events-none">
              <img
                src={resolvedMainImage}
                alt={data.name}
                crossOrigin="anonymous"
                className="w-full h-full object-contain pixelated filter contrast-[1.25] brightness-[0.85] saturate-[0.1]"
              />
            </div>
          </div>

          {/* GameBoy Metrics Box */}
          <div className="flex justify-between items-center text-[7px] font-pixel border-t border-[#306230] pt-1">
            <div className="text-[6px] tracking-tight uppercase leading-relaxed text-left">
              <span>{data.category.slice(0, 12)}</span>
            </div>
            <div className="flex gap-2 text-[6px]">
              <span>{(data.weight / 10).toFixed(1)}kg</span>
              <span className="border-l border-[#306230] pl-1">
                {(data.height / 10).toFixed(1)}m
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Handheld GameBoy Console D-Pad and Button Controls Mockup for styling */}
      <div className="flex justify-between items-center px-4 mt-2 select-none pointer-events-none opacity-90">
        {/* Cross D-Pad mockup */}
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="absolute w-3.5 h-11 bg-neutral-700 rounded shadow-md" />
          <div className="absolute w-11 h-3.5 bg-neutral-700 rounded shadow-md" />
          <div className="absolute w-3.5 h-3.5 bg-neutral-800 rounded" />
        </div>
        {/* Dynamic logo label */}
        <span className="text-[8px] font-sans font-black text-neutral-800 tracking-widest uppercase">
          GAME BOY DMG-01
        </span>{' '}
        {/* Action button mockups */}
        <div className="flex gap-2 rotate-[-25deg] transform translate-y-1">
          <div className="w-7 h-7 rounded-full bg-red-800 flex items-center justify-center shadow-md">
            <span className="text-[6px] text-black font-sans font-black mt-8">
              B
            </span>
          </div>
          <div className="w-7 h-7 rounded-full bg-red-800 flex items-center justify-center shadow-md">
            <span className="text-[6px] text-black font-sans font-black mt-8">
              A
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
export const Home3DCollectorCard = (
  data: any,
  resolvedMainImage: any,
  isShiny: boolean,
  typeStyle: any
) => {
  return (
    <div
      id="pokemon-collector-card"
      style={{
        backgroundImage: `repeating-linear-gradient(-45deg, #facc15, #facc15 8px, #000 8px, #000 16px)`,
        boxShadow: isShiny
          ? '0 25px 60px rgba(234, 179, 8, 0.4), 12px 12px 0px #000000'
          : '0 25px 60px rgba(0, 0, 0, 0.5), 12px 12px 0px #000000'
      }}
      className="relative w-full max-w-sm h-[530px] rounded-[36px] p-2.5 select-none overflow-hidden text-black font-sans border-4 border-black">
      
      {/* Estilos adicionais injetados para fontes retrô gamer impactantes */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap');
            .font-marker { font-family: 'Permanent Marker', cursive; }
          `
        }}
      />

      {/* Área interna do card - simula papel de revista fosco */}
      <div 
        style={{
          backgroundColor: '#faf6e9',
          backgroundImage: `radial-gradient(rgba(0, 0, 0, 0.025) 12%, transparent 12%)`,
          backgroundSize: '16px 16px'
        }}
        className="w-full h-full rounded-[28px] border-4 border-black p-4 flex flex-col justify-between relative overflow-hidden bg-cover">
        
        {/* Camada de ruído/retícula fina de revista impressa */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.99' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />

        {/* Efeito degradê de luz na revista */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/[0.03] via-transparent to-white/[0.08] pointer-events-none" />

        {/* ── HEADER: TÍTULO DA CAPA / FICHA TÉCNICA ── */}
        <div className="relative z-10 flex items-center justify-between gap-2 transform -rotate-1">
          {/* Box de Nome Inclinado Estilo Chamada de Capa */}
          <div className="bg-red-500 border-4 border-black rounded-xl px-4 py-1.5 shadow-[4px_4px_0px_#000000] text-left flex-1 min-w-0">
            <span className="text-[7.5px] font-mono font-black text-yellow-300 tracking-wider block leading-none uppercase">
              REVELADO! // CAPA Nº {String(data.id).padStart(4, '0')}
            </span>
            <span className="text-xl sm:text-2xl font-black text-white tracking-tighter uppercase block truncate drop-shadow-[2px_2px_0px_rgba(0,0,0,0.85)] mt-0.5">
              {data.name}
            </span>
          </div>

          {/* Types capsule icons */}
          <div className="bg-cyan-400 border-4 border-black rounded-2xl p-1 shadow-[3px_3px_0px_#000000] flex-shrink-0 flex gap-0.5">
            {data.types.map((t: any) => {
              const IconComp = pokemonTypesIcons[t.name.toLowerCase()]
              return (
                <div
                  key={t.id}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white border-2 border-black bg-black shadow-inner"
                  title={t.name}>
                  {IconComp && <IconComp className="w-3.5 h-3.5 text-white" />}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── IMAGEM DO PERSONAGEM: CAPA DO DETONADO ── */}
        <div className="relative flex-1 flex flex-col items-center justify-center my-3 bg-gradient-to-br from-indigo-900 to-purple-800 border-4 border-black rounded-2xl shadow-[6px_6px_0px_#000000] p-4 overflow-hidden">
          {/* Grade neon retrô no fundo da foto */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:12px_12px] pointer-events-none" />
          
          {/* Sol radial de contraste de revista */}
          <div className="absolute w-56 h-56 rounded-full bg-yellow-400/25 filter blur-[40px] -z-5" />

          {/* Selo Diagional "100% DETONADO" */}
          <div className="absolute top-2.5 left-2.5 bg-yellow-300 border-3 border-black text-black px-2.5 py-0.5 rounded font-black text-[8px] uppercase tracking-widest shadow-[2px_2px_0px_#000000] transform -rotate-12 z-20 font-marker animate-pulse">
            ★ 100% DETONADO ★
          </div>

          {/* Adesivo de Dica de Combate */}
          <div className="absolute bottom-2 right-2 bg-pink-500 border-3 border-black text-white px-2 py-0.5 rounded font-black text-[7px] uppercase tracking-wider shadow-[2px_2px_0px_#000000] transform rotate-6 z-20">
            DICA DE MESTRE!
          </div>

          <div className="relative w-48 h-48 drop-shadow-[8px_8px_0px_rgba(0,0,0,0.85)] hover:scale-105 transition-transform duration-300 flex items-center justify-center z-10">
            <img
              src={resolvedMainImage}
              alt={data.name}
              crossOrigin="anonymous"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* ── METRICS SECTION: BOX DE REVIEW TÉCNICO DE CAPA ── */}
        <div className="bg-cyan-400 border-4 border-black rounded-xl p-2.5 flex justify-between items-center text-xs relative z-10 shadow-[4px_4px_0px_#000000] transform rotate-1">
          <div className="text-left font-sans text-[8px] uppercase font-black text-black flex flex-col gap-0.5 leading-none">
            <span className="bg-black text-cyan-400 px-1 py-0.5 rounded text-[7px] w-fit font-mono font-black">{data.category.toUpperCase()}</span>
            <span className="text-[6.5px] text-black/70 font-bold mt-1 font-mono">DICAS E ANÁLISE DO MONSTRO</span>
          </div>
          <div className="flex gap-2.5 font-mono font-black text-[9px] text-black">
            <div className="flex items-center gap-1 bg-white border-2 border-black rounded px-1.5 py-0.5">
              <Weight className="w-3 h-3 text-red-500" />
              <span>{(data.weight / 10).toFixed(1)} kg</span>
            </div>
            <div className="flex items-center gap-1 bg-white border-2 border-black rounded px-1.5 py-0.5">
              <Ruler className="w-3 h-3 text-indigo-600" />
              <span>{(data.height / 10).toFixed(1)} m</span>
            </div>
          </div>
        </div>

        {/* ── FOOTER: DIREITOS E CRÉDITOS RETRÔ ── */}
        <div className="mt-3 bg-yellow-300 border-3 border-black rounded-xl px-3 py-1 flex justify-between items-center text-[7.5px] font-mono tracking-wider font-black text-black shadow-[3px_3px_0px_#000000] relative z-10">
          <span>AÇÃO GAMES EDITORA ©1996</span>
          <span className="font-black text-[8px] bg-black text-yellow-300 px-2 py-0.5 rounded uppercase">{data.japan_name}</span>
          <span>SUPER GAMEPOWER SPECIAL</span>
        </div>
      </div>
    </div>
  )
}
export const DreamComicComponent = (
  data: any,
  typeStyle: any,
  resolvedMainImage: any
) => {
  return (
    <div
      id="pokemon-collector-card"
      style={{
        background: typeStyle.flatColor,
        borderColor: '#000000',
        boxShadow: '10px 10px 0px #000000'
      }}
      className="relative w-full max-w-sm h-[530px] rounded-[36px] border-[6px] flex flex-col justify-between p-6 select-none overflow-hidden font-sans text-black">
      {/* Dynamic bangers font */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @import url('https://fonts.googleapis.com/css2?family=Bangers&display=swap');
          .font-bangers { font-family: 'Bangers', sans-serif; letter-spacing: 0.05em; }
        `
        }}
      />

      {/* Retro Halftone comic dots overlay */}
      <div
        className="absolute inset-0 opacity-[0.25] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#000000 20%, transparent 20%)`,
          backgroundSize: '12px 12px'
        }}
      />

      {/* Offset comic title banner */}
      <div className="relative z-10 flex justify-between items-center">
        <div className="bg-yellow-300 border-[3.5px] border-black rounded-lg px-4 py-2 transform -rotate-2 -translate-x-2 -translate-y-1 shadow-[4px_4px_0px_#000000] flex flex-col text-left">
          <span className="text-[8px] font-mono font-black text-black/60 tracking-wider leading-none">
            Nº {String(data.id).padStart(4, '0')}
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-2xl font-bangers text-black uppercase">
              {data.name}
            </span>
          </div>
        </div>

        {/* Types capsule icons */}
        <div className="bg-white border-[3.5px] border-black rounded-full p-1.5 shadow-[3px_3px_0px_#000000]">
          {data.types.map((t: any) => {
            const IconComp = pokemonTypesIcons[t.name.toLowerCase()]
            return (
              <div
                key={t.id}
                className="w-7 h-7 rounded-full flex items-center justify-center text-white border-2 border-black bg-black shadow-inner"
                title={t.name}>
                {IconComp && <IconComp className="w-4 h-4 text-white" />}
              </div>
            )
          })}
        </div>
      </div>

      {/* Centered bold artwork box */}
      <div className="relative flex-1 flex flex-col items-center justify-center my-4 bg-white border-[3.5px] border-black rounded-2xl shadow-[6px_6px_0px_#000000] p-4 overflow-hidden">
        {/* Pop sunburst background */}
        <div
          className="absolute inset-0 opacity-[0.25] pointer-events-none"
          style={{
            backgroundImage: `conic-gradient(from 0deg, #000 0deg 18deg, transparent 18deg 36deg, #000 36deg 54deg, transparent 54deg 72deg, #000 72deg 90deg, transparent 90deg 108deg, #000 108deg 126deg, transparent 126deg 144deg, #000 144deg 162deg, transparent 162deg 180deg, #000 180deg 198deg, transparent 198deg 216deg, #000 216deg 234deg, transparent 234deg 252deg, #000 252deg 270deg, transparent 270deg 288deg, #000 288deg 306deg, transparent 306deg 324deg, #000 324deg 342deg, transparent 342deg 360deg)`
          }}
        />

        <div className="relative w-60 h-60 drop-shadow-[0_12px_0px_rgba(0,0,0,0.9)] hover:scale-105 transition-transform duration-300  flex items-center justify-center">
          <img
            src={resolvedMainImage}
            alt={data.name}
            crossOrigin="anonymous"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Vintage comic box physical metrics */}
      <div className="bg-yellow-300 border-[3.5px] border-black rounded-xl p-3 flex justify-between items-center text-xs relative z-10 shadow-[4px_4px_0px_#000000]">
        <div className="text-left font-mono text-[9px] uppercase font-black text-black">
          <div>{data.category}</div>
          <div className="text-[7px] text-black/60 font-bold">
            MONSTRO DE BOLSO
          </div>
        </div>
        <div className="flex gap-4 font-mono font-black text-[10px] text-black">
          <div className="flex items-center gap-1">
            <Weight className="w-3.5 h-3.5 text-black" />
            <span>{(data.weight / 10).toFixed(1)} kg</span>
          </div>
          <div className="flex items-center gap-1 border-l-2 border-black pl-3">
            <Ruler className="w-3.5 h-3.5 text-black" />
            <span>{(data.height / 10).toFixed(1)} m</span>
          </div>
        </div>
      </div>

      {/* Footer brand details */}
      <div className="mt-3 bg-yellow-300 border-[3px] border-black rounded-xl px-3 py-1.5 flex justify-between items-center text-[7.5px] font-mono tracking-wider font-black text-black shadow-[3px_3px_0px_#000000] relative z-10">
        <span>POP EDITION COMICS ©1996</span>
        <span className="font-black text-[8px] bg-black text-yellow-300 px-1.5 py-0.5 rounded uppercase">{data.japan_name}</span>
        <span>POKÉDEX VETOR GRAPHIC</span>
      </div>
    </div>
  )
}
