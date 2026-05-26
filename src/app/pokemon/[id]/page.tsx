'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { 
  ArrowLeft, ArrowRight, Volume2, Heart, Swords, Shield, Zap, 
  ShieldAlert, Gauge, Star, Compass, Ruler, Weight, 
  Search, Layers, Library, Sparkles, RefreshCw, Trophy
} from 'lucide-react'
import PokemonTypeIcon, { typeStylingMap } from '@/components/PokemonTypeIcon'
import { pokemonTypesIcons } from '@/components/PokemonTypeIconData'
import { api } from '@/services/api'
import getId from '@/utils/getId'
import { toPng } from 'html-to-image'

export default function PokemonPage() {
  const params = useParams()
  const router = useRouter()
  const pokemonIdStr = params.id as string
  const currentId = parseInt(pokemonIdStr) || 1

  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'about' | 'stats' | 'abilities' | 'evolutions' | 'varieties' | 'retro' | 'moves'>('about')
  const [moveFilter, setMoveFilter] = useState('')

  // Hologram Sprite Engine states
  const [selectedArtStyle, setSelectedArtStyle] = useState<'official' | 'home' | 'dream' | 'showdown'>('official')
  const [isShiny, setIsShiny] = useState(false)
  const [isFemale, setIsFemale] = useState(false)
  const [downloading, setDownloading] = useState(false)

  // Moves accordion details states
  const [expandedMove, setExpandedMove] = useState<string | null>(null)
  const [moveDetailsCache, setMoveDetailsCache] = useState<Record<string, any>>({})
  const [moveLoading, setMoveLoading] = useState<Record<string, boolean>>({})

  // 1. toggleMoveDetails
  const toggleMoveDetails = async (moveName: string, moveUrl: string) => {
    if (expandedMove === moveName) {
      setExpandedMove(null)
      return
    }

    setExpandedMove(moveName)

    if (moveDetailsCache[moveName]) {
      return
    }

    try {
      setMoveLoading(prev => ({ ...prev, [moveName]: true }))
      
      const moveId = getId(moveUrl)
      const res = await api.get(`/move/${moveId}`)
      
      let moveDesc = 'Sem descrição detalhada disponível.'
      if (res.data.effect_entries && res.data.effect_entries.length > 0) {
        const entry = res.data.effect_entries.find((e: any) => e.language.name === 'pt' || e.language.name === 'pt-BR') ||
                      res.data.effect_entries.find((e: any) => e.language.name === 'en')
        if (entry) {
          moveDesc = entry.effect || entry.short_effect
        }
      }
      if (moveDesc === 'Sem descrição detalhada disponível.' && res.data.flavor_text_entries) {
        const entry = res.data.flavor_text_entries.find((e: any) => e.language.name === 'pt' || e.language.name === 'pt-BR') ||
                      res.data.flavor_text_entries.find((e: any) => e.language.name === 'en')
        if (entry) {
          moveDesc = entry.flavor_text
        }
      }

      const parsedMoveDetail = {
        accuracy: res.data.accuracy ?? '---',
        power: res.data.power ?? '---',
        pp: res.data.pp ?? '---',
        damageClass: res.data.damage_class?.name || 'status',
        type: res.data.type?.name || 'normal',
        description: moveDesc.replace(/\f/g, ' ').replace(/\n/g, ' ').replace(/\r/g, ' ')
      }

      setMoveDetailsCache(prev => ({
        ...prev,
        [moveName]: parsedMoveDetail
      }))
    } catch (err) {
      console.error(`Failed to fetch details for move ${moveName}:`, err)
    } finally {
      setMoveLoading(prev => ({ ...prev, [moveName]: false }))
    }
  }

  // 2. downloadCardPng
  const downloadCardPng = async () => {
    const cardEl = document.getElementById('pokemon-collector-card')
    if (!cardEl) return

    try {
      setDownloading(true)

      const controllers = cardEl.querySelector('.sprite-controls')
      if (controllers) {
        controllers.classList.add('opacity-0', 'pointer-events-none')
      }

      await new Promise(resolve => setTimeout(resolve, 300))

      const dataUrl = await toPng(cardEl, {
        cacheBust: true,
        style: {
          transform: 'scale(1)',
          borderRadius: '36px'
        }
      })

      if (controllers) {
        controllers.classList.remove('opacity-0', 'pointer-events-none')
      }

      const link = document.createElement('a')
      link.download = `pokedex-${data.name}-${data.id}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Failed to generate PNG card:', err)
    } finally {
      setDownloading(false)
    }
  }

  // Helper to resolve official artwork URL instantly
  const getArtworkUrl = (id: string) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
  }

  // Recursive evolution chain parser
  const parseEvoChain = useCallback((chainNode: any): any[] => {
    const list: any[] = []
    if (!chainNode) return list

    const id = getId(chainNode.species.url)
    list.push({
      name: chainNode.species.name,
      id: id
    })

    if (chainNode.evolves_to && chainNode.evolves_to.length > 0) {
      chainNode.evolves_to.forEach((next: any) => {
        list.push(...parseEvoChain(next))
      })
    }

    return list
  }, [])

  // Dynamic retro sprites extractor
  const extractRetroSprites = useCallback((versionsObj: any): { gameName: string, spriteUrl: string }[] => {
    const spritesList: { gameName: string, spriteUrl: string }[] = []
    if (!versionsObj) return spritesList

    const formatGameName = (name: string) => {
      return name
        .replace(/-/g, ' ')
        .replace('generation ', 'Gen ')
        .replace('firered leafgreen', 'FireRed / LeafGreen')
        .replace('ruby sapphire', 'Ruby / Sapphire')
        .replace('diamond pearl', 'Diamond / Pearl')
        .replace('heartgold soulsilver', 'HG / SS')
        .replace('black white', 'Black / White')
        .replace('omega ruby alpha sapphire', 'OR / AS')
        .replace('x y', 'X / Y')
        .replace('ultra sun ultra moon', 'Ultra Sun / Moon')
        .toUpperCase()
    }

    Object.keys(versionsObj).forEach((genKey) => {
      const gen = versionsObj[genKey]
      Object.keys(gen).forEach((gameKey) => {
        const gameData = gen[gameKey]
        const url = gameData.front_default
        if (url && typeof url === 'string') {
          spritesList.push({
            gameName: formatGameName(gameKey),
            spriteUrl: url
          })
        }
      })
    })

    return spritesList
  }, [])

  // 1. Fetch deep details
  useEffect(() => {
    let isMounted = true
    const loadDetails = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/pokemon/${currentId}`)
        
        // Fetch species details
        const speciesUrl = response.data.species.url.replace('https://pokeapi.co/api/v2', '')
        const speciesResponse = await api.get(speciesUrl)
        
        // Fetch evolution chain details
        const evoChainUrl = speciesResponse.data.evolution_chain.url.replace('https://pokeapi.co/api/v2', '')
        const evoResponse = await api.get(evoChainUrl)
        const parsedEvoList = parseEvoChain(evoResponse.data.chain)

        // Find Japanese name
        const japanNameObj = speciesResponse.data.names.find(
          (n: any) => n.language.name === 'ja-Hrkt' || n.language.name === 'ja'
        ) || speciesResponse.data.names[0]

        // Find Portuguese description
        const flavorEntry = speciesResponse.data.flavor_text_entries.find(
          (entry: any) => entry.language.name === 'pt' || entry.language.name === 'pt-BR'
        ) || speciesResponse.data.flavor_text_entries.find(
          (entry: any) => entry.language.name === 'en'
        )
        const flavorText = flavorEntry 
          ? flavorEntry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ').replace(/\r/g, ' ') 
          : 'Sem descrição registrada no banco de dados.'

        // Find genus
        const genusEntry = speciesResponse.data.genera.find(
          (g: any) => g.language.name === 'pt' || g.language.name === 'pt-BR'
        ) || speciesResponse.data.genera.find(
          (g: any) => g.language.name === 'en'
        )
        const category = genusEntry ? genusEntry.genus : 'Pokémon Misterioso'

        // 1. Fetch detailed combat abilities descriptions in parallel
        const abilitiesPromises = response.data.abilities.map(async (ab: any) => {
          try {
            const abilityId = getId(ab.ability.url)
            const abRes = await api.get(`/ability/${abilityId}`)
            
            let effectText = 'Sem descrição detalhada registrada.'
            if (abRes.data.effect_entries && abRes.data.effect_entries.length > 0) {
              const effectEntry = abRes.data.effect_entries.find(
                (e: any) => e.language.name === 'pt' || e.language.name === 'pt-BR'
              ) || abRes.data.effect_entries.find(
                (e: any) => e.language.name === 'en'
              )
              if (effectEntry) {
                effectText = effectEntry.effect || effectEntry.short_effect
              }
            }
            if (effectText === 'Sem descrição detalhada registrada.' && abRes.data.flavor_text_entries) {
              const flavorEntry = abRes.data.flavor_text_entries.find(
                (e: any) => e.language.name === 'pt' || e.language.name === 'pt-BR'
              ) || abRes.data.flavor_text_entries.find(
                (e: any) => e.language.name === 'en'
              )
              if (flavorEntry) {
                effectText = flavorEntry.flavor_text
              }
            }

            return {
              name: ab.ability.name,
              is_hidden: ab.is_hidden,
              slot: ab.slot,
              url: ab.ability.url,
              description: effectText.replace(/\f/g, ' ').replace(/\n/g, ' ').replace(/\r/g, ' ')
            }
          } catch (err) {
            console.error(`Failed to fetch description for ability ${ab.ability.name}:`, err)
            return {
              name: ab.ability.name,
              is_hidden: ab.is_hidden,
              slot: ab.slot,
              url: ab.ability.url,
              description: 'Descrição de combate indisponível offline.'
            }
          }
        })
        const parsedAbilities = await Promise.all(abilitiesPromises)

        // 2. Fetch detailed forms in parallel if forms.length > 1
        let parsedForms = []
        if (response.data.forms && response.data.forms.length > 1) {
          const formsPromises = response.data.forms.map(async (f: any) => {
            try {
              const formId = getId(f.url)
              const formRes = await api.get(`/pokemon-form/${formId}`)
              return {
                name: f.name,
                id: formId,
                sprite: formRes.data.sprites.front_default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${formId}.png`,
                is_battle_only: formRes.data.is_battle_only,
                is_mega: formRes.data.is_mega
              }
            } catch (err) {
              console.error(`Failed to fetch form details for ${f.name}:`, err)
              return {
                name: f.name,
                id: getId(f.url),
                sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getId(f.url)}.png`,
                is_battle_only: false,
                is_mega: false
              }
            }
          })
          parsedForms = await Promise.all(formsPromises)
        }

        // 3. Compile sprites gallery
        const spritesGallery = {
          official: response.data.sprites?.other?.['official-artwork']?.front_default || response.data.sprites?.front_default || '',
          official_shiny: response.data.sprites?.other?.['official-artwork']?.front_shiny || response.data.sprites?.front_shiny || '',
          home: response.data.sprites?.other?.home?.front_default || '',
          home_shiny: response.data.sprites?.other?.home?.front_shiny || '',
          dream: response.data.sprites?.other?.dream_world?.front_default || '',
          showdown: response.data.sprites?.other?.showdown?.front_default || response.data.sprites?.front_default || '',
          showdown_shiny: response.data.sprites?.other?.showdown?.front_shiny || response.data.sprites?.front_shiny || '',
          female: response.data.sprites?.front_female || '',
          female_shiny: response.data.sprites?.front_shiny_female || '',
          home_female: response.data.sprites?.other?.home?.front_female || '',
          home_female_shiny: response.data.sprites?.other?.home?.front_shiny_female || ''
        }

        // 4. Parse held items with official sprites and version drops details
        const parsedHeldItems = (response.data.held_items ?? []).map((hi: any) => {
          return {
            name: hi.item.name,
            displayName: hi.item.name
              .replace(/-/g, ' ')
              .replace(/\b\w/g, (char: string) => char.toUpperCase()),
            url: hi.item.url,
            sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${hi.item.name}.png`,
            version_details: hi.version_details.map((vd: any) => ({
              rarity: vd.rarity,
              versionName: vd.version.name.replace(/-/g, ' ').toUpperCase()
            }))
          }
        })

        const parsedData = {
          name: response.data.name,
          japan_name: japanNameObj ? japanNameObj.name : response.data.name,
          id: response.data.id,
          order: response.data.order,
          base_experience: response.data.base_experience,
          description: flavorText,
          category: category,
          capture_rate: speciesResponse.data.capture_rate,
          base_happiness: speciesResponse.data.base_happiness,
          is_legendary: speciesResponse.data.is_legendary,
          is_mythical: speciesResponse.data.is_mythical,
          held_items: parsedHeldItems,
          game_indices: response.data.game_indices ?? [],
          abilities: parsedAbilities,
          moves: response.data.moves.map((move: any) => ({
            name: move.move.name,
            url: move.move.url,
            details: move.version_group_details
          })),
          types: response.data.types.map((type: any) => ({
            slot: type.slot,
            name: type.type.name,
            id: +getId(type.type.url),
            url: type.type.url
          })),
          species: { id: getId(response.data.species.url), ...response.data.species },
          weight: response.data.weight,
          height: response.data.height,
          cries: response.data.cries ?? null,
          stats: response.data.stats.map((st: any) => ({
            name: st.stat.name,
            url: st.stat.url,
            id: getId(st.stat.url),
            effort: st.effort,
            base_stat: st.base_stat
          })),
          image:
            response.data.sprites?.other?.dream_world?.front_default ??
            response.data.sprites?.other['official-artwork']?.front_default ??
            response.data.sprites?.other?.home?.front_default ??
            '/assets/img/fallback.png',
          evolution_chain: parsedEvoList,
          varieties: speciesResponse.data.varieties.map((v: any) => ({
            name: v.pokemon.name,
            id: getId(v.pokemon.url),
            is_default: v.is_default
          })),
          retro_sprites: extractRetroSprites(response.data.sprites?.versions),
          forms: parsedForms,
          sprites_gallery: spritesGallery
        }

        if (isMounted) {
          setData(parsedData)
          setLoading(false)
        }
      } catch (err) {
        console.error('Failed to load pokemon deep details:', err)
        if (isMounted) setLoading(false)
      }
    }
    loadDetails()

    return () => {
      isMounted = false
    }
  }, [currentId, parseEvoChain, extractRetroSprites])

  // Sequential browsing cyclic boundaries (1-1025)
  const prevId = currentId <= 1 ? 1025 : currentId - 1
  const nextId = currentId >= 1025 ? 1 : currentId + 1

  const navigateTo = (id: number) => {
    router.push(`/pokemon/${id}`)
  }

  // Memoised calculations
  const resolvedMainImage = useMemo(() => {
    if (!data) return ''
    const { sprites_gallery } = data
    if (!sprites_gallery) return data.image

    if (selectedArtStyle === 'dream' && sprites_gallery.dream) {
      return sprites_gallery.dream
    }

    if (selectedArtStyle === 'home') {
      if (isFemale && isShiny && sprites_gallery.home_female_shiny) return sprites_gallery.home_female_shiny
      if (isFemale && sprites_gallery.home_female) return sprites_gallery.home_female
      if (isShiny && sprites_gallery.home_shiny) return sprites_gallery.home_shiny
      return sprites_gallery.home || sprites_gallery.official
    }

    if (selectedArtStyle === 'showdown') {
      if (isShiny && sprites_gallery.showdown_shiny) return sprites_gallery.showdown_shiny
      return sprites_gallery.showdown || sprites_gallery.official
    }

    // Default to 'official'
    if (isFemale && isShiny && sprites_gallery.female_shiny) return sprites_gallery.female_shiny
    if (isFemale && sprites_gallery.female) return sprites_gallery.female
    if (isShiny && sprites_gallery.official_shiny) return sprites_gallery.official_shiny
    return sprites_gallery.official
  }, [data, selectedArtStyle, isShiny, isFemale])

  const style = useMemo(() => {
    if (!data) return typeStylingMap.normal
    const primaryType = data.types[0]?.name.toLowerCase() || 'normal'
    return typeStylingMap[primaryType] || typeStylingMap.normal
  }, [data])

  const totalStats = useMemo(() => {
    if (!data) return 0
    return data.stats.reduce((acc: number, curr: any) => acc + curr.base_stat, 0)
  }, [data])

  const getStatPercent = (val: number) => {
    return Math.min(Math.round((val / 255) * 100), 100)
  }

  // Filters moves grid
  const filteredMoves = useMemo(() => {
    if (!data) return []
    if (!moveFilter.trim()) return data.moves
    const query = moveFilter.toLowerCase().trim()
    return data.moves.filter((m: any) => m.name.toLowerCase().includes(query))
  }, [data, moveFilter])

  const statCardConfig: Record<string, { icon: React.FC<any>, label: string, color: string, gradient: string }> = {
    hp: { icon: Heart, label: 'HP / Vida', color: 'text-red-500', gradient: 'from-red-600 to-red-400' },
    attack: { icon: Swords, label: 'Ataque', color: 'text-orange-500', gradient: 'from-orange-600 to-orange-400' },
    defense: { icon: Shield, label: 'Defesa', color: 'text-blue-500', gradient: 'from-blue-600 to-blue-400' },
    'special-attack': { icon: Zap, label: 'Atq. Esp.', color: 'text-yellow-400', gradient: 'from-yellow-500 to-yellow-300' },
    'special-defense': { icon: ShieldAlert, label: 'Def. Esp.', color: 'text-indigo-400', gradient: 'from-indigo-600 to-indigo-400' },
    speed: { icon: Gauge, label: 'Velocidade', color: 'text-emerald-400', gradient: 'from-emerald-600 to-emerald-400' }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center gap-4">
        <div className="relative w-12 h-12 border-4 border-white/5 border-t-secondary rounded-full animate-spin shadow-glow-cyan/20" />
        <span className="text-xs text-slate-400 font-mono tracking-widest uppercase animate-pulse">
          Acessando Banco de Dados...
        </span>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center gap-4 text-center p-4">
        <Star className="w-12 h-12 text-slate-500 animate-bounce-slow" />
        <h2 className="text-lg font-black uppercase text-white tracking-widest">REGISTRO NÃO ENCONTRADO</h2>
        <p className="text-xs text-slate-400 max-w-xs">Não conseguimos recuperar os dados avançados deste Pokémon.</p>
        <Link href="/" className="mt-2 px-6 py-3 text-xs font-black uppercase tracking-widest bg-gradient-to-r from-secondary to-accent text-slate-950 rounded-xl hover:scale-105 active:scale-95 transition-all">
          Retornar ao Painel
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-white flex flex-col relative overflow-hidden bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] pb-10">
      
      {/* 3. Tema Orgânico Dinâmico: Active Type Aura */}
      <div 
        className={`absolute top-[-10%] left-[-10%] w-[60%] h-[40%] rounded-full filter blur-[120px] pointer-events-none transition-all duration-700 ${style.bg}/15 animate-pulse-glow`} 
      />
      <div 
        className={`absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] rounded-full filter blur-[120px] pointer-events-none transition-all duration-700 ${style.bg}/10 animate-pulse-glow`} 
        style={{ animationDelay: '1.2s' }}
      />

      {/* TOP HEADER CONTROLS BAR */}
      <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#040714]/90 backdrop-blur-md px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          {/* Back button and Powered By brand tag */}
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-slate-400 hover:text-secondary hover:scale-[1.02] transition-all font-mono text-xs select-none group"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-secondary transition-colors" /> 
              <span>[ RETORNAR AO NEXUS CORE ]</span>
            </Link>

            <a
              href="https://thiagolins.dev.br"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300 hover:scale-[1.02] active:scale-97 select-none group/logo"
            >
              <span className="text-[7px] font-mono text-slate-500 tracking-wider group-hover/logo:text-slate-400 transition-colors">
                POWERED BY
              </span>
              <div className="flex items-center gap-1.5">
                <div className="relative w-4 h-4 flex items-center justify-center">
                  <img
                    src="/assets/img/thiagolins-dev.svg"
                    alt="Thiago Lins Logo"
                    className="w-4 h-4 object-contain filter brightness-100 group-hover/logo:animate-pulse"
                  />
                </div>
                <span className="font-sans font-black text-[9px] text-white tracking-wide group-hover/logo:text-secondary transition-colors uppercase">
                  Thiago Lins
                </span>
              </div>
            </a>
          </div>

          {/* Sequential cyclic browsing prev/next buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => navigateTo(prevId)}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-xs font-mono font-bold select-none cursor-pointer flex items-center gap-1.5 active:scale-95 transition-all text-slate-300"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> ANTERIOR #{String(prevId).padStart(4, '0')}
            </button>
            <button
              onClick={() => navigateTo(nextId)}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-xs font-mono font-bold select-none cursor-pointer flex items-center gap-1.5 active:scale-95 transition-all text-slate-300"
            >
              PRÓXIMO #{String(nextId).padStart(4, '0')} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 mt-6 md:mt-10 flex-1 flex flex-col lg:flex-row gap-8 relative z-10">
        
        {/* LEFT COLUMN: MAGNIFIED COLLECTOR COMBAT CARD */}
        <div className="flex-1 flex flex-col items-center justify-start lg:max-w-md w-full">
          
          {/* THE CARD CONTAINER */}
          <div 
            id="pokemon-collector-card"
            className={`relative w-full max-w-sm h-[400px] md:h-[500px] rounded-[36px] overflow-hidden border transition-all duration-500 ${
              isShiny 
                ? 'border-amber-500 shadow-[0_20px_50px_rgba(245,158,11,0.35)]' 
                : `${style.border} shadow-[0_20px_50px_rgba(0,0,0,0.6)]`
            } bg-gradient-to-br ${style.gradient} to-[#030616]/98 flex flex-col justify-between p-7 select-none`}
          >
            {/* Tech grid backdrop */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

            {/* Holographic animated scanline sweep */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] via-white/[0.07] to-transparent h-1/2 w-full -z-5 animate-scanline pointer-events-none" />

            {/* Glowing type core */}
            <div className={`absolute w-56 h-56 rounded-full ${
              isShiny ? 'bg-amber-500' : style.bg
            } filter blur-[70px] opacity-35 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 transition-colors duration-500`} />

            {/* Shiny Sparkling Glow Overlay */}
            {isShiny && (
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.1),transparent_70%)] animate-pulse pointer-events-none" />
            )}

            {/* CARD HEADER DETAILS (TCG horizontal name plate!) */}
            <div className="flex justify-between items-center relative z-10">
              
              {/* TCG Style Name & ID Plate */}
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-mono font-black text-white/55 tracking-widest leading-none">
                  NO. {String(data.id).padStart(4, '0')}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xl md:text-2xl font-black tracking-wide text-white uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                    {data.name}
                  </span>
                  
                  {data.cries?.latest && (
                    <button
                      onClick={() => {
                        const audio = new Audio(data.cries.latest)
                        audio.volume = 0.35
                        audio.play().catch(err => console.error("Audio failed:", err))
                      }}
                      className="p-1 rounded bg-white/10 border border-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-all active:scale-90 cursor-pointer shadow-sm select-none"
                      title="Ouvir Rugido"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Type capsule icons */}
              <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 shadow-sm select-none">
                {data.types.map((t: any) => {
                  const IconComp = pokemonTypesIcons[t.name.toLowerCase()]
                  const typeColors = typeStylingMap[t.name.toLowerCase()] || typeStylingMap.normal
                  
                  return (
                    <div 
                      key={t.id} 
                      className={`rounded-full flex items-center justify-center text-white ${typeColors.bg} border border-white/10 shadow-sm`}
                      style={{ width: '28px', height: '28px', minWidth: '28px', minHeight: '28px' }}
                      title={t.name}
                    >
                      {IconComp && (
                        <IconComp 
                          style={{ width: '16px', height: '16px' }} 
                          className="text-white" 
                        />
                      )}
                    </div>
                  )
                })}
              </div>

            </div>

            {/* CARD CENTER: Outlined Japanese name & floating art */}
            <div className="relative flex-1 flex flex-col items-center justify-center my-4">
              
              {/* Thin outlined Japanese font watermark */}
              <div className="font-noto text-6xl md:text-7xl font-black text-white/[0.08] tracking-widest absolute top-4 text-center select-none uppercase pointer-events-none leading-none">
                {data.japan_name}
              </div>

              {/* Rotating circles */}
              <div className={`absolute w-48 h-48 md:w-60 md:h-60 rounded-full border ${isShiny ? 'border-amber-500/20' : 'border-white/10'} bg-white/[0.02] -z-10 animate-spin-slow`} />
              <div className="absolute w-38 h-38 md:w-48 md:h-48 rounded-full border border-white/5 bg-white/[0.01] -z-10" />

              {/* Artwork */}
              <div className="relative w-48 h-48 md:w-56 md:h-56 drop-shadow-[0_16px_30px_rgba(0,0,0,0.65)] hover:scale-105 transition-transform duration-500 animate-float flex items-center justify-center">
                {resolvedMainImage ? (
                  <img
                    src={resolvedMainImage}
                    alt={data.name}
                    crossOrigin="anonymous"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <Image
                      src={data.image}
                      alt={data.name}
                      fill
                      priority
                      className="object-contain"
                    />
                  </div>
                )}
              </div>

            </div>

            {/* Hologram Sprite controls floating panel */}
            <div className="sprite-controls flex flex-col items-center gap-2 mt-auto w-full z-20 select-none transition-all duration-300">
              {/* Style selectors pill */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-[#040714]/85 backdrop-blur-md border border-white/10 shadow-lg text-[9px] font-black font-mono">
                {[
                  { id: 'official', label: 'OFICIAL' },
                  { id: 'home', label: '3D HOME' },
                  { id: 'dream', label: 'VETOR', disabled: !data.sprites_gallery?.dream },
                  { id: 'showdown', label: 'LIVE', disabled: !data.sprites_gallery?.showdown }
                ].map(styleOpt => (
                  <button
                    key={styleOpt.id}
                    disabled={styleOpt.disabled}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedArtStyle(styleOpt.id as any)
                    }}
                    className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                      selectedArtStyle === styleOpt.id
                        ? 'bg-secondary text-slate-950 font-black'
                        : 'text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none'
                    }`}
                  >
                    {styleOpt.label}
                  </button>
                ))}
              </div>

              {/* Shiny & Gender switches */}
              <div className="flex gap-2">
                {/* Shiny Toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsShiny(!isShiny)
                  }}
                  className={`px-3 py-1 rounded-xl border text-[9px] font-black font-mono flex items-center gap-1 transition-all cursor-pointer ${
                    isShiny
                      ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-glow-electric animate-pulse'
                      : 'bg-[#040714]/85 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <span>✨ SHINY</span>
                </button>

                {/* Female Toggle (if available) */}
                {(data.sprites_gallery?.female || data.sprites_gallery?.home_female) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsFemale(!isFemale)
                    }}
                    className={`px-3 py-1 rounded-xl border text-[9px] font-black font-mono flex items-center gap-1 transition-all cursor-pointer ${
                      isFemale
                        ? 'bg-pink-500/20 border-pink-500 text-pink-400'
                        : 'bg-[#040714]/85 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <span>♀️ FÊMEA</span>
                  </button>
                )}
              </div>
            </div>

            {/* CARD FOOTER: PHYSICAL CATEGORY & METRICS */}
            <div className="flex justify-between items-end relative z-10 mt-2">
              
              {/* Faint Texturing Vertical Name */}
              <div className="absolute left-0 bottom-0 select-none pointer-events-none origin-bottom-left -rotate-90 -translate-y-4 translate-x-2">
                <span className="text-[2.5rem] md:text-[3rem] font-black tracking-widest text-white/[0.06] uppercase font-sans whitespace-nowrap leading-none block">
                  {data.name}
                </span>
              </div>

              {/* Right Side: Category & physical metrics */}
              <div className="ml-auto text-right space-y-1.5 font-mono">
                <div className="text-[10px] text-white/70 tracking-wider uppercase font-black">
                  {data.category}
                </div>
                
                <div className="flex gap-4 text-right text-[11px] font-bold text-white/90">
                  <div className="flex items-center gap-1">
                    <Weight className="w-3.5 h-3.5 text-white/60" />
                    <span>{(data.weight / 10).toFixed(1)} kg</span>
                  </div>
                  <div className="flex items-center gap-1 border-l border-white/10 pl-2">
                    <Ruler className="w-3.5 h-3.5 text-white/60" />
                    <span>{(data.height / 10).toFixed(1)} m</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Sound Roar Button beneath card */}
          {data.cries?.latest && (
            <button
              onClick={() => {
                const audio = new Audio(data.cries.latest)
                audio.volume = 0.4
                audio.play().catch(err => console.error("Audio failed:", err))
              }}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-secondary/15 border border-secondary/30 text-secondary hover:text-white hover:bg-secondary hover:shadow-glow-cyan/35 active:scale-95 transition-all cursor-pointer font-black text-xs uppercase tracking-widest mt-6 w-full shadow-lg select-none"
            >
              <Volume2 className="w-4 h-4 animate-bounce-slow" /> EMITIR RUGIDO REAL
            </button>
          )}

          {/* Download Card PNG Button */}
          <button
            onClick={downloadCardPng}
            disabled={downloading}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-accent to-emerald-500 text-slate-950 hover:shadow-glow-cyan/35 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer font-black text-xs uppercase tracking-widest mt-3 w-full shadow-lg select-none disabled:opacity-50 disabled:pointer-events-none"
          >
            {downloading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> RENDERIZANDO PNG...
              </>
            ) : (
              <>
                <Library className="w-4 h-4" /> SALVAR CARD EM PNG
              </>
            )}
          </button>

        </div>

        {/* RIGHT COLUMN: HIGH-TECH CYBER DEEP LOGS SHEET CONSOLE */}
        <div className="flex-[1.4] flex flex-col">
          
          {/* Cyber Menu Tabs */}
          <div className="flex gap-1.5 md:gap-2 border-b border-white/10 pb-4 mb-6 overflow-x-auto custom-scrollbar select-none">
            {[
              { key: 'about', label: 'Sobre' },
              { key: 'stats', label: 'Combate' },
              { key: 'abilities', label: 'Habilidades' },
              { key: 'evolutions', label: 'Evoluções' },
              { key: 'varieties', label: 'Variedades' },
              { key: 'retro', label: 'Sprites Retrô' },
              { key: 'moves', label: 'Arsenal' }
            ].map((tab) => {
              const isActive = activeTab === tab.key

              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-4 py-2.5 text-xs font-black tracking-widest uppercase rounded-xl transition-all duration-300 active:scale-95 cursor-pointer border whitespace-nowrap ${
                    isActive
                      ? `${style.bg} ${style.text} ${style.border} shadow-glow-default scale-102`
                      : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              )}
            )}
          </div>

          {/* Database Panel terminal */}
          <div className="flex-1 bg-slate-950/40 border border-white/5 rounded-[32px] p-6 md:p-8 shadow-inner relative overflow-hidden flex flex-col justify-start min-h-[380px]">
            {/* Ambient terminal cyber mesh */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

            {/* TAB: ABOUT */}
            {activeTab === 'about' && (
              <div className="space-y-6 animate-fadeIn relative z-10 w-full text-left">
                <div className="relative p-5 rounded-2xl border-l-4 border-secondary bg-secondary/5 border-y border-r border-secondary/15 backdrop-blur-md">
                  <div className="absolute right-4 bottom-4 text-secondary/5 pointer-events-none">
                    <Compass className="w-20 h-20" />
                  </div>
                  <div className="text-[10px] font-black text-secondary tracking-widest uppercase mb-2 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 animate-spin-slow" /> BANCO DE PESQUISAS // DADOS OFICIAIS
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed italic">
                    "{data.description}"
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
                  
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="text-[9px] text-slate-500 font-black uppercase">TAXA DE CAPTURA</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-base font-black text-white">{data.capture_rate} / 255</span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                        {Math.round((data.capture_rate / 255) * 100)}%
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="text-[9px] text-slate-500 font-black uppercase">FELICIDADE BASE</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-base font-black text-white">{data.base_happiness}</span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-secondary/10 text-secondary">
                        {data.base_happiness >= 70 ? 'AMIGÁVEL' : 'HOSTIL'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="text-[9px] text-slate-500 font-black uppercase">EXPERIÊNCIA BASE</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-base font-black text-white">{data.base_experience} XP</span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">
                        LEVEL UP
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="text-[9px] text-slate-500 font-black uppercase">RATING DE RARIDADE</div>
                    <div className="flex items-center mt-1">
                      {data.is_legendary ? (
                        <span className="text-xs font-black px-2.5 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/30 shadow-glow-pink animate-pulse">
                          POKÉMON LENDÁRIO 👑
                        </span>
                      ) : data.is_mythical ? (
                        <span className="text-xs font-black px-2.5 py-1 rounded bg-accent/20 text-accent border border-accent/30 shadow-glow-cyan animate-pulse">
                          POKÉMON MÍTICO ✨
                        </span>
                      ) : (
                        <span className="text-xs font-black px-2.5 py-1 rounded bg-white/5 text-slate-300">
                          POKÉMON COMUM ⚔️
                        </span>
                      )}
                    </div>
                  </div>

                </div>

                {/* Section: Held Items */}
                <div className="pt-5 border-t border-white/10 space-y-3.5">
                  <div className="text-[10px] font-mono font-black text-slate-500 tracking-widest uppercase mb-1">
                    ITENS PORTADOS NA NATUREZA // HELD ITEMS
                  </div>
                  {data.held_items && data.held_items.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 font-mono">
                      {data.held_items.map((hi: any) => (
                        <div
                          key={hi.name}
                          className="p-3.5 rounded-2xl border border-white/5 bg-white/5 flex items-center justify-between gap-3 text-left hover:bg-white/10 hover:border-white/10 transition-all duration-300"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-950/40 border border-white/5 flex items-center justify-center p-1.5 flex-shrink-0 shadow-sm">
                              <img
                                src={hi.sprite}
                                alt={hi.name}
                                className="w-8 h-8 object-contain"
                                crossOrigin="anonymous"
                                onError={(e: any) => {
                                  e.target.src = '/assets/img/fallback.png'
                                }}
                              />
                            </div>
                            <div>
                              <span className="text-xs font-black text-white font-sans tracking-wide block">
                                {hi.displayName}
                              </span>
                              <span className="text-[8px] text-slate-500 block uppercase">
                                ITEM DE COMBATE
                              </span>
                            </div>
                          </div>

                          {/* version drops list */}
                          <div className="flex flex-col gap-1 max-h-[48px] overflow-y-auto pr-1 text-right custom-scrollbar">
                            {hi.version_details.slice(0, 3).map((vd: any, idx: number) => (
                              <span
                                key={`${vd.versionName}-${idx}`}
                                className="text-[7px] font-black px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase inline-block whitespace-nowrap ml-auto"
                              >
                                {vd.versionName}: {vd.rarity}%
                              </span>
                            ))}
                            {hi.version_details.length > 3 && (
                              <span className="text-[6px] text-slate-500 font-bold uppercase">
                                +{hi.version_details.length - 3} VERSÕES
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl border border-white/5 bg-slate-950/20 text-center select-none">
                      <span className="text-[10px] text-slate-600 font-mono block uppercase">
                        Nenhum item especial carregado por esta espécie na natureza.
                      </span>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB: COMBAT STATS */}
            {activeTab === 'stats' && (
              <div className="space-y-6 animate-fadeIn relative z-10 w-full text-left">
                
                {/* Total Stats Rating Badge */}
                <div className="flex items-center justify-between p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 relative overflow-hidden shadow-glow-electric/5">
                  <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Star className="w-5 h-5 fill-amber-500/20 animate-spin-slow" />
                    </div>
                    <div className="text-left">
                      <div className="text-[10px] text-amber-500/80 font-black tracking-widest uppercase">ÍNDICE GERAL DE COMBATE // POWER LEVEL</div>
                      <div className="text-xs text-slate-400 font-mono">Soma Absoluta dos Atributos Primários</div>
                    </div>
                  </div>
                  <div className="text-3xl font-black text-amber-400 tracking-widest font-mono drop-shadow-[0_2px_10px_rgba(245,158,11,0.4)] animate-pulse">
                    {totalStats}
                  </div>
                </div>

                {/* Grid of stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.stats.map((stat: any) => {
                    const normName = stat.name.toLowerCase()
                    const config = statCardConfig[normName] || { icon: Star, label: stat.name, color: 'text-slate-300', gradient: 'from-slate-500 to-slate-400' }
                    const IconComponent = config.icon
                    const percent = getStatPercent(stat.base_stat)

                    return (
                      <div 
                        key={stat.name}
                        className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between space-y-3 hover:bg-white/10 hover:border-white/10 hover:shadow-glow-default transition-all duration-300"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2.5">
                            <div className={`p-2 rounded-xl bg-white/5 border border-white/5 ${config.color}`}>
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest font-mono">
                              {config.label}
                            </span>
                          </div>
                          <span className="text-base font-black text-white font-mono leading-none">
                            {stat.base_stat}
                          </span>
                        </div>

                        {/* Reactor neon progress bar */}
                        <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden border border-white/5">
                          <div 
                            className={`h-full rounded-full bg-gradient-to-r ${config.gradient} transition-all duration-1000 ease-out`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* TAB: ABILITIES */}
            {activeTab === 'abilities' && (
              <div className="space-y-4 animate-fadeIn relative z-10 w-full text-left">
                <div className="text-[10px] font-mono font-black text-slate-500 tracking-widest uppercase mb-2">
                  HABILIDADES DE COMBATE REGISTRADAS
                </div>
                
                <div className="grid grid-cols-1 gap-3.5">
                  {data.abilities.map((ab: any) => (
                    <div 
                      key={ab.name} 
                      className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-black text-white capitalize font-sans">{ab.name.replace(/-/g, ' ')}</span>
                          {ab.is_hidden ? (
                            <span className="text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/30 shadow-glow-cyan animate-pulse">
                              Habilidade Oculta
                            </span>
                          ) : (
                            <span className="text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full bg-white/10 text-white/55">
                              Normal
                            </span>
                          )}
                        </div>
                        <div className="text-[9px] text-slate-500 font-mono uppercase">Slot do Atributo: {ab.slot}</div>

                        <p className="text-xs text-slate-300 leading-relaxed mt-2.5 font-sans font-medium italic">
                          "{ab.description}"
                        </p>
                      </div>

                      <div className="text-slate-400 font-mono text-[9px] bg-slate-950/40 border border-white/5 px-3 py-1.5 rounded-xl self-start sm:self-auto">
                        API ID // {getId(ab.url)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: EVOLUTION CHAIN */}
            {activeTab === 'evolutions' && (
              <div className="space-y-6 animate-fadeIn relative z-10 w-full text-left flex flex-col flex-1">
                <div className="text-[10px] font-mono font-black text-slate-500 tracking-widest uppercase">
                  CADEIA EVOLUTIVA DA ESPÉCIE // EVOLUTIONS
                </div>

                <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-6 py-4 overflow-x-auto w-full select-none custom-scrollbar">
                  {data.evolution_chain.map((evo: any, index: number) => {
                    const artworkUrl = getArtworkUrl(evo.id)
                    const isSelf = parseInt(evo.id) === currentId

                    return (
                      <React.Fragment key={evo.id}>
                        {/* Transition arrow symbol */}
                        {index > 0 && (
                          <div className="flex items-center justify-center p-2 rounded-full border border-white/5 bg-white/5 text-secondary animate-pulse-glow shadow-glow-cyan/5 -mx-2 rotate-90 sm:rotate-0">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        )}

                        {/* Evolutions mini card */}
                        <Link
                          href={`/pokemon/${evo.id}`}
                          className={`group relative flex flex-col items-center justify-between p-4 w-[140px] h-[190px] rounded-2xl border text-center transition-all duration-300 hover:-translate-y-2 ${
                            isSelf 
                              ? 'border-secondary bg-[#080d24]/80 shadow-glow-cyan/15'
                              : 'border-white/5 bg-slate-950/50 hover:bg-slate-950/80 hover:border-white/10'
                          }`}
                        >
                          <span className="text-[8px] font-mono text-white/35">#{String(evo.id).padStart(4, '0')}</span>
                          
                          {/* Mini-Artwork */}
                          <div className="relative w-16 h-16 my-2 drop-shadow-[0_8px_12px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-300">
                            <Image
                              src={artworkUrl}
                              alt={evo.name}
                              fill
                              sizes="64px"
                              className="object-contain"
                            />
                          </div>

                          <span className="text-xs font-black capitalize text-white group-hover:text-secondary transition-colors truncate w-full">
                            {evo.name}
                          </span>
                          
                          <span className="text-[7px] font-mono text-slate-500 uppercase">
                            {isSelf ? 'Lutador Ativo' : 'VER REGISTRO'}
                          </span>
                        </Link>
                      </React.Fragment>
                    )
                  })}
                </div>
              </div>
            )}

            {/* TAB: SPECIES VARIETIES */}
            {activeTab === 'varieties' && (
              <div className="space-y-4 animate-fadeIn relative z-10 w-full text-left flex flex-col flex-1">
                <div className="text-[10px] font-mono font-black text-slate-500 tracking-widest uppercase">
                  OUTRAS FORMAS REGISTRADAS DA MESMA ESPÉCIE // VARIETIES
                </div>

                {data.varieties.length <= 1 ? (
                  <div className="p-5 rounded-2xl border border-white/5 bg-slate-950/20 text-center select-none">
                    <span className="text-[10px] text-slate-500 font-mono block uppercase">
                      Sem Variedades Regionais/Mega de Espécie Catalogadas.
                    </span>
                  </div>
                ) : (
                  <div className="overflow-y-auto max-h-[190px] pr-2 custom-scrollbar">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {data.varieties.map((v: any) => {
                        const isSelf = parseInt(v.id) === currentId
                        const artworkUrl = getArtworkUrl(v.id)

                        return (
                          <Link 
                            key={v.name}
                            href={`/pokemon/${v.id}`}
                            className={`p-3.5 rounded-2xl border transition-all duration-300 hover:scale-[1.02] flex items-center justify-between gap-3 text-left ${
                              isSelf
                                ? 'bg-secondary/10 border-secondary/30 text-secondary'
                                : 'bg-white/5 border-white/5 text-white hover:bg-white/10 hover:border-white/10 hover:shadow-glow-default/5'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              {/* Variety mini artwork */}
                              <div className="relative w-8 h-8 flex-shrink-0 bg-slate-950/50 rounded-lg p-0.5">
                                <Image
                                  src={artworkUrl}
                                  alt={v.name}
                                  width={28}
                                  height={28}
                                  className="object-contain"
                                />
                              </div>
                              <div className="truncate">
                                <span className="text-[8px] font-mono text-slate-500 block">ID: #{v.id}</span>
                                <span className="text-xs font-black capitalize truncate block tracking-wide">{v.name.replace(/-/g, ' ')}</span>
                              </div>
                            </div>
                            
                            {v.is_default ? (
                              <span className="text-[7px] font-black px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase whitespace-nowrap">Default</span>
                            ) : (
                              <span className="text-[7px] font-black px-1.5 py-0.5 rounded bg-white/10 text-slate-400 border border-white/5 uppercase whitespace-nowrap">Variante</span>
                            )}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Subforms section: Cosmetic and aesthetic subforms */}
                {data.forms && data.forms.length > 1 && (
                  <div className="mt-4 pt-4 border-t border-white/10 space-y-3.5">
                    <div className="text-[10px] font-mono font-black text-slate-500 tracking-widest uppercase">
                      VARIAÇÕES ESTÉTICAS E FORMAS ALTERNATIVAS // FORMS
                    </div>
                    <div className="overflow-y-auto max-h-[190px] pr-2 custom-scrollbar">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {data.forms.map((f: any) => (
                          <div
                            key={f.name}
                            className="p-3.5 rounded-2xl border border-white/5 bg-white/5 flex items-center justify-between gap-3 text-left hover:bg-white/10 transition-all duration-300"
                          >
                            <div className="flex items-center gap-3 truncate">
                              <div className="w-8 h-8 rounded-lg bg-slate-950/40 border border-white/5 flex items-center justify-center p-0.5 flex-shrink-0 shadow-sm">
                                <img
                                  src={f.sprite}
                                  alt={f.name}
                                  className="w-7 h-7 object-contain"
                                  crossOrigin="anonymous"
                                  onError={(e: any) => {
                                    e.target.src = '/assets/img/fallback.png'
                                  }}
                                />
                              </div>
                              <div className="truncate font-mono">
                                <span className="text-[8px] text-slate-500 block">FORM ID: #{f.id}</span>
                                <span className="text-xs font-black text-white font-sans tracking-wide block capitalize truncate">
                                  {f.name.replace(/-/g, ' ')}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col gap-1 items-end select-none">
                              {f.is_mega && (
                                <span className="text-[6px] font-black px-1 rounded bg-red-500/20 text-red-400 border border-red-500/30 uppercase">MEGA</span>
                              )}
                              {f.is_battle_only ? (
                                <span className="text-[6px] font-black px-1 rounded bg-accent/25 text-accent border border-accent/30 uppercase">BATALHA</span>
                              ) : (
                                <span className="text-[6px] font-black px-1 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 uppercase">GERAL</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: RETRO SPRITES GALLERY */}
            {activeTab === 'retro' && (
              <div className="space-y-4 animate-fadeIn relative z-10 w-full text-left flex flex-col flex-1">
                <div className="text-[10px] font-mono font-black text-slate-500 tracking-widest uppercase">
                  GALERIA CRONOLÓGICA DE SPRITES RETRÔ // PIXEL ART
                </div>

                {data.retro_sprites.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-2 border border-white/5 rounded-2xl bg-slate-950/20">
                    <Layers className="w-8 h-8 text-slate-600 animate-pulse" />
                    <span className="text-[10px] text-slate-500 font-black uppercase font-mono tracking-widest">Sem Sprites</span>
                    <p className="text-xs text-slate-400 max-w-xs">Nenhum sprite clássico catalogado nas pastas de versões.</p>
                  </div>
                ) : (
                  <div className="overflow-y-auto max-h-[300px] pr-2 flex-1 custom-scrollbar">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {data.retro_sprites.map((sp: any, idx: number) => (
                        <div 
                          key={`${sp.gameName}-${idx}`}
                          className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:scale-[1.03] transition-all flex flex-col items-center justify-between text-center min-h-[110px]"
                        >
                          {/* Pixel Art Sprite Image */}
                          <div className="relative w-12 h-12 flex items-center justify-center my-1 select-none pointer-events-none">
                            <Image
                              src={sp.spriteUrl}
                              alt={sp.gameName}
                              fill
                              unoptimized
                              className="object-contain pixelated"
                            />
                          </div>

                          <div className="text-[8px] font-mono font-black text-secondary uppercase tracking-wider block leading-tight truncate w-full mt-2" title={sp.gameName}>
                            {sp.gameName}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: MOVES */}
            {activeTab === 'moves' && (
              <div className="space-y-4 animate-fadeIn relative z-10 w-full text-left flex flex-col flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 select-none">
                  <div className="text-[10px] font-mono font-black text-slate-500 tracking-widest uppercase">
                    ARSENAL COMPLETO DE GOLPES // MOVES
                  </div>
                  
                  {/* Search moves input */}
                  <div className="relative max-w-xs w-full">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Filtrar golpes..."
                      value={moveFilter}
                      onChange={(e) => setMoveFilter(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-[10px] rounded-lg border border-white/10 bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:border-secondary font-mono"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto max-h-[280px] pr-2 space-y-2 custom-scrollbar">
                  {filteredMoves.length === 0 ? (
                    <div className="text-[10px] text-slate-600 font-mono py-12 text-center">Nenhum golpe correspondente.</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {filteredMoves.map((m: any) => {
                        const lvlDetail = m.details.find((d: any) => d.level_learned_at > 0)
                        const lvl = lvlDetail ? lvlDetail.level_learned_at : 0
                        const method = lvlDetail ? lvlDetail.move_learn_method.name : 'machine'
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
                            }`}
                          >
                            {/* Toggle header */}
                            <button
                              onClick={() => toggleMoveDetails(m.name, m.url)}
                              className="w-full flex items-center justify-between px-4 py-3 font-mono text-[10px] text-left text-white cursor-pointer select-none"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <div className={`w-2 h-2 rounded-full ${style.bg} shadow-sm animate-pulse`} />
                                <span className="capitalize font-sans font-bold truncate">{m.name.replace(/-/g, ' ')}</span>
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

                            {/* Details Accordion Panel */}
                            {isExpanded && (
                              <div className="px-4 pb-4 pt-1 border-t border-white/5 font-mono text-[9px] text-slate-300 space-y-3 animate-fadeIn">
                                {isLoading ? (
                                  <div className="flex items-center justify-center py-4 gap-2 select-none">
                                    <div className="w-4 h-4 border-2 border-white/5 border-t-secondary rounded-full animate-spin" />
                                    <span className="text-[8px] tracking-widest text-slate-500 uppercase animate-pulse">Sintonizando Frequência...</span>
                                  </div>
                                ) : details ? (
                                  <div className="space-y-3">
                                    {/* Stats Grid */}
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
                                        <span className={`px-1.5 py-0.5 rounded text-[7px] font-black uppercase ${
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
                                    
                                    {/* Description */}
                                    <div className="p-3 rounded-lg bg-slate-950/20 border border-white/5">
                                      <p className="text-xs text-slate-200 leading-relaxed font-sans font-normal italic">
                                        "{details.description}"
                                      </p>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-center py-2 text-red-400 select-none">Falha ao decodificar atributos do golpe.</div>
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
            )}

          </div>

        </div>

      </main>

    </div>
  )
}
