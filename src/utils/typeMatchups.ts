// Pokémon Type Matchups Utilitário Determinístico

export const ALL_TYPES = [
  'normal', 'fire', 'water', 'grass', 'electric', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
] as const

export type PokemonType = typeof ALL_TYPES[number]

// Relações de dano focado no DEFENSOR (quais tipos de ataques dão x2, x0.5 ou x0 em cada tipo de defensor)
const DEFENDER_MATCHUPS: Record<PokemonType, { weaknesses: PokemonType[], resistances: PokemonType[], immunities: PokemonType[] }> = {
  normal: {
    weaknesses: ['fighting'],
    resistances: [],
    immunities: ['ghost']
  },
  fire: {
    weaknesses: ['water', 'ground', 'rock'],
    resistances: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'],
    immunities: []
  },
  water: {
    weaknesses: ['grass', 'electric'],
    resistances: ['fire', 'water', 'ice', 'steel'],
    immunities: []
  },
  grass: {
    weaknesses: ['fire', 'ice', 'poison', 'flying', 'bug'],
    resistances: ['water', 'grass', 'electric', 'ground'],
    immunities: []
  },
  electric: {
    weaknesses: ['ground'],
    resistances: ['electric', 'flying', 'steel'],
    immunities: []
  },
  ice: {
    weaknesses: ['fire', 'fighting', 'rock', 'steel'],
    resistances: ['ice'],
    immunities: []
  },
  fighting: {
    weaknesses: ['flying', 'psychic', 'fairy'],
    resistances: ['bug', 'rock', 'dark'],
    immunities: []
  },
  poison: {
    weaknesses: ['ground', 'psychic'],
    resistances: ['grass', 'fighting', 'poison', 'bug', 'fairy'],
    immunities: []
  },
  ground: {
    weaknesses: ['water', 'grass', 'ice'],
    resistances: ['poison', 'rock'],
    immunities: ['electric']
  },
  flying: {
    weaknesses: ['electric', 'ice', 'rock'],
    resistances: ['grass', 'fighting', 'bug'],
    immunities: ['ground']
  },
  psychic: {
    weaknesses: ['bug', 'ghost', 'dark'],
    resistances: ['fighting', 'psychic'],
    immunities: []
  },
  bug: {
    weaknesses: ['fire', 'flying', 'rock'],
    resistances: ['grass', 'fighting', 'ground'],
    immunities: []
  },
  rock: {
    weaknesses: ['water', 'grass', 'fighting', 'ground', 'steel'],
    resistances: ['normal', 'fire', 'poison', 'flying'],
    immunities: []
  },
  ghost: {
    weaknesses: ['ghost', 'dark'],
    resistances: ['poison', 'bug'],
    immunities: ['normal', 'fighting']
  },
  dragon: {
    weaknesses: ['ice', 'dragon', 'fairy'],
    resistances: ['fire', 'water', 'grass', 'electric'],
    immunities: []
  },
  dark: {
    weaknesses: ['fighting', 'bug', 'fairy'],
    resistances: ['ghost', 'dark'],
    immunities: ['psychic']
  },
  steel: {
    weaknesses: ['fire', 'fighting', 'ground'],
    resistances: ['normal', 'grass', 'ice', 'flying', 'psychic', 'bug', 'rock', 'dragon', 'steel', 'fairy'],
    immunities: ['poison']
  },
  fairy: {
    weaknesses: ['poison', 'steel'],
    resistances: ['fighting', 'bug', 'dark'],
    immunities: ['dragon']
  }
}

/**
 * Calcula a eficácia de cada um dos 18 tipos de ataque contra um defensor mono ou bi-tipo.
 * Retorna um objeto mapeando cada tipo de ataque ao seu multiplicador (4, 2, 1, 0.5, 0.25, 0).
 */
export function getTypeEffectiveness(defenderTypes: string[]): Record<PokemonType, number> {
  const effectiveness: Record<PokemonType, number> = {} as any

  // Inicializa todos os tipos com dano neutro x1
  ALL_TYPES.forEach(t => {
    effectiveness[t] = 1
  })

  // Normaliza os tipos passados (minúsculo e filtrando os válidos)
  const activeTypes = defenderTypes
    .map(t => t.toLowerCase() as PokemonType)
    .filter(t => ALL_TYPES.includes(t))

  // Calcula o multiplicador cumulativo de cada tipo de ataque
  ALL_TYPES.forEach(atkType => {
    activeTypes.forEach(defType => {
      const relation = DEFENDER_MATCHUPS[defType]
      if (!relation) return

      if (relation.immunities.includes(atkType)) {
        effectiveness[atkType] *= 0
      } else if (relation.weaknesses.includes(atkType)) {
        effectiveness[atkType] *= 2
      } else if (relation.resistances.includes(atkType)) {
        effectiveness[atkType] *= 0.5
      }
    })
  })

  return effectiveness
}
