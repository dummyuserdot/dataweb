import React, { useMemo } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { WATCH_CATALOG, WATCH_CATEGORIES, getEffectivePrice } from '../data/watches';
import { PriceRangeFilter, SortOption } from '../types/watch';

const PRICE_FILTERS: Array<{ id: PriceRangeFilter; label: string }> = [
  { id: 'all', label: 'All Prices' },
  { id: 'under-3000', label: 'Under $3,000' },
  { id: '3000-8000', label: '$3,000 – $8,000' },
  { id: 'over-8000', label: 'Over $8,000' },
];

export const ShopPage: React.FC = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
  } = useStore();

  const filteredWatches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const matches = WATCH_CATALOG.filter((watch) => {
      if (selectedCategory !== 'All' && !watch.categories.includes(selectedCategory)) {
        return false;
      }

      const price = getEffectivePrice(watch);
      if (priceRange === 'under-3000' && price >= 3000) return false;
      if (priceRange === '3000-8000' && (price < 3000 || price > 8000)) return false;
      if (priceRange === 'over-8000' && price <= 8000) return false;

      if (q) {
        const haystack = [
          watch.name,
          watch.subtitle,
          watch.reference,
          watch.description,
          watch.primaryCategory,
          watch.specifications.caliber,
          watch.specifications.caseMaterial,
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });

    const sorted = [...matches];
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
        break;
      case 'price-desc':
        sorted.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
        break;
      case 'newest':
        sorted.sort(
          (a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime(),
        );
        break;
      case 'popular':
      default:
        sorted.sort((a, b) => b.popularityScore - a.popularityScore);
        break;
    }

    return sorted;
  }, [selectedCategory, searchQuery, priceRange, sortBy]);

  const hasActiveFilters =
    selectedCategory !== 'All' || searchQuery.trim() !== '' || priceRange !== 'all';

  const resetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setPriceRange('all');
    setSortBy('popular');
  };

  return (
    <section className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 py-10 sm:py-14">
      {/* Collection Header */}
      <div className="border-b border-white/[0.08] pb-6 sm:pb-8">
        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#D4AF37]">
          Geneva Timepiece Archive
        </p>
        <div className="mt-2 flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4">
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#FDFBF7]">
            The Collection
          </h1>
          <p className="text-sm text-[#9CA3AF] tabular-nums">
            Showing {filteredWatches.length} of {WATCH_CATALOG.length} timepieces
          </p>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-2">
        {WATCH_CATEGORIES.map((category) => {
          const active = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`min-h-[40px] rounded border px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-medium tracking-[0.1em] sm:tracking-[0.12em] uppercase whitespace-nowrap shrink-0 transition-colors duration-200 cursor-pointer ${
                active
                  ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#F2CA50]'
                  : 'border-white/10 bg-[#12141A] text-[#D0C5AF] hover:border-[#D4AF37]/40 hover:text-[#FDFBF7]'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Search, Price Filter & Sort Toolbar */}
      <div className="mt-5 sm:mt-6 glass-sapphire rounded-lg p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Input (16px on mobile to prevent iOS Safari zoom) */}
        <div className="relative flex-1 lg:max-w-md">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by model, caliber, metal..."
            aria-label="Search watches"
            className="w-full min-h-[44px] rounded border border-white/12 bg-[#0E1015] pl-10 pr-10 py-2.5 text-base sm:text-sm text-[#FDFBF7] placeholder:text-[#9CA3AF]/60 focus:border-[#D4AF37] focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center text-[#9CA3AF] hover:text-[#FDFBF7] cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Price Brackets & Sort */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <SlidersHorizontal className="h-4 w-4 text-[#D4AF37] mr-1 hidden sm:inline" aria-hidden="true" />
            {PRICE_FILTERS.map((pf) => (
              <button
                key={pf.id}
                type="button"
                onClick={() => setPriceRange(pf.id)}
                className={`min-h-[40px] rounded border px-3 py-2 text-xs whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  priceRange === pf.id
                    ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#F2CA50]'
                    : 'border-white/10 bg-[#0E1015] text-[#9CA3AF] hover:text-[#FDFBF7]'
                }`}
              >
                {pf.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label htmlFor="sort-watches" className="text-xs text-[#9CA3AF] whitespace-nowrap">
              Sort:
            </label>
            <select
              id="sort-watches"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="flex-1 sm:flex-initial min-h-[42px] rounded border border-white/12 bg-[#0E1015] px-3 py-2 text-base sm:text-xs text-[#FDFBF7] focus:border-[#D4AF37] focus:outline-none cursor-pointer"
            >
              <option value="popular">Popularity</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid or Empty State */}
      {filteredWatches.length === 0 ? (
        <div className="mt-12 sm:mt-16 rounded-lg border border-white/[0.08] bg-[#12141A] p-8 sm:p-12 text-center">
          <h2 className="font-serif text-2xl text-[#FDFBF7]">No Timepieces Match Your Criteria</h2>
          <p className="mt-2 text-sm text-[#9CA3AF]">
            Try clearing your search query or adjusting the category and price bracket filters.
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 min-h-[44px] rounded border border-[#D4AF37]/50 px-6 py-2.5 text-xs font-medium tracking-[0.14em] uppercase text-[#F2CA50] hover:bg-[#D4AF37]/15 transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredWatches.map((watch) => (
            <ProductCard key={watch.id} watch={watch} />
          ))}
        </div>
      )}
    </section>
  );
};
