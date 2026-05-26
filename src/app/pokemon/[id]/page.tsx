'use client'

import { toPng } from 'html-to-image'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { typeStylingMap } from '@/components/PokemonTypeIcon'
import { api } from '@/services/api'
import getId from '@/utils/getId'

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

// ─── Helpers ────────────────────────────────────────────────────────────────

const getArtworkUrl = (id: string) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`

const parseEvoChainNode = (node: any): { name: string; id: string }[] => {
  if (!node) return []
  const id = getId(node.species.url)
  const list = [{ name: node.species.name, id }]
  node.evolves_to?.forEach((next: any) => list.push(...parseEvoChainNode(next)))
  return list
}

const extractRetroSprites = (versionsObj: any) => {
  const result: { gameName: string; spriteUrl: string }[] = []
  if (!versionsObj) return result
  const fmt = (name: string) =>
    name
      .replace(/-/g, ' ')
      .replace('generation ', 'Gen ')
      .replace('firered leafgreen', 'FireRed/LeafGreen')
      .replace('ruby sapphire', 'Ruby/Sapphire')
      .replace('diamond pearl', 'Diamond/Pearl')
      .replace('heartgold soulsilver', 'HG/SS')
      .replace('black white', 'Black/White')
      .toUpperCase()
  Object.keys(versionsObj).forEach(gen =>
    Object.keys(versionsObj[gen]).forEach(game => {
      const url = versionsObj[gen][game]?.front_default
      if (url) result.push({ gameName: fmt(game), spriteUrl: url })
    })
  )
  return result
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function PokemonPage() {
  const params = useParams()
  const router = useRouter()
  const currentId = parseInt(params.id as string) || 1

  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

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

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true
    setLoading(true)
    setData(null)

    const load = async () => {
      try {
        const [res, speciesRes] = await Promise.all([
          api.get(`/pokemon/${currentId}`),
          api
            .get(`/pokemon/${currentId}`)
            .then(r =>
              api.get(
                r.data.species.url.replace('https://pokeapi.co/api/v2', '')
              )
            )
        ])

        const evoRes = await api.get(
          speciesRes.data.evolution_chain.url.replace(
            'https://pokeapi.co/api/v2',
            ''
          )
        )
        const abilities = await Promise.all(
          res.data.abilities.map(async (ab: any) => {
            try {
              const abRes = await api.get(`/ability/${getId(ab.ability.url)}`)
              const entry = abRes.data.effect_entries?.find(
                (e: any) => e.language.name === 'en'
              )
              return {
                name: ab.ability.name,
                is_hidden: ab.is_hidden,
                slot: ab.slot,
                description: (
                  entry?.effect ||
                  entry?.short_effect ||
                  'Sem descrição.'
                ).replace(/\f|\n|\r/g, ' ')
              }
            } catch {
              return {
                name: ab.ability.name,
                is_hidden: ab.is_hidden,
                slot: ab.slot,
                description: 'Sem descrição.'
              }
            }
          })
        )

        const forms =
          res.data.forms?.length > 1
            ? await Promise.all(
                res.data.forms.map(async (f: any) => {
                  try {
                    const fRes = await api.get(`/pokemon-form/${getId(f.url)}`)
                    return {
                      name: f.name,
                      id: getId(f.url),
                      sprite: fRes.data.sprites.front_default || '',
                      is_mega: fRes.data.is_mega,
                      is_battle_only: fRes.data.is_battle_only
                    }
                  } catch {
                    return {
                      name: f.name,
                      id: getId(f.url),
                      sprite: '',
                      is_mega: false,
                      is_battle_only: false
                    }
                  }
                })
              )
            : []

        const flavor =
          (
            speciesRes.data.flavor_text_entries.find(
              (e: any) =>
                e.language.name === 'pt-BR' || e.language.name === 'pt'
            ) ||
            speciesRes.data.flavor_text_entries.find(
              (e: any) => e.language.name === 'en'
            )
          )?.flavor_text?.replace(/\f|\n|\r/g, ' ') || 'Sem descrição.'

        const genus =
          (
            speciesRes.data.genera.find(
              (g: any) =>
                g.language.name === 'pt-BR' || g.language.name === 'pt'
            ) ||
            speciesRes.data.genera.find((g: any) => g.language.name === 'en')
          )?.genus || ''

        const japanName =
          (
            speciesRes.data.names.find(
              (n: any) =>
                n.language.name === 'ja-Hrkt' || n.language.name === 'ja'
            ) || speciesRes.data.names[0]
          )?.name || res.data.name

        const sg = res.data.sprites
        const parsed = {
          id: res.data.id,
          name: res.data.name,
          japan_name: japanName,
          description: flavor,
          category: genus,
          capture_rate: speciesRes.data.capture_rate,
          base_happiness: speciesRes.data.base_happiness,
          is_legendary: speciesRes.data.is_legendary,
          is_mythical: speciesRes.data.is_mythical,
          weight: res.data.weight,
          height: res.data.height,
          cries: res.data.cries ?? null,
          base_experience: res.data.base_experience,
          types: res.data.types.map((t: any) => ({
            slot: t.slot,
            name: t.type.name,
            id: +getId(t.type.url),
            url: t.type.url
          })),
          stats: res.data.stats.map((s: any) => ({
            name: s.stat.name,
            base_stat: s.base_stat
          })),
          abilities,
          moves: res.data.moves.map((m: any) => ({
            name: m.move.name,
            url: m.move.url
          })),
          evolution_chain: parseEvoChainNode(evoRes.data.chain),
          varieties: speciesRes.data.varieties.map((v: any) => ({
            name: v.pokemon.name,
            id: getId(v.pokemon.url),
            is_default: v.is_default
          })),
          held_items: (res.data.held_items ?? []).map((hi: any) => ({
            name: hi.item.name,
            displayName: hi.item.name
              .replace(/-/g, ' ')
              .replace(/\b\w/g, (c: string) => c.toUpperCase()),
            sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${hi.item.name}.png`,
            version_details: hi.version_details.map((vd: any) => ({
              rarity: vd.rarity,
              versionName: vd.version.name.replace(/-/g, ' ').toUpperCase()
            }))
          })),
          forms,
          retro_sprites: extractRetroSprites(sg?.versions),
          sprites_gallery: {
            official: sg?.other?.['official-artwork']?.front_default || '',
            official_shiny: sg?.other?.['official-artwork']?.front_shiny || '',
            home: sg?.other?.home?.front_default || '',
            home_shiny: sg?.other?.home?.front_shiny || '',
            home_female: sg?.other?.home?.front_female || '',
            home_female_shiny: sg?.other?.home?.front_shiny_female || '',
            dream: sg?.other?.dream_world?.front_default || '',
            showdown:
              sg?.other?.showdown?.front_default || sg?.front_default || '',
            showdown_shiny:
              sg?.other?.showdown?.front_shiny || sg?.front_shiny || '',
            female: sg?.front_female || '',
            female_shiny: sg?.front_shiny_female || ''
          },
          image:
            sg?.other?.['official-artwork']?.front_default ||
            sg?.other?.home?.front_default ||
            '/assets/img/fallback.png'
        }

        if (mounted) {
          setData(parsed)
          setLoading(false)
        }
      } catch (err) {
        console.error('Failed to load pokemon:', err)
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [currentId])

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
        const res = await api.get(`/move/${getId(url)}`)
        const eff = res.data.effect_entries?.find(
          (e: any) => e.language.name === 'en'
        )
        const flv = res.data.flavor_text_entries?.find(
          (e: any) => e.language.name === 'en'
        )
        setMoveDetailsCache(p => ({
          ...p,
          [name]: {
            accuracy: res.data.accuracy ?? '---',
            power: res.data.power ?? '---',
            pp: res.data.pp ?? '---',
            damageClass: res.data.damage_class?.name || 'status',
            type: res.data.type?.name || 'normal',
            description: (
              (eff?.effect ||
                eff?.short_effect ||
                flv?.flavor_text ||
                'Sem descrição.') as string
            ).replace(/\f|\n|\r/g, ' ')
          }
        }))
      } catch (err) {
        console.error(err)
      } finally {
        setMoveLoading(p => ({ ...p, [name]: false }))
      }
    },
    [expandedMove, moveDetailsCache]
  )

  // ── Loading / Error states ─────────────────────────────────────────────────
  if (loading)
    return (
      <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-white/5 border-t-secondary rounded-full animate-spin" />
        <span className="text-xs text-slate-400 font-mono tracking-widest uppercase animate-pulse">
          Acessando banco de dados...
        </span>
      </div>
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

  // ── Render ─────────────────────────────────────────────────────────────────
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

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 mt-6 flex flex-col gap-6 relative z-10">
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
