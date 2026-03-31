/**
 * Beer Scraper
 * Fetches beer data from Untappd's internal menu API (no browser required).
 *
 * Usage: npm run scrape
 *
 * Requires UNTAPPD_VENUE_ID in .env (default: 13672441 for Valhalla Beer Club).
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

interface UntappdBeerItem {
  created_at: string;
  tap_number?: string;
  beer: {
    bid: number;
    beer_name: string;
    beer_label: string;
    beer_abv: number;
    beer_ibu: number;
    beer_slug: string;
    beer_description: string;
    beer_style: string;
    rating_score: number;
    rating_count: number;
  };
  brewery: {
    brewery_name: string;
    brewery_slug: string;
  };
  containers: Array<{
    price: { value: string; currency: string };
    serving_type: string;
  }>;
}

interface UntappdMenuResponse {
  result: string;
  data: {
    total_count: number;
    count: number;
    items: UntappdBeerItem[];
  };
}

interface BeerData {
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

interface ScrapedResult {
  venue: string;
  scrapedAt: string;
  totalBeers: number;
  beers: BeerData[];
}

const VENUE_ID = process.env.UNTAPPD_VENUE_ID ?? '13672441';
const OUTPUT_FILE = path.join(process.cwd(), 'public', 'data', 'scraped-beers.json');
const PAGE_SIZE = 50;

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'X-Requested-With': 'XMLHttpRequest',
  'Accept': 'application/json, text/javascript, */*; q=0.01',
  'Referer': `https://untappd.com/v/valhalla-beer-club/${VENUE_ID}`,
};

async function fetchPage(offset: number): Promise<UntappdMenuResponse> {
  const url = `https://untappd.com/apireqs/menu/${VENUE_ID}?sort=publish_order&offset=${offset}&limit=${PAGE_SIZE}`;
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching offset ${offset}`);
  return res.json() as Promise<UntappdMenuResponse>;
}

function mapItem(item: UntappdBeerItem): BeerData {
  const containers = item.containers
    .filter(c => c.price.value && c.price.value !== 'N/A')
    .map(c => {
      const match = c.price.value.match(/([\d.]+)\s*([A-Z]{3})/);
      return match
        ? { size: c.serving_type, price: match[1], currency: match[2] }
        : null;
    })
    .filter((c): c is NonNullable<typeof c> => c !== null);

  return {
    name: item.beer.beer_name,
    brewery: item.brewery.brewery_name,
    url: `https://untappd.com/b/${item.beer.beer_slug}/${item.beer.bid}`,
    style: item.beer.beer_style || undefined,
    abv: item.beer.beer_abv ? `${item.beer.beer_abv}%` : undefined,
    ibu: item.beer.beer_ibu ? String(item.beer.beer_ibu) : undefined,
    rating: item.beer.rating_score ? String(item.beer.rating_score) : undefined,
    description: item.beer.beer_description || undefined,
    containers: containers.length > 0 ? containers : undefined,
  };
}

async function scrapeBeers() {
  console.log(`Fetching menu for venue ${VENUE_ID}...\n`);

  const allItems: UntappdBeerItem[] = [];
  let offset = 0;

  // First request to get total count
  const first = await fetchPage(0);
  if (first.result !== 'success') throw new Error('API returned non-success result');

  const total = first.data.total_count;
  allItems.push(...first.data.items);
  console.log(`Total beers: ${total} — fetched ${allItems.length}`);

  // Paginate through the rest
  offset += PAGE_SIZE;
  while (offset < total) {
    const page = await fetchPage(offset);
    allItems.push(...page.data.items);
    console.log(`Fetched ${allItems.length} / ${total}`);
    offset += PAGE_SIZE;
  }

  const beers: BeerData[] = allItems.map(mapItem);

  const result: ScrapedResult = {
    venue: 'Valhalla Beer Club',
    scrapedAt: new Date().toISOString(),
    totalBeers: beers.length,
    beers,
  };

  const dataDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2), 'utf-8');

  console.log(`\n✅ Saved ${beers.length} beers to ${OUTPUT_FILE}`);

  const withStyle = beers.filter(b => b.style).length;
  const withABV = beers.filter(b => b.abv).length;
  const withRating = beers.filter(b => b.rating).length;
  const withDesc = beers.filter(b => b.description).length;
  const withPrices = beers.filter(b => b.containers?.length).length;

  console.log(`\nStyle: ${withStyle}  ABV: ${withABV}  Rating: ${withRating}  Description: ${withDesc}  Prices: ${withPrices}`);
  console.log('\nSample:', JSON.stringify(beers[0], null, 2));
}

scrapeBeers().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
