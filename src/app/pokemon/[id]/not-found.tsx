import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

export default function PokemonNotFound() {
  return (
    <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center gap-4 text-center p-4">
      <AlertCircle className="w-12 h-12 text-slate-500" />
      <h2 className="text-lg font-black uppercase text-white tracking-widest">
        Pokémon não encontrado
      </h2>
      <p className="text-sm text-slate-400 max-w-sm">
        Este registro não existe na Pokédex (são 1025 Pokémon, de #0001 a #1025).
      </p>
      <Link
        href="/"
        className="px-6 py-3 text-xs font-black uppercase tracking-widest bg-gradient-to-r from-secondary to-accent text-slate-950 rounded-xl hover:scale-105 transition-all">
        Retornar à Pokédex
      </Link>
    </div>
  )
}
