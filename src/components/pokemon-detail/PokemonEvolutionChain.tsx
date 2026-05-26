'use client'
import React from 'react'
import { ArrowRight } from 'lucide-react'
import { MiniCollectorCard } from './MiniCollectorCard'

interface IEvolution {
  name: string
  id: string
}

interface IPokemonEvolutionChainProps {
  evolutionChain: IEvolution[]
  currentId: number
  getArtworkUrl: (id: string) => string
}

export const PokemonEvolutionChain: React.FC<IPokemonEvolutionChainProps> = ({ evolutionChain, currentId, getArtworkUrl }) => (
  <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-6">
    <div className="text-[9px] font-mono font-black text-slate-500 tracking-widest uppercase mb-5 pb-2 border-b border-white/5">
      LINHA EVOLUTIVA DA ESPÉCIE // EVOLUTIONS
    </div>
    <div className="flex flex-wrap items-center justify-center gap-4">
      {evolutionChain.map((evo, index) => (
        <React.Fragment key={evo.id}>
          {index > 0 && (
            <div className="flex items-center justify-center p-2 rounded-full border border-white/5 bg-white/5 text-secondary flex-shrink-0">
              <ArrowRight className="w-4 h-4" />
            </div>
          )}
          <MiniCollectorCard
            name={evo.name}
            id={evo.id}
            image={getArtworkUrl(evo.id)}
            isSelf={parseInt(evo.id) === currentId}
            subtitle="VER REGISTRO"
          />
        </React.Fragment>
      ))}
    </div>
  </div>
)
