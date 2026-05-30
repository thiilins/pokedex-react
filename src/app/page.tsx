import HomeView from './_components/home-view'

// Server Component: a metadata vem do layout (canonical '/'). A UI interativa,
// que depende do PokedexContext, vive em HomeView ('use client').
export default function Home() {
  return <HomeView />
}
