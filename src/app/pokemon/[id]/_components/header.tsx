'use client'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
export const Header = ({
  nextId,
  prevId
}: {
  nextId: string
  prevId: string
}) => {
  const router = useRouter()
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#040714]/90 backdrop-blur-md px-4 sm:px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-secondary transition-all font-mono text-xs group">
          <ArrowLeft className="w-4 h-4" /> <span>[ RETORNAR À POKÉDEX ]</span>
        </Link>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/pokemon/${prevId}`)}
            className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-mono font-bold cursor-pointer flex items-center gap-1.5 active:scale-95 transition-all text-slate-300">
            <ArrowLeft className="w-3.5 h-3.5" /> #
            {String(prevId).padStart(4, '0')}
          </button>
          <button
            onClick={() => router.push(`/pokemon/${nextId}`)}
            className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-mono font-bold cursor-pointer flex items-center gap-1.5 active:scale-95 transition-all text-slate-300">
            #{String(nextId).padStart(4, '0')}{' '}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  )
}
