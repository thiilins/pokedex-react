# Pokédex

> Pokédex moderna com Next.js 16 (App Router + Cache Components), React 19 e Tailwind, consumindo a PokeAPI — grid dos 1025 Pokémon, ficha detalhada e arena de combate.

## Stack

Next.js 16.2.6 · React 19 · TypeScript · Tailwind CSS 3 · npm

## Structure

```
src/
  app/
    layout.tsx            # root: boot da lista via use cache (Promise sem await + React.use)
    page.tsx              # home: grid + filtros + busca + infinite scroll
    api/pokemon/[id]/     # Route Handler GET (card leve) · ?full=1 (detalhe completo)
    pokemon/[id]/         # ficha detalhada (page Server Component + PokemonPageClient)
    _components/          # componentes de rota
  services/
    pokemonService.ts     # camada de dados (use cache, server-only)
    pokemonActions.ts     # Server Actions finas (transporte p/ interações do cliente)
  contexts/               # PokedexContext (estado global: lista, filtros, cache, arena)
  components/             # cards, modal, header, arena versus
    pokemon-detail/       # painéis da ficha (stats, abilities, evolução, moves...)
  utils/                  # getId, generateDayNumber (pokémon do dia)
  constants/ · hooks/ · types/
```

## Key Patterns

- **`use cache` é server-only.** Cliente alcança dado cacheado por (1) render em Server Component (HTML pronto) ou (2) Server Action / Route Handler. Nunca importa função `use cache` direto no client.
- **Leitura em massa (grid) → Route Handler GET**, não Server Action. Server Actions são enfileiradas pelo Next (carregam "uma a uma"); GET dispara em paralelo e cacheia no browser/CDN.
- **Boot da lista**: `layout.tsx` passa a Promise cacheada **sem `await`** ao Provider (dentro de `<Suspense>`); Provider resolve via `React.use()`. Mantém o shell instantâneo e habilita PPR.
- **Card leve vs detalhe completo**: grid usa `getCachedPokemonCard` (2 fetches); modal/ficha usam `getCachedPokemonDetail` (completo) só sob demanda.
- `cacheLife('max')` + `cacheTag` em toda função `use cache` (dados da PokeAPI são imutáveis).

## Anti-patterns

- `'use server'` no topo do `pokemonService.ts` — transforma tudo em Server Action enfileirada e anula o ganho do `use cache` no boot.
- Buscar detalhe **completo** por card no grid (waterfall pesado por card).
- `await` da função cacheada no corpo do `layout` — bloqueia o shell (erro "Uncached data accessed outside of Suspense").

## Commands

```bash
npm run dev      # desenvolvimento (limpa .next antes)
npm run build    # build de produção (Turbopack)
npm run start    # serve build
npm run lint     # next lint
```

## Vault

- org: personal · path: personal/pokedex   (relativo ao vault_root; perguntar root se não souber)
- ref_branch: main
- Ordem: overview.md → pokedex.md (L1) → architecture/code-map.md → docs sob demanda
