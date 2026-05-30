'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RotateCw } from 'lucide-react'

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Pokédex error boundary:', error)
  }, [error])

  return (
    <div
      role="alert"
      className="min-h-screen bg-background text-white flex flex-col items-center justify-center gap-5 text-center p-6">
      <AlertTriangle className="w-14 h-14 text-red-400/70" />
      <div className="space-y-2">
        <h1 className="text-xl font-black uppercase tracking-widest">
          Algo deu errado
        </h1>
        <p className="text-sm text-slate-400 max-w-md">
          Não foi possível carregar este conteúdo. Pode ter sido uma falha
          temporária na conexão com a PokéAPI.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={reset}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-slate-950 bg-gradient-to-r from-secondary to-accent hover:scale-105 active:scale-95 transition-all cursor-pointer">
          <RotateCw className="w-4 h-4" />
          Tentar novamente
        </button>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-slate-400 bg-white/5 border border-white/10 hover:text-white hover:bg-white/10 active:scale-95 transition-all">
          Voltar à Pokédex
        </Link>
      </div>
    </div>
  )
}
