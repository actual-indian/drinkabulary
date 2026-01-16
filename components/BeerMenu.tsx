'use client';

import { useState, useEffect } from 'react';
import type { Beer } from '@/types/beer';
import BeerCard from './BeerCard';

export default function BeerMenu() {
  const [beers, setBeers] = useState<Beer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetch('/api/beers')
      .then((res) => res.json())
      .then((data) => {
        // Filter out 'stock' category
        const filteredBeers = data.filter((beer: Beer) =>
          beer.category.toLowerCase() !== 'stock'
        );
        setBeers(filteredBeers);
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
          <div className="w-3 h-3 bg-[var(--accent-primary)] dark:bg-[var(--accent-secondary)] bg-[] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-[var(--accent-primary)] dark:bg-[var(--accent-secondary)] bg-[] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-[var(--accent-primary)] dark:bg-[var(--accent-secondary)] bg-[] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <div className="text-[var(--text-secondary)] dark:text-[var(--text-secondary)] text-[] font-body font-medium">Loading menu...</div>
      </div>
    );
  }

  // Get unique categories (excluding 'stock')
  const categories = Array.from(new Set(beers.map(beer => beer.category))).sort();

  // Filter beers based on selected category
  const filteredBeers = selectedCategory === 'all'
    ? beers
    : beers.filter(beer => beer.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8">
      {/* Hero Title */}
      <div className="text-center mb-6 sm:mb-8 animate-fade-in-up">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display uppercase tracking-wider bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-secondary)] to-[var(--accent-primary)] dark:from-[var(--accent-secondary)] dark:via-[var(--accent-primary)] dark:to-[var(--accent-secondary)] from-[] via-[] to-[] bg-clip-text text-transparent mb-3">
          Our Selection
        </h2>
        <div className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent dark:via-[var(--accent-secondary)] via-[]"></div>
      </div>

      {/* Category Filters */}
      <div className="mb-6 sm:mb-8 animate-fade-in-up stagger-1">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg font-body font-medium transition-all text-sm sm:text-base ${
              selectedCategory === 'all'
                ? 'bg-[var(--accent-primary)] dark:bg-[var(--accent-primary)] bg-[] text-white shadow-lg scale-105'
                : 'bg-[var(--bg-secondary)] dark:bg-[var(--bg-accent)] bg-[] text-[var(--text-secondary)] dark:text-[var(--text-secondary)] text-[] border border-[var(--border-color)] border-[] hover:border-[var(--accent-primary)] hover:border-[] hover:scale-105'
            }`}
          >
            All ({beers.length})
          </button>
          {categories.map((category) => {
            const count = beers.filter(beer => beer.category === category).length;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-body font-medium transition-all text-sm sm:text-base ${
                  selectedCategory === category
                    ? 'bg-[var(--accent-primary)] dark:bg-[var(--accent-primary)] bg-[] text-white shadow-lg scale-105'
                    : 'bg-[var(--bg-secondary)] dark:bg-[var(--bg-accent)] bg-[] text-[var(--text-secondary)] dark:text-[var(--text-secondary)] text-[] border border-[var(--border-color)] border-[] hover:border-[var(--accent-primary)] hover:border-[] hover:scale-105'
                }`}
              >
                {category} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Beer List - Dense Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 animate-fade-in">
        {filteredBeers.map((beer) => (
          <BeerCard key={beer.id} beer={beer} />
        ))}
      </div>

      {/* Empty state */}
      {filteredBeers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[var(--text-secondary)] dark:text-[var(--text-secondary)] text-[] font-body text-lg">
            No beers found in this category.
          </p>
        </div>
      )}
    </div>
  );
}
