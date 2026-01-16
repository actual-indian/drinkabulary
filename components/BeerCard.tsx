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
      <h4 className="text-base sm:text-lg font-display uppercase tracking-wide text-[var(--text-primary)] dark:text-[var(--text-primary)] text-[] mb-2 leading-tight">
        {beer.name}
      </h4>

      {/* Style Tag */}
      {displayStyle && displayStyle !== 'Uncategorized' && (
        <div className="mb-2">
          <span className="inline-block px-2 py-1 bg-[var(--bg-accent)] dark:bg-[var(--bg-primary)] bg-[] text-[var(--text-secondary)] dark:text-[var(--text-secondary)] text-[] rounded text-xs font-body font-medium uppercase tracking-wider">
            {displayStyle}
          </span>
        </div>
      )}

      {/* Price */}
      <div className="flex items-baseline justify-between pt-2 border-t border-[var(--border-color)] border-[]">
        <span className="text-lg sm:text-xl font-display text-[var(--accent-primary)] dark:text-[var(--accent-secondary)] text-[] font-semibold">
          {beer.price !== 'unknown' ? beer.price : 'Ask'}
        </span>
      </div>
    </div>
  );
}
