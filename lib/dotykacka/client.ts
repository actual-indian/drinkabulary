import { DotykackaTokenResponse, DotykackaProduct } from './types';

const DOTYKACKA_API_BASE = 'https://api.dotykacka.cz/v2';
const TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutes buffer before expiry

// In-memory token cache (for serverless, this resets with each cold start)
let cachedToken: string | null = null;
let tokenExpiryTime: number | null = null;

export class DotykackaClient {
  private refreshToken: string;
  private cloudId: string;

  constructor() {
    const refreshToken = process.env.DOTYKACKA_REFRESH_TOKEN;
    const cloudId = process.env.DOTYKACKA_CLOUD_ID;

    if (!refreshToken || !cloudId) {
      throw new Error('Dotykacka credentials not configured. Please set DOTYKACKA_REFRESH_TOKEN and DOTYKACKA_CLOUD_ID in .env');
    }

    this.refreshToken = refreshToken;
    this.cloudId = cloudId;
  }

  /**
   * Get access token, using cached token if valid
   */
  private async getAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (cachedToken && tokenExpiryTime && Date.now() < tokenExpiryTime) {
      return cachedToken;
    }

    // Fetch new token
    console.log('Fetching new Dotykacka access token...');

    const response = await fetch(`${DOTYKACKA_API_BASE}/signin/token`, {
      method: 'POST',
      headers: {
        'Authorization': `User ${this.refreshToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        _cloudId: this.cloudId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get Dotykacka access token: ${response.status} - ${errorText}`);
    }

    const data: DotykackaTokenResponse = await response.json();

    if (!data.accessToken) {
      throw new Error('Invalid token response from Dotykacka API');
    }

    // Cache the token (expires in 1 hour = 3600 seconds)
    cachedToken = data.accessToken;
    tokenExpiryTime = Date.now() + (3600 * 1000) - TOKEN_EXPIRY_BUFFER;

    console.log('Successfully obtained access token');
    return cachedToken;
  }

  /**
   * Fetch all products with pagination
   */
  async getAllProducts(): Promise<DotykackaProduct[]> {
    const token = await this.getAccessToken();
    const allProducts: DotykackaProduct[] = [];
    let page = 1;
    const limit = 100; // Fetch 100 products per page
    let hasMorePages = true;

    while (hasMorePages) {
      console.log(`Fetching products page ${page}...`);

      const response = await fetch(
        `${DOTYKACKA_API_BASE}/clouds/${this.cloudId}/products?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Handle 404 as end of pagination (normal behavior)
      if (response.status === 404) {
        console.log(`Reached end of products at page ${page}`);
        hasMorePages = false;
        continue;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch products (page ${page}): ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      // Handle both array response and wrapped data response
      const products: DotykackaProduct[] = Array.isArray(data) ? data : (data.data || []);

      if (products.length === 0) {
        hasMorePages = false;
      } else {
        allProducts.push(...products);
        console.log(`Fetched ${products.length} products (total: ${allProducts.length})`);

        // If we got fewer products than the limit, we've reached the last page
        if (products.length < limit) {
          hasMorePages = false;
        } else {
          page++;
        }
      }
    }

    console.log(`Completed fetching ${allProducts.length} total products`);
    return allProducts;
  }

  /**
   * Fetch products with filtering (active, non-deleted items only)
   */
  async getActiveProducts(): Promise<DotykackaProduct[]> {
    const allProducts = await this.getAllProducts();

    // Filter for active products: display=true, deleted=false, price > 1
    return allProducts.filter(product =>
      product.display === true &&
      product.deleted === false &&
      parseFloat(String(product.priceWithVat)) > 1
    );
  }
}

// Export singleton instance
export const dotykackaClient = new DotykackaClient();
