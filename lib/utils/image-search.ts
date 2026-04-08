/**
 * Pulse AI | Universal AI Provider Service
 * Tiered strategy: Pexels (Primary) -> Fallback Logic
 */

const PEXELS_API_KEY = "hbOSnkQWR075kZRaeNOJFcfmpdIGaVfQo52TleTWVZCtiELKkDVatskt";

export type ImageSearchResult = {
  url: string;
  alt: string;
  provider: string;
};

export async function searchSmartImage(query: string, category: string = "Technology"): Promise<ImageSearchResult> {
  const providers = [
    { name: 'pexels', priority: 1 },
    // Plan for Unsplash/Pixabay if keys are provided later
  ];

  for (const provider of providers) {
    if (provider.name === 'pexels') {
      try {
        console.log(`[Neural Sync] Searching Pexels for: ${query}`);
        const res = await fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=15&orientation=landscape`,
          {
            headers: { Authorization: PEXELS_API_KEY },
          }
        );
        const data = await res.json();
        
        if (data.photos && data.photos.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.photos.length);
          const selectedPhoto = data.photos[randomIndex];
          return {
            url: selectedPhoto.src.large2x || selectedPhoto.src.large,
            alt: selectedPhoto.alt || query,
            provider: 'pexels'
          };
        }
      } catch (err) {
        console.warn("[Neural Sync] Pexels search failed, trying next provider...");
      }
    }
  }

  // ULTIMATE FALLBACK: Category-based high-quality stock images
  const fallbacks: Record<string, string> = {
    "Technology": "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg",
    "Business": "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg",
    "Politics": "https://images.pexels.com/photos/3182811/pexels-photo-3182811.jpeg",
    "Science": "https://images.pexels.com/photos/3735709/pexels-photo-3735709.jpeg",
    "Sports": "https://images.pexels.com/photos/248547/pexels-photo-248547.jpeg",
    "Culture": "https://images.pexels.com/photos/1314584/pexels-photo-1314584.jpeg",
  };

  return {
    url: fallbacks[category] || fallbacks["Technology"],
    alt: `${category} Illustration`,
    provider: 'fallback'
  };
}
