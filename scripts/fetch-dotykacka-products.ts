/**
 * Test script to fetch and save raw Dotykacka product data
 * Run with: npx tsx scripts/fetch-dotykacka-products.ts
 */

import { config } from 'dotenv';
import { dotykackaClient } from '../lib/dotykacka';
import fs from 'fs';
import path from 'path';

// Load environment variables
config();

async function fetchAndSaveProducts() {
  try {
    console.log('Fetching products from Dotykacka...');
    const products = await dotykackaClient.getActiveProducts();

    // Extract only the requested fields
    const productData = products.map(p => ({
      id: p.id,
      name: p.name,
      display: p.display,
      priceWithVat: p.priceWithVat,
      tags: p.tags,
      deleted: p.deleted,
    }));

    // Save to JSON file
    const outputPath = path.join(process.cwd(), 'app', 'beerlist', 'valhalla_menu.json');
    fs.writeFileSync(outputPath, JSON.stringify(productData, null, 2), 'utf-8');

    console.log(`\nSuccessfully saved ${productData.length} products to: ${outputPath}`);
    console.log(`\nSample of first 3 products:`);
    console.log(JSON.stringify(productData.slice(0, 3), null, 2));
  } catch (error) {
    console.error('Error fetching products:', error);
    process.exit(1);
  }
}

fetchAndSaveProducts();
