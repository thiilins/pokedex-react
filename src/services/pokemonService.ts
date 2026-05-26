import getId from '@/utils/getId'
import { cacheLife, cacheTag } from 'next/cache'

const BASE_URL = 'https://pokeapi.co/api/v2'

// Função auxiliar interna para realizar requisições normais sem opções legadas de cache
async function fetchFromApi(path: string) {
  const cleanPath = path.startsWith('http')
    ? path
    : `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`

  // Requisição feita de forma normal, delegando o caching inteiramente ao Next.js 16
  const res = await fetch(cleanPath)

  if (!res.ok) {
    throw new Error(
      `Failed to fetch from PokeAPI: ${res.statusText} at ${cleanPath}`
    )
  }

  const data = await res.json()
  return { data }
}

// Auxiliares internos para o parser no lado do servidor (SSR)
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

/**
 * Service SSR com a diretiva 'use cache' no nível da função (conforme a doc)
 * Busca a listagem indexada de todos os 1025 Pokémon de forma isolada no servidor.
 */
export async function getCachedAllPokemons() {
  'use cache'
  cacheLife('max')
  cacheTag('all-pokemons')
  try {
    const res = await fetchFromApi('/pokemon?limit=1025')
    return res.data.results.map((item: any) => ({
      name: item.name,
      url: item.url,
      id: getId(item.url)
    }))
  } catch (err) {
    console.error('Error in pokemonService.getCachedAllPokemons:', err)
    throw err
  }
}

/**
 * Service SSR com a diretiva 'use cache' no nível da função (conforme a doc)
 * Busca e consolida os detalhes completos de um Pokémon por ID no servidor.
 */
export async function getCachedPokemonDetail(id: number) {
  'use cache'
  cacheLife('max')
  cacheTag(`pokemon-${id}`)

  try {
    // pokemon → species → evolution_chain é uma cadeia de dependência real.
    // Antes buscávamos /pokemon/${id} duas vezes (a 2ª só pra pegar species.url,
    // que já vem na 1ª resposta) — fetch redundante removido.
    const res = await fetchFromApi(`/pokemon/${id}`)
    const speciesRes = await fetchFromApi(
      res.data.species.url.replace('https://pokeapi.co/api/v2', '')
    )

    const evoRes = await fetchFromApi(
      speciesRes.data.evolution_chain.url.replace(
        'https://pokeapi.co/api/v2',
        ''
      )
    )

    const abilities = await Promise.all(
      res.data.abilities.map(async (ab: any) => {
        try {
          const abRes = await fetchFromApi(`/ability/${getId(ab.ability.url)}`)
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
                const fRes = await fetchFromApi(`/pokemon-form/${getId(f.url)}`)
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
          (e: any) => e.language.name === 'pt-BR' || e.language.name === 'pt'
        ) ||
        speciesRes.data.flavor_text_entries.find(
          (e: any) => e.language.name === 'en'
        )
      )?.flavor_text?.replace(/\f|\n|\r/g, ' ') || 'Sem descrição.'

    const genus =
      (
        speciesRes.data.genera.find(
          (g: any) => g.language.name === 'pt-BR' || g.language.name === 'pt'
        ) || speciesRes.data.genera.find((g: any) => g.language.name === 'en')
      )?.genus || ''

    const japanName =
      (
        speciesRes.data.names.find(
          (n: any) => n.language.name === 'ja-Hrkt' || n.language.name === 'ja'
        ) || speciesRes.data.names[0]
      )?.name || res.data.name

    const sg = res.data.sprites
    return {
      id: res.data.id,
      name: res.data.name,
      japan_name: japanName,
      order: res.data.order,
      species: {
        name: res.data.species.name,
        url: res.data.species.url
      },
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
        showdown: sg?.other?.showdown?.front_default || sg?.front_default || '',
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
  } catch (err) {
    console.error(
      `Error in pokemonService.getCachedPokemonDetail for ID ${id}:`,
      err
    )
    throw err
  }
}

/**
 * Service SSR com a diretiva 'use cache' no nível da função (conforme a doc)
 * Busca os detalhes de um golpe de Pokémon no servidor de forma isolada.
 */
export async function getCachedMoveDetail(name: string, url: string) {
  'use cache'
  cacheLife('max')
  cacheTag(`move-${getId(url)}`)
  try {
    const res = await fetchFromApi(`/move/${getId(url)}`)
    const eff = res.data.effect_entries?.find(
      (e: any) => e.language.name === 'en'
    )
    const flv = res.data.flavor_text_entries?.find(
      (e: any) => e.language.name === 'en'
    )
    return {
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
  } catch (err) {
    console.error(
      `Error in pokemonService.getCachedMoveDetail for move ${name}:`,
      err
    )
    throw err
  }
}

/**
 * Service SSR com a diretiva 'use cache' no nível da função (conforme a doc)
 * Busca os Pokémon filtrados por tipo no servidor de forma isolada.
 */
export async function getCachedPokemonsByType(selectedType: string) {
  'use cache'
  cacheLife('max')
  cacheTag(`type-${selectedType.toLowerCase()}`)
  try {
    const res = await fetchFromApi(`/type/${selectedType.toLowerCase()}`)
    return res.data.pokemon
      .map((item: any) => ({
        name: item.pokemon.name,
        url: item.pokemon.url,
        id: getId(item.pokemon.url)
      }))
      .filter((p: any) => parseInt(p.id) <= 1025)
  } catch (err) {
    console.error(
      `Error in pokemonService.getCachedPokemonsByType for type ${selectedType}:`,
      err
    )
    throw err
  }
}
