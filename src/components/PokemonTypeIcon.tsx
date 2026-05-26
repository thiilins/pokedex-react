import React from 'react'
import { pokemonTypesIcons } from './PokemonTypeIconData'

interface IPokemonTypeIcon {
  type: string
  haveName?: boolean
  className?: string
}

// Maps type to background, border, text and glow colors for a premium UI
export const typeStylingMap: Record<string, { bg: string, text: string, border: string, glow: string, bgAlpha: string, gradient: string }> = {
  fairy: { bg: 'bg-type-fairy', text: 'text-white', border: 'border-type-fairy/30', glow: 'shadow-glow-fairy', bgAlpha: 'bg-type-fairy/10', gradient: 'from-type-fairy/20 to-transparent' },
  fire: { bg: 'bg-type-fire', text: 'text-white', border: 'border-type-fire/30', glow: 'shadow-glow-fire', bgAlpha: 'bg-type-fire/10', gradient: 'from-type-fire/20 to-transparent' },
  normal: { bg: 'bg-type-normal', text: 'text-slate-900', border: 'border-type-normal/30', glow: 'shadow-glow-default', bgAlpha: 'bg-type-normal/10', gradient: 'from-type-normal/20 to-transparent' },
  fighting: { bg: 'bg-type-fighting', text: 'text-white', border: 'border-type-fighting/30', glow: 'shadow-glow-default', bgAlpha: 'bg-type-fighting/10', gradient: 'from-type-fighting/20 to-transparent' },
  flying: { bg: 'bg-type-flying', text: 'text-white', border: 'border-type-flying/30', glow: 'shadow-glow-default', bgAlpha: 'bg-type-flying/10', gradient: 'from-type-flying/20 to-transparent' },
  poison: { bg: 'bg-type-poison', text: 'text-white', border: 'border-type-poison/30', glow: 'shadow-glow-default', bgAlpha: 'bg-type-poison/10', gradient: 'from-type-poison/20 to-transparent' },
  ground: { bg: 'bg-type-ground', text: 'text-white', border: 'border-type-ground/30', glow: 'shadow-glow-default', bgAlpha: 'bg-type-ground/10', gradient: 'from-type-ground/20 to-transparent' },
  rock: { bg: 'bg-type-rock', text: 'text-white', border: 'border-type-rock/30', glow: 'shadow-glow-default', bgAlpha: 'bg-type-rock/10', gradient: 'from-type-rock/20 to-transparent' },
  bug: { bg: 'bg-type-bug', text: 'text-white', border: 'border-type-bug/30', glow: 'shadow-glow-default', bgAlpha: 'bg-type-bug/10', gradient: 'from-type-bug/20 to-transparent' },
  ghost: { bg: 'bg-type-ghost', text: 'text-white', border: 'border-type-ghost/30', glow: 'shadow-glow-default', bgAlpha: 'bg-type-ghost/10', gradient: 'from-type-ghost/20 to-transparent' },
  steel: { bg: 'bg-type-steel', text: 'text-white', border: 'border-type-steel/30', glow: 'shadow-glow-default', bgAlpha: 'bg-type-steel/10', gradient: 'from-type-steel/20 to-transparent' },
  water: { bg: 'bg-type-water', text: 'text-white', border: 'border-type-water/30', glow: 'shadow-glow-water', bgAlpha: 'bg-type-water/10', gradient: 'from-type-water/20 to-transparent' },
  grass: { bg: 'bg-type-grass', text: 'text-white', border: 'border-type-grass/30', glow: 'shadow-glow-grass', bgAlpha: 'bg-type-grass/10', gradient: 'from-type-grass/20 to-transparent' },
  electric: { bg: 'bg-type-electric', text: 'text-slate-950', border: 'border-type-electric/30', glow: 'shadow-glow-electric', bgAlpha: 'bg-type-electric/10', gradient: 'from-type-electric/20 to-transparent' },
  psychic: { bg: 'bg-type-psychic', text: 'text-white', border: 'border-type-psychic/30', glow: 'shadow-glow-default', bgAlpha: 'bg-type-psychic/10', gradient: 'from-type-psychic/20 to-transparent' },
  ice: { bg: 'bg-type-ice', text: 'text-slate-950', border: 'border-type-ice/30', glow: 'shadow-glow-default', bgAlpha: 'bg-type-ice/10', gradient: 'from-type-ice/20 to-transparent' },
  dragon: { bg: 'bg-type-dragon', text: 'text-white', border: 'border-type-dragon/30', glow: 'shadow-glow-default', bgAlpha: 'bg-type-dragon/10', gradient: 'from-type-dragon/20 to-transparent' },
  dark: { bg: 'bg-type-dark', text: 'text-white', border: 'border-type-dark/30', glow: 'shadow-glow-default', bgAlpha: 'bg-type-dark/10', gradient: 'from-type-dark/20 to-transparent' },
}

const PokemonTypeIcon: React.FC<IPokemonTypeIcon> = ({ type, haveName = false, className = '' }) => {
  const normType = type.toLowerCase()
  const IconComponent = pokemonTypesIcons[normType]
  const styles = typeStylingMap[normType] || { bg: 'bg-slate-500', text: 'text-white', border: 'border-slate-500/30', glow: 'shadow-glow-default', bgAlpha: 'bg-slate-500/10', gradient: 'from-slate-500/20 to-transparent' }

  if (!IconComponent) return null

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase transition-all duration-300 hover:scale-105 select-none ${styles.bg} ${styles.text} ${className}`}
    >
      <IconComponent className="w-3.5 h-3.5" />
      {haveName && <span>{type}</span>}
    </div>
  )
}

export default PokemonTypeIcon
