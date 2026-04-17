import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Xylos AI — Intelligent Editorial Suite',
    short_name: 'Xylos AI',
    description: 'Access 7+ top AI models in one premium workspace. Free, fast, and privacy-first.',
    start_url: '/',
    display: 'standalone',
    background_color: '#faf9f8',
    theme_color: '#7c3aed',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
    categories: ['productivity', 'utilities', 'education'],
    lang: 'en',
    scope: '/',
  };
}
