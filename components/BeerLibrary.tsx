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
  const [abvMin, setAbvMin] = useState<string>('');
  const [abvMax, setAbvMax] = useState<string>('');
  const [ratingMin, setRatingMin] = useState<string>('');
  const [ratingMax, setRatingMax] = useState<string>('');

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

  const filteredBeers = libraryData.beers.filter(beer => {
    // ABV filter
    const beerAbv = beer.abv ? parseFloat(beer.abv.replace('%', '')) : null;
    const matchesAbvMin = abvMin === '' || (beerAbv !== null && beerAbv >= parseFloat(abvMin));
    const matchesAbvMax = abvMax === '' || (beerAbv !== null && beerAbv <= parseFloat(abvMax));

    // Rating filter
    const beerRating = beer.rating ? parseFloat(beer.rating) : null;
    const matchesRatingMin = ratingMin === '' || (beerRating !== null && beerRating >= parseFloat(ratingMin));
    const matchesRatingMax = ratingMax === '' || (beerRating !== null && beerRating <= parseFloat(ratingMax));

    return matchesAbvMin && matchesAbvMax && matchesRatingMin && matchesRatingMax;
  });

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

        {/* Filters */}
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* ABV Range */}
          <div className="bg-[var(--bg-secondary)] rounded-lg p-4 border border-[var(--border-color)]">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              ABV Range (%)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={abvMin}
                onChange={(e) => setAbvMin(e.target.value)}
                step="0.1"
                min="0"
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
              />
              <span className="text-[var(--text-secondary)]">-</span>
              <input
                type="number"
                placeholder="Max"
                value={abvMax}
                onChange={(e) => setAbvMax(e.target.value)}
                step="0.1"
                min="0"
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
              />
            </div>
          </div>

          {/* Rating Range */}
          <div className="bg-[var(--bg-secondary)] rounded-lg p-4 border border-[var(--border-color)]">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Rating Range (⭐)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={ratingMin}
                onChange={(e) => setRatingMin(e.target.value)}
                step="0.1"
                min="0"
                max="5"
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
              />
              <span className="text-[var(--text-secondary)]">-</span>
              <input
                type="number"
                placeholder="Max"
                value={ratingMax}
                onChange={(e) => setRatingMax(e.target.value)}
                step="0.1"
                min="0"
                max="5"
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
              />
            </div>
          </div>
        </div>

        {/* Clear Filters Button */}
        {(abvMin || abvMax || ratingMin || ratingMax) && (
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => {
                setAbvMin('');
                setAbvMax('');
                setRatingMin('');
                setRatingMax('');
              }}
              className="px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-secondary)] transition-all font-medium text-sm"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Results Counter */}
        <div className="mb-4 text-sm text-[var(--text-secondary)]">
          Showing {filteredBeers.length} of {libraryData.totalBeers} beers
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
            No beers found matching your filters. Try adjusting your search criteria.
          </div>
        )}
      </div>
    </div>
  );
}
