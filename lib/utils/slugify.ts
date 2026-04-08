/**
 * Generates a clean, number-free slug from a string.
 * Optimized for SEO and internal link stability.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')  // Remove all non-word chars (except -)
    // Constraint: No numbers in the slug as per user request
    .replace(/\d+/g, '')      // Remove all numbers
    .replace(/--+/g, '-')     // Replace multiple - with single -
    .replace(/^-+/, '')       // Trim - from start of text
    .replace(/-+$/, '');      // Trim - from end of text
}
