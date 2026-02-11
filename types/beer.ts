export interface Beer {
  id: string; // Dotykacka IDs are large numbers, stored as strings (or index for library beers)
  category: string;
  brewery: string;
  name: string;
  style: string;
  abv: string; // Can be "unknown" if missing
  price: string; // Can be "unknown" if missing
  url: string; // Can be "unknown" if missing
  urlDisplay?: string; // Masked/shortened URL for display
  reason?: string; // LLM-generated reason for recommendation
  rating?: string; // Untappd rating (library beers only)
  ibu?: string; // IBU value (library beers only)
  description?: string; // Beer description (library beers only)
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  beers?: Beer[];  // Optional recommended beers for assistant messages
}

export type View = 'chat' | 'menu' | 'team' | 'contacts' | 'library';

export interface TeamMemberDetail {
  label: string;
  text: string;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  details: TeamMemberDetail[];
  favoriteBeer: string;
}