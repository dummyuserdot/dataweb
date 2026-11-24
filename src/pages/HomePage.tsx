import React, { useState } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { ProductCard } from '../components/ProductCard';
import { WatchImage } from '../components/WatchImage';
import { useStore } from '../context/StoreContext';
import { ATELIER_IMAGE, HERO_IMAGE, WATCH_CATALOG } from '../data/watches';

export const HomePage: React.FC = () => {
  const { navigate, setSelectedCategory } = useStore();
  const [collectionTab, setCollectionTab] = useState<'featured' | 'bestsellers'>('featured');

  const showcasedWatches =
    collectionTab === 'featured'
      ? WATCH_CATALOG.filter((w) => w.featured || w.trending).slice(0, 6)
      : WATCH_CATALOG.filter((w) => w.bestSeller).slice(0, 6);

  return (
    <div className="w-full">
      {/* 1. Storefront Hero Section */}
      <section className="relative overflow-hidden border-b border-white/[0.08] bg-[#0B0C10]">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 py-10 sm:py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Editorial Copy Column */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 flex flex-col justify-center"
            >
              <p className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase text-[#E5C158]">
                Geneva Haute Horlogerie · Est. 1924
              </p>

              <h1 className="mt-3 sm:mt-4 font-serif text-[32px] sm:text-5xl lg:text-[56px] font-normal leading-[1.15] tracking-[-0.02em] text-[#FDFBF7] [text-wrap:balance]">
                Mastery Measured in Pure Gold
              </h1>

              <p className="mt-4 sm:mt-6 max-w-xl text-sm sm:text-lg font-light leading-relaxed text-[#D0C5AF]">
                Discover mechanical tourbillons, titanium marine chronographs, and sapphire-dressed
                connected timepieces crafted for collectors across the world.
              </p>

              <div className="mt-7 sm:mt-8 flex flex-col xs:flex-row sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    navigate({ name: 'shop' });
                  }}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2.5 rounded bg-gradient-to-r from-[#D4AF37] to-[#C59F2E] px-6 sm:px-7 py-3.5 text-xs font-semibold tracking-[0.16em] uppercase text-[#0B0C10] whitespace-nowrap shrink-0 transition-all duration-200 hover:brightness-110 gold-glow-hover cursor-pointer"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => navigate({ name: 'shop' }, { category: 'Luxury Watches' })}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded border border-[#D4AF37]/40 bg-[#12141A]/70 px-6 sm:px-7 py-3.5 text-xs font-medium tracking-[0.16em] uppercase text-[#F4F0E8] whitespace-nowrap shrink-0 transition-all duration-200 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 cursor-pointer"
                >
                  <span>Explore Collection</span>
                </button>
              </div>
            </motion.div>

            {/* 16:9 Hero Watch Showcase */}
            <motion.div
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7"
            >
              <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:h-full lg:min-h-[440px] overflow-hidden rounded-lg border border-[#D4AF37]/20 bg-[#12141A]">
                <WatchImage
                  src={HERO_IMAGE}
                  alt="Valmont Genève 18k champagne gold skeleton tourbillon timepiece on obsidian stone"
                  title="Valmont Sovereign Tourbillon"
                  eager
                  className="h-full w-full object-cover"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0C10]/90 via-[#0B0C10]/20 to-transparent"
                />
                <div className="absolute bottom-3 left-4 right-4 sm:bottom-5 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#E5C158]">
                      Signature Caliber VG-88
                    </p>
                    <p className="mt-0.5 sm:mt-1 font-serif text-base sm:text-xl text-[#FDFBF7] truncate">
                      18K Champagne Tourbillon
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      navigate({ name: 'product', slug: 'valmont-sovereign-chronometre' })
                    }
                    className="self-start sm:self-auto text-[11px] sm:text-xs font-medium tracking-[0.14em] uppercase text-[#F2CA50] underline underline-offset-4 hover:text-[#FDFBF7] whitespace-nowrap cursor-pointer py-1"
                  >
                    Inspect Timepiece
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 4-Column Horological Trust Row */}
          <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-white/[0.08] grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { label: 'Chronometer Precision', value: '-2 / +2 sec per day' },
              { label: 'Power Autonomy', value: 'Up to 75 Hours Reserve' },
              { label: 'Armored Logistics', value: 'Complimentary Insured Courier' },
              { label: 'Geneva Guarantee', value: '5-Year International Warranty' },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[10px] font-semibold tracking-[0.16em] sm:tracking-[0.2em] uppercase text-[#9CA3AF]">
                  {item.label}
                </p>
                <p className="mt-1 sm:mt-1.5 font-serif text-sm sm:text-lg text-[#F4F0E8] tabular-nums">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Featured & Best-Selling Collection */}
      <section className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 py-14 sm:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6 pb-6 sm:pb-8 border-b border-white/[0.08]">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#D4AF37]">
              Curated Horology
            </p>
            <h2 className="mt-2 font-serif text-2xl sm:text-4xl font-normal text-[#FDFBF7] [text-wrap:balance]">
              {collectionTab === 'featured'
                ? 'Featured & Trending Timepieces'
                : 'Collector Best Sellers'}
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            {/* Responsive Segmented Tab Controls (never overflows at 320px) */}
            <div className="grid grid-cols-2 sm:inline-flex rounded border border-white/10 bg-[#12141A] p-1 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setCollectionTab('featured')}
                className={`rounded px-2.5 sm:px-4 py-2.5 sm:py-2 text-[10px] sm:text-xs font-medium tracking-[0.08em] sm:tracking-[0.12em] uppercase whitespace-nowrap transition-colors cursor-pointer ${
                  collectionTab === 'featured'
                    ? 'bg-[#D4AF37]/20 text-[#F2CA50] border border-[#D4AF37]/40'
                    : 'text-[#9CA3AF] hover:text-[#FDFBF7] border border-transparent'
                }`}
              >
                Featured & Trending
              </button>
              <button
                type="button"
                onClick={() => setCollectionTab('bestsellers')}
                className={`rounded px-2.5 sm:px-4 py-2.5 sm:py-2 text-[10px] sm:text-xs font-medium tracking-[0.08em] sm:tracking-[0.12em] uppercase whitespace-nowrap transition-colors cursor-pointer ${
                  collectionTab === 'bestsellers'
                    ? 'bg-[#D4AF37]/20 text-[#F2CA50] border border-[#D4AF37]/40'
                    : 'text-[#9CA3AF] hover:text-[#FDFBF7] border border-transparent'
                }`}
              >
                Best Sellers
              </button>
            </div>

            <button
              type="button"
              onClick={() => navigate({ name: 'shop' })}
              className="self-start sm:self-auto text-xs font-medium tracking-[0.14em] uppercase text-[#D4AF37] hover:text-[#FDFBF7] underline underline-offset-4 whitespace-nowrap cursor-pointer py-1"
            >
              View Full Catalog ({WATCH_CATALOG.length})
            </button>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {showcasedWatches.map((watch) => (
            <ProductCard key={watch.id} watch={watch} />
          ))}
        </div>
      </section>

      {/* 3. Private Collector Privilege Banner */}
      <section className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 pb-14 sm:pb-20">
        <div className="glass-sapphire rounded-lg border border-[#D4AF37]/25 p-6 sm:p-10 lg:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#E5C158]">
              Autumn Salon Allocation
            </p>
            <h2 className="mt-2.5 sm:mt-3 font-serif text-2xl sm:text-3xl font-normal text-[#FDFBF7] [text-wrap:balance]">
              Receive an Additional 10% Collector Privilege at Checkout
            </h2>
            <p className="mt-3 text-sm sm:text-base font-light text-[#D0C5AF]">
              Apply invitation code <strong className="font-medium text-[#F2CA50]">VALMONT10</strong>{' '}
              in your acquisition bag for 10% off your timepiece, paired with complimentary bespoke
              caseback engraving and insured Geneva air dispatch.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={() => navigate({ name: 'shop' })}
              className="w-full sm:w-auto inline-flex min-h-[44px] items-center justify-center gap-2 rounded bg-gradient-to-r from-[#D4AF37] to-[#C59F2E] px-6 py-3.5 text-xs font-semibold tracking-[0.15em] uppercase text-[#0B0C10] whitespace-nowrap shrink-0 transition-all hover:brightness-110 cursor-pointer"
            >
              <span>Shop Seasonal Offers</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Atelier Craftsmanship Split */}
      <section className="border-t border-white/[0.08] bg-[#12141A]/50">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 py-14 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-stretch">
            <div className="lg:col-span-6 overflow-hidden rounded-lg border border-white/[0.08] bg-[#0D0E12] aspect-[4/3] lg:aspect-auto">
              <WatchImage
                src={ATELIER_IMAGE}
                alt="Master Swiss watchmaker inspecting a mechanical gold caliber in Geneva"
                title="Valmont Geneva Atelier"
                className="h-full w-full lg:min-h-[340px] object-cover"
              />
            </div>

            <div className="lg:col-span-6 flex flex-col justify-center">
              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#D4AF37]">
                The Geneva Manufacture
              </p>
              <h2 className="mt-3 font-serif text-2xl sm:text-4xl font-normal text-[#FDFBF7] [text-wrap:balance]">
                Every Bridge Hand-Beveled, Every Caliber Regulated by Hand
              </h2>
              <p className="mt-4 sm:mt-5 text-sm sm:text-base font-light leading-relaxed text-[#D0C5AF]">
                Across three generations on the banks of Lake Geneva, Valmont Genève has paired
                traditional hand-guilloché finishing with modern metallurgical endurance—creating
                heirloom watches for both men and women.
              </p>

              <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 border-t border-white/[0.08] pt-6">
                <div>
                  <p className="font-serif text-lg text-[#FDFBF7]">Men&apos;s & Women&apos;s Sizing</p>
                  <p className="mt-1 text-sm text-[#9CA3AF]">
                    Tailored ergonomics from 24 mm Art Deco tanks to 43.5 mm skeleton chronographs.
                  </p>
                </div>
                <div>
                  <p className="font-serif text-lg text-[#FDFBF7]">Authenticated Provenance</p>
                  <p className="mt-1 text-sm text-[#9CA3AF]">
                    Each watch ships with a numbered Geneva archival certificate and 5-year service cover.
                  </p>
                </div>
              </div>

              <div className="mt-7 sm:mt-8 flex flex-wrap items-center gap-4 sm:gap-6">
                <button
                  type="button"
                  onClick={() => navigate({ name: 'about' })}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded border border-[#D4AF37]/40 px-6 py-3 text-xs font-medium tracking-[0.14em] uppercase text-[#F4F0E8] hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors cursor-pointer"
                >
                  <span>Discover Our Story</span>
                </button>
                <span className="inline-flex items-center gap-1.5 text-xs text-[#9CA3AF]">
                  <ShieldCheck className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
                  Swiss Made Certified
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
