/**
 * Quick analysis script to compare Menu beers vs Library beers
 * Shows potential matches and identifies matching challenges
 */

interface MenuBeer {
  name: string;
  category: string;
  style: string;
  price: string;
}

interface LibraryBeer {
  name: string;
  brewery: string;
  style?: string;
  abv?: string;
  rating?: string;
}

interface LibraryData {
  beers: LibraryBeer[];
}

/**
 * Normalize beer name for comparison
 * Removes volume info, tap numbers, extra whitespace, special chars
 */
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s*\d+[.,]\d+l\s*/g, '') // Remove volume (0.47l, 0,4l, etc)
    .replace(/\s*\(\d+\)\s*/g, '') // Remove tap numbers like (39)
    .replace(/[øö]/g, 'o')
    .replace(/[åä]/g, 'a')
    .replace(/[æ]/g, 'ae')
    .replace(/[^a-z0-9\s]/g, '') // Remove special chars
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

/**
 * Calculate simple similarity score (0-1) between two strings
 */
function similarity(s1: string, s2: string): number {
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;

  if (longer.length === 0) return 1.0;

  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

/**
 * Levenshtein distance (edit distance) between two strings
 */
function levenshteinDistance(s1: string, s2: string): number {
  const costs: number[] = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

async function analyzeMatching() {
  console.log('🔍 Beer Matching Analysis\n');
  console.log('='.repeat(80));

  // Load menu data
  const menuResponse = await fetch('http://localhost:3000/api/beers');
  const allMenuItems: MenuBeer[] = await menuResponse.json();
  const menuBeers = allMenuItems.filter(item => item.category === 'Beer');

  // Load library data
  const libraryResponse = await fetch('http://localhost:3000/data/scraped-beers.json');
  const libraryData: LibraryData = await libraryResponse.json();
  const libraryBeers = libraryData.beers;

  console.log(`\n📊 Dataset Overview:`);
  console.log(`   Menu beers: ${menuBeers.length}`);
  console.log(`   Library beers: ${libraryBeers.length}`);

  // Sample menu beers
  console.log(`\n📝 Sample Menu Names (first 5):`);
  menuBeers.slice(0, 5).forEach(beer => {
    console.log(`   "${beer.name}"`);
  });

  // Sample library beers
  console.log(`\n📚 Sample Library Names (first 5):`);
  libraryBeers.slice(0, 5).forEach(beer => {
    console.log(`   "${beer.name}" by ${beer.brewery}`);
  });

  // Normalize and compare
  console.log(`\n🔄 Normalized Menu Names (first 5):`);
  menuBeers.slice(0, 5).forEach(beer => {
    const original = beer.name;
    const normalized = normalizeName(beer.name);
    console.log(`   "${original}"`);
    console.log(`   → "${normalized}"`);
  });

  // Try to find matches
  console.log(`\n🎯 Finding Potential Matches (threshold: 0.80 similarity):\n`);

  const THRESHOLD = 0.80;
  let exactMatches = 0;
  let fuzzyMatches = 0;
  let potentialMatches: Array<{
    menuName: string;
    libraryName: string;
    brewery: string;
    similarity: number;
    matchType: 'exact' | 'fuzzy';
  }> = [];

  for (const menuBeer of menuBeers) {
    const normalizedMenu = normalizeName(menuBeer.name);
    let bestMatch: typeof potentialMatches[0] | null = null;

    for (const libBeer of libraryBeers) {
      // Try matching just beer name
      const normalizedLibBeer = normalizeName(libBeer.name);
      const score1 = similarity(normalizedMenu, normalizedLibBeer);

      // Try matching brewery + beer name
      const normalizedLibFull = normalizeName(`${libBeer.brewery} ${libBeer.name}`);
      const score2 = similarity(normalizedMenu, normalizedLibFull);

      const bestScore = Math.max(score1, score2);

      if (bestScore >= THRESHOLD) {
        if (!bestMatch || bestScore > bestMatch.similarity) {
          bestMatch = {
            menuName: menuBeer.name,
            libraryName: libBeer.name,
            brewery: libBeer.brewery,
            similarity: bestScore,
            matchType: bestScore === 1.0 ? 'exact' : 'fuzzy',
          };
        }
      }
    }

    if (bestMatch) {
      potentialMatches.push(bestMatch);
      if (bestMatch.matchType === 'exact') {
        exactMatches++;
      } else {
        fuzzyMatches++;
      }
    }
  }

  // Show results
  console.log(`   Total matches found: ${potentialMatches.length}`);
  console.log(`   - Exact matches: ${exactMatches}`);
  console.log(`   - Fuzzy matches: ${fuzzyMatches}`);
  console.log(`   - Unmatched menu beers: ${menuBeers.length - potentialMatches.length}`);
  console.log(`   - Match rate: ${((potentialMatches.length / menuBeers.length) * 100).toFixed(1)}%`);

  // Show some examples
  console.log(`\n✅ Sample Exact Matches:`);
  potentialMatches
    .filter(m => m.matchType === 'exact')
    .slice(0, 5)
    .forEach(match => {
      console.log(`   Menu: "${match.menuName}"`);
      console.log(`   Library: "${match.libraryName}" (${match.brewery})`);
      console.log(`   Score: ${match.similarity.toFixed(3)}\n`);
    });

  console.log(`🔸 Sample Fuzzy Matches:`);
  potentialMatches
    .filter(m => m.matchType === 'fuzzy')
    .slice(0, 5)
    .forEach(match => {
      console.log(`   Menu: "${match.menuName}"`);
      console.log(`   Library: "${match.libraryName}" (${match.brewery})`);
      console.log(`   Score: ${match.similarity.toFixed(3)}\n`);
    });

  console.log(`❌ Sample Unmatched Menu Beers:`);
  const unmatchedMenu = menuBeers.filter(mb =>
    !potentialMatches.some(pm => pm.menuName === mb.name)
  );
  unmatchedMenu.slice(0, 5).forEach(beer => {
    console.log(`   "${beer.name}"`);
  });

  console.log('\n' + '='.repeat(80));
  console.log('\n💡 Key Insights:');
  console.log('   • Menu names include volume (0.4l) and tap numbers (39)');
  console.log('   • Menu combines brewery + beer name in one field');
  console.log('   • Library has separate brewery and name fields');
  console.log('   • Character encoding differences (Ø, ø, etc.)');
  console.log('   • Typos and inconsistencies exist in both datasets');
  console.log('   • Fuzzy matching is essential for good coverage');
}

analyzeMatching().catch(console.error);
