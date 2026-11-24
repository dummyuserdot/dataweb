import React from 'react';
import { ArrowRight, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { WatchImage } from '../components/WatchImage';
import { useStore } from '../context/StoreContext';
import { WATCH_CATALOG, formatCurrency, getEffectivePrice } from '../data/watches';

export const WishlistPage: React.FC = () => {
  const { wishlist, toggleWishlist, addToCart, navigate } = useStore();

  const savedWatches = WATCH_CATALOG.filter((w) => wishlist.includes(w.id));

  return (
    <section className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 py-10 sm:py-14 min-h-[70vh]">
      <div className="border-b border-white/[0.08] pb-6 sm:pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#D4AF37]">
            Personal Curation
          </p>
          <h1 className="mt-2 font-serif text-3xl sm:text-5xl font-normal text-[#FDFBF7]">
            Saved Wishlist
          </h1>
        </div>
        <p className="text-sm text-[#9CA3AF] tabular-nums">
          {savedWatches.length} {savedWatches.length === 1 ? 'timepiece' : 'timepieces'} saved
        </p>
      </div>

      {savedWatches.length === 0 ? (
        <div className="mt-12 sm:mt-16 rounded-lg border border-white/[0.08] bg-[#12141A] p-8 sm:p-12 text-center max-w-xl mx-auto">
          <Heart className="h-8 w-8 text-[#D4AF37]/60 mx-auto" aria-hidden="true" />
          <h2 className="mt-4 font-serif text-2xl text-[#FDFBF7]">
            Your Private Wishlist is Empty
          </h2>
          <p className="mt-2 text-sm text-[#9CA3AF]">
            Save favorite references as you browse the Geneva archive to compare calibers and
            finishes at your leisure.
          </p>
          <button
            type="button"
            onClick={() => navigate({ name: 'shop' })}
            className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded bg-gradient-to-r from-[#D4AF37] to-[#C59F2E] px-6 py-3 text-xs font-semibold tracking-[0.14em] uppercase text-[#0B0C10] cursor-pointer"
          >
            <span>Browse Watches</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {savedWatches.map((watch) => {
            const effectivePrice = getEffectivePrice(watch);
            return (
              <article
                key={watch.id}
                className="flex flex-col rounded-lg border border-white/[0.08] bg-[#12141A] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => navigate({ name: 'product', slug: watch.slug })}
                  className="aspect-[4/3] w-full overflow-hidden bg-[#0D0E12] cursor-pointer"
                >
                  <WatchImage
                    src={watch.image}
                    alt={watch.name}
                    title={watch.name}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </button>

                <div className="flex flex-1 flex-col justify-between p-4 sm:p-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] tracking-[0.16em] uppercase text-[#9CA3AF]">
                      <span>{watch.primaryCategory}</span>
                      <span aria-hidden="true">·</span>
                      <span>{watch.stockStatus}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate({ name: 'product', slug: watch.slug })}
                      className="mt-2 block text-left font-serif text-lg sm:text-xl text-[#FDFBF7] hover:text-[#F2CA50] cursor-pointer"
                    >
                      {watch.name}
                    </button>
                    <p className="mt-1 text-sm text-[#9CA3AF] line-clamp-1">{watch.subtitle}</p>
                    <p className="mt-3 text-base font-medium tabular-nums text-[#F4F0E8]">
                      {formatCurrency(effectivePrice)}
                    </p>
                  </div>

                  <div className="mt-5 sm:mt-6 pt-4 border-t border-white/[0.07] flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => addToCart(watch.id, watch.variants[0]?.id, 1, true)}
                      className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-2 rounded bg-gradient-to-r from-[#D4AF37] to-[#C59F2E] px-4 py-2.5 text-xs font-semibold tracking-[0.12em] uppercase text-[#0B0C10] cursor-pointer"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Move to Bag</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleWishlist(watch.id)}
                      aria-label={`Remove ${watch.name} from wishlist`}
                      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded border border-white/12 text-[#9CA3AF] hover:border-[#FFB4AB]/50 hover:text-[#FFB4AB] transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
