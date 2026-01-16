import type { Beer } from '@/types/beer';

interface BeerCardProps {
  beer: Beer;
}

export default function BeerCard({ beer }: BeerCardProps) {
  // Combine category and style for display
  const tags = [];
  if (beer.category && beer.category !== 'Uncategorized') {
    tags.push(beer.category);
  }
  if (beer.style && beer.style !== 'unknown' && beer.style !== beer.category) {
    tags.push(beer.style);
  }

  return (
    <div className="group relative">
      {/* Glowing effect on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] viking:from-[var(--viking-secondary)] viking:to-[var(--viking-accent)] rounded-2xl opacity-0 group-hover:opacity-20 blur transition-all duration-300" />

      <div className="relative bg-[var(--bg-secondary)] dark:bg-[var(--bg-accent)] viking:bg-[var(--viking-bg-card)] rounded-2xl shadow-lg p-5 sm:p-6 hover:shadow-2xl viking:shadow-[var(--viking-glow)] viking:hover:shadow-[var(--viking-glow-intense)] transition-all duration-300 border border-[var(--border-color)] dark:border-[var(--border-color)] viking:border-[var(--viking-border)] hover:border-[var(--accent-primary)] dark:hover:border-[var(--accent-secondary)] viking:hover:border-[var(--viking-secondary)] hover:-translate-y-1">

        {/* Beer Name with Display Font */}
        <h4 className="text-xl sm:text-2xl font-display uppercase tracking-wide text-[var(--text-primary)] dark:text-[var(--text-primary)] viking:text-[var(--viking-text-primary)] mb-3 group-hover:text-[var(--accent-primary)] dark:group-hover:text-[var(--accent-secondary)] viking:group-hover:text-[var(--viking-accent)] transition-colors">
          {beer.name}
        </h4>

        {/* Decorative divider */}
        <div className="h-0.5 w-16 bg-gradient-to-r from-[var(--accent-primary)] to-transparent dark:from-[var(--accent-secondary)] viking:from-[var(--viking-secondary)] mb-3 group-hover:w-24 transition-all duration-300" />

        {/* Recommendation reason */}
        {beer.reason && (
          <p className="text-sm sm:text-base font-body text-[var(--text-secondary)] dark:text-[var(--text-secondary)] viking:text-[var(--viking-text-secondary)] italic mb-4 leading-relaxed">
            "{beer.reason}"
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-[var(--bg-accent)] dark:bg-[var(--bg-primary)] viking:bg-[var(--viking-bg-elevated)] text-[var(--accent-primary)] dark:text-[var(--accent-secondary)] viking:text-[var(--viking-accent)] rounded-full text-xs sm:text-sm font-body font-medium border border-[var(--accent-primary)] dark:border-[var(--accent-secondary)] viking:border-[var(--viking-secondary)] uppercase tracking-wider hover:scale-105 transition-transform"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Price with emphasis */}
        <div className="flex items-baseline gap-2 pt-3 border-t border-[var(--border-color)] viking:border-[var(--viking-border)]">
          <span className="text-2xl sm:text-3xl font-display text-[var(--accent-primary)] dark:text-[var(--accent-secondary)] viking:text-[var(--viking-accent)] group-hover:scale-110 transition-transform origin-left">
            {beer.price !== 'unknown' ? beer.price : 'Ask for price'}
          </span>
        </div>
      </div>
    </div>
  );
}
