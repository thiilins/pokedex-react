export const typeStylesMap: Record<
  string,
  {
    color: string
    glow: string
    gradient: string
    literalBg: string
    flatColor: string
    dmgBg: string
    tcgBorder: string
  }
> = {
  fairy: {
    color: '#ff76ff',
    glow: 'rgba(255, 118, 255, 0.4)',
    gradient: 'from-[#2e0821]',
    literalBg: 'linear-gradient(135deg, #2e0821 0%, #030712 100%)',
    flatColor: '#ec4899',
    dmgBg: '#8bac0f',
    tcgBorder: '#f472b6'
  },
  fire: {
    color: '#ff4f30',
    glow: 'rgba(255, 79, 48, 0.4)',
    gradient: 'from-[#3c0c00]',
    literalBg: 'linear-gradient(135deg, #3c0c00 0%, #030712 100%)',
    flatColor: '#ef4444',
    dmgBg: '#8bac0f',
    tcgBorder: '#f87171'
  },
  normal: {
    color: '#a8a878',
    glow: 'rgba(168, 168, 120, 0.4)',
    gradient: 'from-[#1c1c15]',
    literalBg: 'linear-gradient(135deg, #1c1c15 0%, #030712 100%)',
    flatColor: '#9ca3af',
    dmgBg: '#8bac0f',
    tcgBorder: '#d1d5db'
  },
  fighting: {
    color: '#c03028',
    glow: 'rgba(192, 48, 40, 0.4)',
    gradient: 'from-[#2c0b0a]',
    literalBg: 'linear-gradient(135deg, #2c0b0a 0%, #030712 100%)',
    flatColor: '#b91c1c',
    dmgBg: '#8bac0f',
    tcgBorder: '#ef4444'
  },
  flying: {
    color: '#a890f0',
    glow: 'rgba(168, 144, 240, 0.4)',
    gradient: 'from-[#1c0f32]',
    literalBg: 'linear-gradient(135deg, #1c0f32 0%, #030712 100%)',
    flatColor: '#818cf8',
    dmgBg: '#8bac0f',
    tcgBorder: '#c7d2fe'
  },
  poison: {
    color: '#a040a0',
    glow: 'rgba(160, 64, 160, 0.4)',
    gradient: 'from-[#220a22]',
    literalBg: 'linear-gradient(135deg, #220a22 0%, #030712 100%)',
    flatColor: '#a855f7',
    dmgBg: '#8bac0f',
    tcgBorder: '#e9d5ff'
  },
  ground: {
    color: '#e0c068',
    glow: 'rgba(224, 192, 104, 0.4)',
    gradient: 'from-[#2a200e]',
    literalBg: 'linear-gradient(135deg, #2a200e 0%, #030712 100%)',
    flatColor: '#d97706',
    dmgBg: '#8bac0f',
    tcgBorder: '#fcd34d'
  },
  rock: {
    color: '#b8a038',
    glow: 'rgba(184, 160, 56, 0.4)',
    gradient: 'from-[#221c08]',
    literalBg: 'linear-gradient(135deg, #221c08 0%, #030712 100%)',
    flatColor: '#b45309',
    dmgBg: '#8bac0f',
    tcgBorder: '#fbbf24'
  },
  bug: {
    color: '#a8b820',
    glow: 'rgba(168, 184, 32, 0.4)',
    gradient: 'from-[#1c1e05]',
    literalBg: 'linear-gradient(135deg, #1c1e05 0%, #030712 100%)',
    flatColor: '#84cc16',
    dmgBg: '#8bac0f',
    tcgBorder: '#bef264'
  },
  ghost: {
    color: '#705898',
    glow: 'rgba(112, 88, 152, 0.4)',
    gradient: 'from-[#140e20]',
    literalBg: 'linear-gradient(135deg, #140e20 0%, #030712 100%)',
    flatColor: '#6366f1',
    dmgBg: '#8bac0f',
    tcgBorder: '#c7d2fe'
  },
  steel: {
    color: '#b8b8d0',
    glow: 'rgba(184, 184, 208, 0.4)',
    gradient: 'from-[#1d1d28]',
    literalBg: 'linear-gradient(135deg, #1d1d28 0%, #030712 100%)',
    flatColor: '#64748b',
    dmgBg: '#8bac0f',
    tcgBorder: '#cbd5e1'
  },
  water: {
    color: '#6890f0',
    glow: 'rgba(104, 144, 240, 0.4)',
    gradient: 'from-[#0e1d3e]',
    literalBg: 'linear-gradient(135deg, #0e1d3e 0%, #030712 100%)',
    flatColor: '#3b82f6',
    dmgBg: '#8bac0f',
    tcgBorder: '#93c5fd'
  },
  grass: {
    color: '#78c850',
    glow: 'rgba(120, 200, 80, 0.4)',
    gradient: 'from-[#10240d]',
    literalBg: 'linear-gradient(135deg, #10240d 0%, #030712 100%)',
    flatColor: '#10b981',
    dmgBg: '#8bac0f',
    tcgBorder: '#a7f3d0'
  },
  electric: {
    color: '#f8d030',
    glow: 'rgba(248, 208, 48, 0.4)',
    gradient: 'from-[#3c3002]',
    literalBg: 'linear-gradient(135deg, #3c3002 0%, #030712 100%)',
    flatColor: '#fbbf24',
    dmgBg: '#8bac0f',
    tcgBorder: '#fde047'
  },
  psychic: {
    color: '#f85888',
    glow: 'rgba(248, 88, 136, 0.4)',
    gradient: 'from-[#300e16]',
    literalBg: 'linear-gradient(135deg, #300e16 0%, #030712 100%)',
    flatColor: '#ec4899',
    dmgBg: '#8bac0f',
    tcgBorder: '#fbcfe8'
  },
  ice: {
    color: '#98d8d8',
    glow: 'rgba(152, 216, 216, 0.4)',
    gradient: 'from-[#0f2424]',
    literalBg: 'linear-gradient(135deg, #0f2424 0%, #030712 100%)',
    flatColor: '#06b6d4',
    dmgBg: '#8bac0f',
    tcgBorder: '#a5f3fc'
  },
  dragon: {
    color: '#7038f8',
    glow: 'rgba(112, 56, 248, 0.4)',
    gradient: 'from-[#120732]',
    literalBg: 'linear-gradient(135deg, #120732 0%, #030712 100%)',
    flatColor: '#4f46e5',
    dmgBg: '#8bac0f',
    tcgBorder: '#c7d2fe'
  },
  dark: {
    color: '#705848',
    glow: 'rgba(112, 88, 72, 0.4)',
    gradient: 'from-[#1a120e]',
    literalBg: 'linear-gradient(135deg, #1a120e 0%, #030712 100%)',
    flatColor: '#374151',
    dmgBg: '#8bac0f',
    tcgBorder: '#9ca3af'
  }
}
