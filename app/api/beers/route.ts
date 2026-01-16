import { NextRequest, NextResponse } from 'next/server';
import type { Beer } from '@/types/beer';
import { dotykackaClient, DotykackaProduct } from '@/lib/dotykacka';

// In-memory cache for beers
let cachedBeers: Beer[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

/**
 * Maps a Dotykacka product to our Beer interface
 */
function mapProductToBeer(product: DotykackaProduct): Beer {
  // Extract category from tags (first tag if available)
  const category = product.tags && product.tags.length > 0
    ? product.tags[0]
    : 'Uncategorized';

  // Extract style from tags (second tag if available, or use first tag)
  const style = product.tags && product.tags.length > 1
    ? product.tags[1]
    : (product.tags && product.tags.length > 0 ? product.tags[0] : 'unknown');

  // Format price with CZK currency
  const price = product.priceWithVat
    ? `${product.priceWithVat} CZK`
    : 'unknown';

  return {
    id: product.id.toString(),
    name: product.name || 'unknown',
    category,
    brewery: 'unknown', // Not available in Dotykacka API
    style,
    abv: 'unknown', // Not available in Dotykacka API
    price,
    url: 'unknown', // Not available in Dotykacka API
    urlDisplay: 'unknown',
  };
}

export async function GET(request: NextRequest) {
  try {
    // Check for cache invalidation parameter
    const forceRefresh = request.nextUrl.searchParams.get('refresh') === 'true';

    if (forceRefresh) {
      console.log('Force refresh requested - invalidating cache');
      cachedBeers = null;
      cacheTimestamp = null;
    }

    // Check if cache is valid
    const now = Date.now();
    if (cachedBeers && cacheTimestamp && (now - cacheTimestamp) < CACHE_TTL) {
      console.log(`Returning cached beers (${cachedBeers.length} items, age: ${Math.round((now - cacheTimestamp) / 1000)}s)`);
      return NextResponse.json(cachedBeers);
    }

    console.log('Cache miss or expired - fetching products from Dotykacka API...');

    // Fetch active products from Dotykacka (display=true, deleted=false)
    const products = await dotykackaClient.getActiveProducts();

    // Map Dotykacka products to Beer format
    const beers: Beer[] = products.map(mapProductToBeer);

    // Update cache
    cachedBeers = beers;
    cacheTimestamp = now;

    console.log(`Successfully fetched and cached ${beers.length} beers from Dotykacka`);
    return NextResponse.json(beers);
  } catch (error) {
    console.error('Error fetching beers from Dotykacka:', error);

    // If we have stale cache, return it as fallback
    if (cachedBeers) {
      console.log('Returning stale cache due to error');
      return NextResponse.json(cachedBeers);
    }

    return NextResponse.json(
      { error: 'Failed to load beer list from Dotykacka API' },
      { status: 500 }
    );
  }
}