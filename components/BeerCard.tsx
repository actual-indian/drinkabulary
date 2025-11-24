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
    <div className="bg-white dark:bg-stone-800 viking:bg-[#3D2B1F] rounded-lg shadow-lg viking:shadow-[#8B1A1A]/30 p-4 sm:p-6 hover:shadow-xl viking:hover:shadow-[#CD7F32]/40 transition-all border-2 border-stone-300 dark:border-stone-600 viking:border viking:border-[#5C4A35]">
      <h4 className="text-lg sm:text-xl font-bold text-stone-800 dark:text-stone-100 viking:text-[#F5E6D3] mb-3">
        {beer.name}
      </h4>

      {/* Recommendation reason */}
      {beer.reason && (
        <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 viking:text-[#D4AF37] italic mb-3">
          {beer.reason}
        </p>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 sm:px-3 py-1 bg-amber-100 dark:bg-amber-900 viking:bg-[#8B1A1A] text-amber-800 dark:text-amber-200 viking:text-[#F5E6D3] rounded-full text-xs sm:text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Price */}
      <div className="text-xl sm:text-2xl font-bold text-amber-700 dark:text-amber-500 viking:text-[#DAA520]">
        {beer.price !== 'unknown' ? beer.price : 'Price not available'}
      </div>
    </div>
  );
}
