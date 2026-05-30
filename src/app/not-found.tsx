import Link from 'next/link'
import { SearchX } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center gap-5 text-center p-6">
      <SearchX className="w-14 h-14 text-slate-500" />
      <div className="space-y-2">
        <h1 className="text-2xl font-black uppercase tracking-widest">404</h1>
        <p className="text-sm text-slate-400 max-w-md">
          Esta página não existe na Pokédex.
        </p>
      </div>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-slate-950 bg-gradient-to-r from-secondary to-accent hover:scale-105 active:scale-95 transition-all">
        Voltar à Pokédex
      </Link>
    </div>
  )
}
