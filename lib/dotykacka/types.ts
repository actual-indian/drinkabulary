// Dotykacka API Types

export interface DotykackaTokenResponse {
  accessToken: string;
  expiresIn?: number;
  tokenType?: string;
}

export interface DotykackaProduct {
  id: number;
  name: string;
  display: boolean;
  priceWithVat: number; // Price in Czech Crowns (CZK)
  tags: string[]; // Array of tags for categorization
  deleted: boolean;
  _categoryId?: number;
  hexColor?: string;
  created?: string;
  versionDate?: string;
}

export interface DotykackaApiResponse<T> {
  data?: T[];
}
