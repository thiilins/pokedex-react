import type { MetadataRoute } from 'next'
import { TOTAL_POKEMON } from '@/constants/pokemon'

const SITE_URL = 'https://td-pokedex-react.vercel.app'

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
