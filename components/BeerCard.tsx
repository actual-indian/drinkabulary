import type { Beer } from '@/types/beer';

interface BeerCardProps {
  beer: Beer;
}

export default function BeerCard({ beer }: BeerCardProps) {
  // Use style for display (skip category since it's filtered above)
  const displayStyle = beer.style && beer.style !== 'unknown' && beer.style !== beer.category
    ? beer.style
    : beer.category;

  return (
    <div className="group bg-[var(--bg-secondary)] dark:bg-[var(--bg-accent)] bg-[] rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-[var(--border-color)] dark:border-[var(--border-color)] border-[] hover:border-[var(--accent-primary)] dark:hover:border-[var(--accent-secondary)] hover:border-[] p-3 sm:p-4">

      {/* Beer Name */}
      <h4 className="text-base sm:text-lg font-display uppercase tracking-wide text-[var(--text-primary)] dark:text-[var(--text-primary)] text-[] mb-1 leading-tight">
        {beer.name}
      </h4>

      {/* Brewery */}
      {beer.brewery && beer.brewery !== 'unknown' && (
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] dark:text-[var(--text-secondary)] text-[] mb-2 font-body">
          {beer.brewery}
        </p>
      )}

      {/* Style Tag */}
      {displayStyle && displayStyle !== 'Uncategorized' && (
        <div className="mb-2">
          <span className="inline-block px-2 py-1 bg-[var(--bg-accent)] dark:bg-[var(--bg-primary)] bg-[] text-[var(--text-secondary)] dark:text-[var(--text-secondary)] text-[] rounded text-xs font-body font-medium uppercase tracking-wider">
            {displayStyle}
          </span>
        </div>
      )}

      {/* Recommendation Reason (from LLM) */}
      {beer.reason && (
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] dark:text-[var(--text-secondary)] text-[] mb-3 font-body italic">
          {beer.reason}
        </p>
      )}

      {/* Stats: ABV, IBU, Rating */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--border-color)] border-[]">
        {beer.abv && beer.abv !== 'unknown' && (
          <span className="px-2 py-1 rounded-full bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] dark:text-[var(--accent-secondary)] text-[] text-xs font-medium">
            {beer.abv}
          </span>
        )}
        {beer.ibu && (
          <span className="px-2 py-1 rounded-full bg-[var(--accent-secondary)]/20 text-[var(--accent-secondary)] dark:text-[var(--accent-primary)] text-[] text-xs font-medium">
            {beer.ibu} IBU
          </span>
        )}
        {beer.rating && (
          <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-[] text-xs font-medium">
            ⭐ {beer.rating}
          </span>
        )}
      </div>
    </div>
  );
}
