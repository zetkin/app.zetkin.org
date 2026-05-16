import { notFound } from 'next/navigation';

/**
 * Catch-all for unmatched routes inside the [locale] segment.
 * Triggers the localized [locale]/not-found.tsx for arbitrary unknown URLs
 * (Next.js otherwise renders its default 404 for routes that aren't
 * explicitly matched, even with a not-found.tsx present).
 */
export default function CatchAllNotFound() {
  notFound();
}
