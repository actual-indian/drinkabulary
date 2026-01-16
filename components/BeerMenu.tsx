'use client';

import { useState, useEffect } from 'react';
import type { Beer } from '@/types/beer';
import BeerCard from './BeerCard';

export default function BeerMenu() {
  const [beers, setBeers] = useState<Beer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/beers')
      .then((res) => res.json())
      .then((data) => {
        setBeers(data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 animate-fade-in">
        <div className="flex gap-2 mb-4">
          <div className="w-3 h-3 bg-[var(--accent-primary)] dark:bg-[var(--accent-secondary)] viking:bg-[var(--viking-secondary)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-[var(--accent-primary)] dark:bg-[var(--accent-secondary)] viking:bg-[var(--viking-secondary)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-[var(--accent-primary)] dark:bg-[var(--accent-secondary)] viking:bg-[var(--viking-secondary)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <div className="text-[var(--text-secondary)] dark:text-[var(--text-secondary)] viking:text-[var(--viking-text-secondary)] font-body font-medium">Loading menu...</div>
      </div>
    );
  }

  // Group beers by category
  const beersByCategory = beers.reduce((acc, beer) => {
    if (!acc[beer.category]) {
      acc[beer.category] = [];
    }
    acc[beer.category].push(beer);
    return acc;
  }, {} as Record<string, Beer[]>);

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-12">
      {/* Hero Title */}
      <div className="text-center mb-10 sm:mb-16 animate-fade-in-up">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display uppercase tracking-wider bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-secondary)] to-[var(--accent-primary)] dark:from-[var(--accent-secondary)] dark:via-[var(--accent-primary)] dark:to-[var(--accent-secondary)] viking:from-[var(--viking-secondary)] viking:via-[var(--viking-accent)] viking:to-[var(--viking-secondary)] bg-clip-text text-transparent mb-4 animate-fade-in-up">
          Our Selection
        </h2>
        <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent dark:via-[var(--accent-secondary)] viking:via-[var(--viking-secondary)] animate-fade-in-up stagger-1"></div>
      </div>

      {Object.entries(beersByCategory).map(([category, categoryBeers], categoryIndex) => (
        <div key={category} className="mb-12 sm:mb-16 animate-fade-in-up" style={{ animationDelay: `${categoryIndex * 0.15}s` }}>
          {/* Category Header */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-3xl sm:text-4xl font-display uppercase tracking-wide text-[var(--text-primary)] dark:text-[var(--text-primary)] viking:text-[var(--viking-text-primary)] mb-3 inline-block">
              {category}
            </h3>
            <div className="h-0.5 w-full bg-gradient-to-r from-[var(--accent-primary)] via-[var(--border-color)] to-transparent dark:from-[var(--accent-secondary)] viking:from-[var(--viking-secondary)]"></div>
          </div>

          {/* Beer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {categoryBeers.map((beer, beerIndex) => (
              <div
                key={beer.id}
                className="animate-scale-in"
                style={{ animationDelay: `${(categoryIndex * 0.15) + (beerIndex * 0.1)}s`, opacity: 0 }}
              >
                <BeerCard beer={beer} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
