import type { MetadataRoute } from 'next'

const SITE_URL = 'https://td-pokedex-react.vercel.app'
const TOTAL_POKEMON = 1025

export default function sitemap(): MetadataRoute.Sitemap {
  const fichas: MetadataRoute.Sitemap = Array.from(
    { length: TOTAL_POKEMON },
    (_, i) => ({
      url: `${SITE_URL}/pokemon/${i + 1}`,
      changeFrequency: 'monthly',
      priority: 0.8
    })
  )

  return [
    {
      url: SITE_URL,
      changeFrequency: 'weekly',
      priority: 1
    },
    ...fichas
  ]
}
