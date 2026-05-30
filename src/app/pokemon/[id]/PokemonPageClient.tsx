'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'

import { typeStylingMap } from '@/components/PokemonTypeIcon'
import { usePokedex } from '@/contexts/PokedexContext'
import { fetchMoveDetailAction } from '@/services/pokemonActions'

import { MoveList } from '@/components/pokemon-detail/MoveList'
import { PokemonAbilitiesPanel } from '@/components/pokemon-detail/PokemonAbilitiesPanel'
import { PokemonCardControls } from '@/components/pokemon-detail/PokemonCardControls'
import { PokemonEvolutionChain } from '@/components/pokemon-detail/PokemonEvolutionChain'
import { PokemonHeldItems } from '@/components/pokemon-detail/PokemonHeldItems'
import { PokemonHeroInfo } from '@/components/pokemon-detail/PokemonHeroInfo'
import { PokemonStatsPanel } from '@/components/pokemon-detail/PokemonStatsPanel'
import { PokemonVarieties } from '@/components/pokemon-detail/PokemonVarieties'
import { RetroSpritesGallery } from '@/components/pokemon-detail/RetroSpritesGallery'
import { typeStylesMap } from '@/constants/typestyle'
import { Header } from './_components/header'
import { TypeEffectiveness } from '@/components/pokemon-detail/TypeEffectiveness'

interface IPokemonPageClientProps {
  data: any
  currentId: number
}

