'use client';

import { useState, useEffect } from 'react';

interface UntappdBeer {
  name: string;
  brewery: string;
  url: string;
  style?: string;
  abv?: string;
  ibu?: string;
  rating?: string;
  description?: string;
}

interface LibraryData {
  venue: string;
  scrapedAt: string;
  totalBeers: number;
  beers: UntappdBeer[];
}

export default function BeerLibrary() {
  const [libraryData, setLibraryData] = useState<LibraryData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/data/scraped-beers.json')
      .then(res => res.json())
      .then(data => setLibraryData(data))
      .catch(err => console.error('Error loading beer library:', err));
  }, []);

  if (!libraryData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--text-secondary)] text-xl">Loading library...</div>
      </div>
    );
  }

  const filteredBeers = libraryData.beers.filter(beer =>
    beer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    beer.brewery.toLowerCase().includes(searchTerm.toLowerCase()) ||
    beer.style?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-display uppercase tracking-wider mb-2 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
            Beer Library
          </h1>
          <p className="text-[var(--text-secondary)] text-sm sm:text-base">
            {libraryData.totalBeers} beers from Untappd • Updated {new Date(libraryData.scrapedAt).toLocaleDateString()}
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name, brewery, or style..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
          />
        </div>

        {/* Beer List */}
        <div className="space-y-4">
          {filteredBeers.map((beer, index) => (
            <div
              key={index}
              className="bg-[var(--bg-secondary)] rounded-lg p-4 sm:p-6 border border-[var(--border-color)] hover:border-[var(--accent-primary)] transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] mb-1">
                    {beer.name}
                  </h3>
                  <p className="text-[var(--text-secondary)] text-sm sm:text-base">
                    {beer.brewery} • {beer.style}
                  </p>
                </div>
                <div className="flex gap-3 text-sm sm:text-base flex-shrink-0">
                  {beer.abv && (
                    <span className="px-3 py-1 rounded-full bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] font-medium">
                      {beer.abv}
                    </span>
                  )}
                  {beer.ibu && (
                    <span className="px-3 py-1 rounded-full bg-[var(--accent-secondary)]/20 text-[var(--accent-secondary)] font-medium">
                      {beer.ibu} IBU
                    </span>
                  )}
                  {beer.rating && (
                    <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 font-medium">
                      ⭐ {beer.rating}
                    </span>
                  )}
                </div>
              </div>

              {beer.description && (
                <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed mb-3">
                  {beer.description}
                </p>
              )}

              <a
                href={beer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] text-sm font-medium inline-flex items-center gap-1 transition-colors"
              >
                View on Untappd →
              </a>
            </div>
          ))}
        </div>

        {filteredBeers.length === 0 && (
          <div className="text-center py-12 text-[var(--text-secondary)]">
            No beers found matching &quot;{searchTerm}&quot;
          </div>
        )}
      </div>
    </div>
  );
}
