import { NextResponse } from 'next/server';
import type { Beer } from '@/types/beer';
import fs from 'fs';
import path from 'path';
// import { dotykackaClient, DotykackaProduct } from '@/lib/dotykacka'; // Keep for later use

interface ScrapedBeer {
  name: string;
  brewery: string;
  url: string;
  abv?: string;
  ibu?: string;
  style?: string;
  rating?: string;
  description?: string;
  containers?: Array<{
    size: string;
    price: string;
    currency: string;
  }>;
}

interface ScrapedData {
  venue: string;
  scrapedAt: string;
  totalBeers: number;
  beers: ScrapedBeer[];
}

/**
 * Maps scraped beer data to our Beer interface
 */
function mapScrapedBeerToBeer(scrapedBeer: ScrapedBeer, index: number): Beer {
  // Format price from containers (use first container's price if available)
  let price = 'unknown';
  if (scrapedBeer.containers && scrapedBeer.containers.length > 0) {
    const firstContainer = scrapedBeer.containers[0];
    price = `${firstContainer.price} ${firstContainer.currency}`;
    // If multiple containers, show range
    if (scrapedBeer.containers.length > 1) {
      const prices = scrapedBeer.containers.map(c => parseFloat(c.price));
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      if (minPrice !== maxPrice) {
        price = `${minPrice}-${maxPrice} ${firstContainer.currency}`;
      }
    }
  }

  // Debug logging for first beer
  if (index === 0) {
    console.log('Sample beer mapping:', {
      name: scrapedBeer.name,
      containers: scrapedBeer.containers,
      mappedPrice: price
    });
  }

  // Determine category from style
  const style = scrapedBeer.style || 'unknown';
  let category = 'Uncategorized';

  // Simple categorization based on style
  if (style.toLowerCase().includes('ipa')) category = 'IPA';
  else if (style.toLowerCase().includes('lager') || style.toLowerCase().includes('pilsner')) category = 'Lager';
  else if (style.toLowerCase().includes('stout') || style.toLowerCase().includes('porter')) category = 'Dark Beer';
  else if (style.toLowerCase().includes('sour') || style.toLowerCase().includes('gose')) category = 'Sour';
  else if (style.toLowerCase().includes('wheat') || style.toLowerCase().includes('weiss')) category = 'Wheat Beer';
  else if (style.toLowerCase().includes('ale')) category = 'Ale';

  return {
    id: index.toString(),
    name: scrapedBeer.name,
    brewery: scrapedBeer.brewery,
    category,
    style,
    abv: scrapedBeer.abv || 'unknown',
    ibu: scrapedBeer.ibu,
    rating: scrapedBeer.rating,
    price,
    url: scrapedBeer.url,
    urlDisplay: scrapedBeer.url,
    description: scrapedBeer.description,
  };
}

export async function GET() {
  try {
    // Load from scraped-beers.json
    const filePath = path.join(process.cwd(), 'public', 'data', 'scraped-beers.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const scrapedData: ScrapedData = JSON.parse(fileContents);

    // Map scraped beers to Beer format
    const beers: Beer[] = scrapedData.beers.map((beer, index) =>
      mapScrapedBeerToBeer(beer, index)
    );

    console.log(`Successfully loaded ${beers.length} beers from scraped-beers.json`);
    return NextResponse.json({
      beers,
      scrapedAt: scrapedData.scrapedAt,
      totalBeers: scrapedData.totalBeers,
    });
  } catch (error) {
    console.error('Error loading scraped beers:', error);
    return NextResponse.json(
      { error: 'Failed to load beer list' },
      { status: 500 }
    );
  }
}

/*
 * DOTYKACKA IMPLEMENTATION (kept for future use)
 *
 * To switch back to Dotykacka, uncomment the import at the top and replace the GET function above with:
 *
function mapProductToBeer(product: DotykackaProduct): Beer {
  const category = product.tags && product.tags.length > 0 ? product.tags[0] : 'Uncategorized';
  const style = product.tags && product.tags.length > 1 ? product.tags[1] : (product.tags && product.tags.length > 0 ? product.tags[0] : 'unknown');
  const price = product.priceWithVat ? `${product.priceWithVat} CZK` : 'unknown';

  return {
    id: product.id.toString(),
    name: product.name || 'unknown',
    category,
    brewery: 'unknown',
    style,
    abv: 'unknown',
    price,
    url: 'unknown',
    urlDisplay: 'unknown',
  };
}

export async function GET(request: NextRequest) {
  try {
    const products = await dotykackaClient.getActiveProducts();
    const beers: Beer[] = products.map(mapProductToBeer);
    return NextResponse.json(beers);
  } catch (error) {
    console.error('Error fetching beers from Dotykacka:', error);
    return NextResponse.json({ error: 'Failed to load beer list from Dotykacka API' }, { status: 500 });
  }
}
*/