const getArtworkUrl = (id: string) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`

export default function PokemonPageClient({ data, currentId }: IPokemonPageClientProps) {
  const { setPokemonInCache } = usePokedex()

  // Sincroniza dados com o cache global do cliente
  useEffect(() => {
    if (data) {
      setPokemonInCache(currentId.toString(), data)
    }
  }, [data, currentId, setPokemonInCache])

  // Card controls
  const [selectedArtStyle, setSelectedArtStyle] = useState<
    'official' | 'home' | 'dream' | 'showdown'
  >('official')
  const [isShiny, setIsShiny] = useState(false)
  const [isFemale, setIsFemale] = useState(false)
  const [downloading, setDownloading] = useState(false)

  // Moves
  const [expandedMove, setExpandedMove] = useState<string | null>(null)
  const [moveDetailsCache, setMoveDetailsCache] = useState<Record<string, any>>(
    {}
  )
  const [moveLoading, setMoveLoading] = useState<Record<string, boolean>>({})

  const prevId = currentId <= 1 ? 1025 : currentId - 1
  const nextId = currentId >= 1025 ? 1 : currentId + 1

  // ── Derived state ──────────────────────────────────────────────────────────
  const style = useMemo(() => {
    if (!data) return typeStylingMap.normal
    return (
      typeStylingMap[data.types[0]?.name?.toLowerCase()] ||
      typeStylingMap.normal
    )
  }, [data])

  const typeStyle = useMemo(() => {
    if (!data) return typeStylesMap.normal
    return (
      typeStylesMap[data.types[0]?.name?.toLowerCase()] || typeStylesMap.normal
    )
  }, [data])

  const totalStats = useMemo(
    () => data?.stats?.reduce((a: number, s: any) => a + s.base_stat, 0) ?? 0,
    [data]
  )

  const combatRating = useMemo(() => {
    if (!data) return '---'
    if (totalStats >= 550) return 'S-CLASS'
    if (totalStats >= 480) return 'A-CLASS'
    if (totalStats >= 400) return 'B-CLASS'
    return 'C-CLASS'
  }, [data, totalStats])

  const captureRarity = useMemo(() => {
    if (!data) return '---'
    if (data.capture_rate <= 45) return 'DIFÍCIL'
    if (data.capture_rate <= 120) return 'MÉDIO'
    return 'FÁCIL'
  }, [data])

  const rarityText = useMemo(() => {
    if (!data) return '---'
    if (data.is_legendary) return 'LENDÁRIO 👑'
    if (data.is_mythical) return 'MÍTICO ✨'
    return 'COMUM ⚔️'
  }, [data])

  const resolvedMainImage = useMemo(() => {
    if (!data) return ''
    const g = data.sprites_gallery
    if (selectedArtStyle === 'dream' && g.dream) return g.dream
    if (selectedArtStyle === 'showdown')
      return isShiny && g.showdown_shiny
        ? g.showdown_shiny
        : g.showdown || g.official
    if (selectedArtStyle === 'home') {
      if (isFemale && isShiny && g.home_female_shiny) return g.home_female_shiny
      if (isFemale && g.home_female) return g.home_female
      if (isShiny && g.home_shiny) return g.home_shiny
      return g.home || g.official
    }
    if (isFemale && isShiny && g.female_shiny) return g.female_shiny
    if (isFemale && g.female) return g.female
    if (isShiny && g.official_shiny) return g.official_shiny
    return g.official
  }, [data, selectedArtStyle, isShiny, isFemale])

  // ── Actions ────────────────────────────────────────────────────────────────
  const triggerRoar = useCallback(() => {
    if (!data?.cries?.latest) return
    const audio = new Audio(data.cries.latest)
    audio.volume = 0.35
    audio.play().catch(console.error)
  }, [data])

  const downloadCardPng = useCallback(async () => {
    const el = document.getElementById('pokemon-collector-card')
    if (!el) return
    try {
      setDownloading(true)
      await new Promise(r => setTimeout(r, 500))
      // html-to-image (~30KB) carregado sob demanda — só ao baixar o card.
      const { toPng } = await import('html-to-image')
      const url = await toPng(el, {
        cacheBust: true,
        pixelRatio: 3,
        style: { transform: 'scale(1)', borderRadius: '36px' }
      })
      Object.assign(document.createElement('a'), {
        download: `pokedex-${data.name}-${data.id}-hd.png`,
        href: url
      }).click()
    } catch (err) {
      console.error(err)
    } finally {
      setDownloading(false)
    }
  }, [data])

  const toggleMoveDetails = useCallback(
    async (name: string, url: string) => {
      if (expandedMove === name) {
        setExpandedMove(null)
        return
      }
      setExpandedMove(name)
      if (moveDetailsCache[name]) return
      try {
        setMoveLoading(p => ({ ...p, [name]: true }))
        const moveDetails = await fetchMoveDetailAction(name, url)
        setMoveDetailsCache(p => ({
          ...p,
          [name]: moveDetails
        }))
      } catch (err) {
        console.error(err)
      } finally {
        setMoveLoading(p => ({ ...p, [name]: false }))
      }
    },
    [expandedMove, moveDetailsCache]
  )

  if (!data)
    return (
      <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center gap-4 text-center p-4">
        <AlertCircle className="w-12 h-12 text-slate-500" />
        <h2 className="text-lg font-black uppercase text-white tracking-widest">
          Registro não encontrado
        </h2>
        <Link
          href="/"
          className="px-6 py-3 text-xs font-black uppercase tracking-widest bg-gradient-to-r from-secondary to-accent text-slate-950 rounded-xl hover:scale-105 transition-all">
          Retornar à Pokédex
        </Link>
      </div>
    )

  return (
    <div className="min-h-screen bg-background text-white flex flex-col relative pb-16">
      <Header nextId={String(nextId)} prevId={String(prevId)} />
      {/* Auras de tipo */}
      <div
        className={`absolute top-0 left-0 w-[50%] h-[35%] rounded-full filter blur-[120px] pointer-events-none ${style.bg}/10`}
      />
      <div
        className={`absolute bottom-0 right-0 w-[40%] h-[40%] rounded-full filter blur-[120px] pointer-events-none ${style.bg}/5`}
      />

      <main id="main-content" className="max-w-7xl w-full mx-auto px-4 sm:px-6 mt-6 flex flex-col gap-6 relative z-10">
        {/* ── SEÇÃO 1: Card + Info ── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Coluna esq — card */}
          <div className="lg:col-span-4">
            <PokemonCardControls
              data={data}
              selectedArtStyle={selectedArtStyle}
              setSelectedArtStyle={setSelectedArtStyle}
              isShiny={isShiny}
              setIsShiny={setIsShiny}
              isFemale={isFemale}
              setIsFemale={setIsFemale}
              resolvedMainImage={resolvedMainImage}
              typeStyle={typeStyle}
              downloading={downloading}
              onRoar={triggerRoar}
              onDownload={downloadCardPng}
            />
          </div>

          {/* Coluna dir — info */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <PokemonHeroInfo
              data={data}
              combatRating={combatRating}
              captureRarity={captureRarity}
              rarityText={rarityText}
            />
            <TypeEffectiveness types={data.types} />
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-6">
                <PokemonStatsPanel stats={data.stats} totalStats={totalStats} />
              </div>
              <div className="md:col-span-6">
                <PokemonAbilitiesPanel abilities={data.abilities} />
              </div>
            </div>
            <PokemonHeldItems heldItems={data.held_items} />
          </div>
        </section>

        {/* ── SEÇÃO 2: Evolução ── */}
        <PokemonEvolutionChain
          evolutionChain={data.evolution_chain}
          currentId={currentId}
          getArtworkUrl={getArtworkUrl}
        />

        {/* ── SEÇÃO 3: Sprites + Variedades ── */}
        <section className="grid grid-cols-1 gap-6">
          <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-5">
            <RetroSpritesGallery retroSprites={data.retro_sprites} />
          </div>
        </section>

        {/* ── SEÇÃO 4: Golpes ── */}
        <section className=" grid grid-cols-1 md:grid-cols-2 gap-6">
          <PokemonVarieties
            varieties={data.varieties}
            forms={data.forms}
            currentId={currentId}
            getArtworkUrl={getArtworkUrl}
          />

          <MoveList
            moves={data.moves}
            typeBgClass={style.bg}
            toggleMoveDetails={toggleMoveDetails}
            moveDetailsCache={moveDetailsCache}
            moveLoading={moveLoading}
            expandedMove={expandedMove}
          />
        </section>
      </main>
    </div>
  )
}
