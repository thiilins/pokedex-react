export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
      <p className="text-xs font-black uppercase tracking-widest text-slate-400">
        Carregando Pokédex...
      </p>
    </div>
  )
}
