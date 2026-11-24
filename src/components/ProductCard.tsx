import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatCurrency, getEffectivePrice } from '../data/watches';
import { WatchProduct } from '../types/watch';
import { WatchImage } from './WatchImage';

interface ProductCardProps {
  watch: WatchProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ watch }) => {
  const { navigate, addToCart, toggleWishlist, isWishlisted } = useStore();
  const wishlisted = isWishlisted(watch.id);
  const effectivePrice = getEffectivePrice(watch);
  const hasDiscount = Boolean(watch.discountPrice && watch.discountPrice < watch.price);

  return (
    <article className="group flex flex-col rounded-lg border border-white/[0.08] bg-[#12141A] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D4AF37]/40 gold-glow-hover overflow-hidden">
      {/* Watch Studio Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0D0E12]">
        <button
          type="button"
          onClick={() => navigate({ name: 'product', slug: watch.slug })}
          className="block h-full w-full text-left cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]"
          aria-label={`View details for ${watch.name}`}
        >
          <WatchImage
            src={watch.image}
            alt={`${watch.name} — ${watch.subtitle}`}
            title={watch.name}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#12141A]/75 via-transparent to-transparent"
          />
        </button>

        {/* Wishlist Icon Action (44x44 mobile touch target) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(watch.id);
          }}
          aria-label={wishlisted ? `Remove ${watch.name} from wishlist` : `Save ${watch.name} to wishlist`}
          className={`absolute top-3 right-3 inline-flex h-11 w-11 items-center justify-center rounded border backdrop-blur-md transition-colors duration-200 cursor-pointer ${
            wishlisted
              ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-[#F2CA50]'
              : 'border-white/15 bg-[#0B0C10]/65 text-[#E3E2E8] hover:border-[#D4AF37]/60 hover:text-[#F2CA50]'
          }`}
        >
          <Heart className={`h-4 w-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Card Body: Uniform Field Order */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-6">
        <div>
          {/* Clean Unboxed Metadata */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] font-medium tracking-[0.14em] sm:tracking-[0.16em] uppercase text-[#9CA3AF]">
            <span>{watch.primaryCategory}</span>
            <span aria-hidden="true">·</span>
            <span className={watch.stockStatus === 'Limited Allocation' ? 'text-[#E5C158]' : ''}>
              {watch.stockStatus}
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate({ name: 'product', slug: watch.slug })}
            className="mt-2 block text-left cursor-pointer focus-visible:outline-none focus-visible:underline"
          >
            <h3 className="font-serif text-lg sm:text-xl font-medium text-[#FDFBF7] group-hover:text-[#F2CA50] transition-colors">
              {watch.name}
            </h3>
          </button>

          <p className="mt-1 text-sm text-[#9CA3AF] line-clamp-1">{watch.subtitle}</p>
        </div>

        {/* Baseline-Aligned Pricing & Actions */}
        <div className="mt-5 sm:mt-6 pt-4 border-t border-white/[0.07] flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 tabular-nums">
            <span className="text-base font-medium text-[#FDFBF7]">
              {formatCurrency(effectivePrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-[#9CA3AF] line-through">
                {formatCurrency(watch.price)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => addToCart(watch.id, watch.variants[0]?.id, 1, true)}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded bg-gradient-to-r from-[#D4AF37] to-[#C59F2E] px-4 py-2 text-xs font-semibold tracking-[0.1em] uppercase text-[#0B0C10] whitespace-nowrap shrink-0 transition-all duration-200 hover:brightness-110 cursor-pointer"
          >
            <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </article>
  );
};
