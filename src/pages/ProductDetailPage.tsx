import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, Heart, Minus, Plus, ShieldCheck, ShoppingBag, ZoomIn } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { WatchImage } from '../components/WatchImage';
import { useStore } from '../context/StoreContext';
import { WATCH_CATALOG, formatCurrency, getEffectivePrice } from '../data/watches';

interface ProductDetailPageProps {
  slug: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug }) => {
  const { navigate, addToCart, toggleWishlist, isWishlisted } = useStore();

  const watch = useMemo(
    () => WATCH_CATALOG.find((w) => w.slug === slug),
    [slug],
  );

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    watch?.variants[0]?.id ?? '',
  );
  const [quantity, setQuantity] = useState(1);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    setSelectedVariantId(watch?.variants[0]?.id ?? '');
    setQuantity(1);
    setZoomed(false);
  }, [watch]);

  const relatedWatches = useMemo(() => {
    if (!watch) return [];
    return WATCH_CATALOG.filter(
      (candidate) =>
        candidate.id !== watch.id &&
        candidate.categories.some((c) => watch.categories.includes(c)),
    ).slice(0, 3);
  }, [watch]);

  if (!watch) {
    return (
      <section className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 py-20 min-h-[65vh]">
        <div className="mx-auto max-w-lg rounded-lg border border-white/[0.08] bg-[#12141A] p-8 sm:p-12 text-center space-y-4">
          <h1 className="font-serif text-3xl text-[#FDFBF7]">Timepiece Not Found</h1>
          <p className="text-sm text-[#9CA3AF]">
            The requested reference could not be located in our current archive.
          </p>
          <button
            type="button"
            onClick={() => navigate({ name: 'shop' })}
            className="mt-2 inline-flex min-h-[44px] items-center gap-2 rounded bg-gradient-to-r from-[#D4AF37] to-[#C59F2E] px-6 py-3 text-xs font-semibold tracking-[0.14em] uppercase text-[#0B0C10] cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Return to Collection</span>
          </button>
        </div>
      </section>
    );
  }

  const selectedVariant =
    watch.variants.find((v) => v.id === selectedVariantId) ?? watch.variants[0];
  const wishlisted = isWishlisted(watch.id);
  const effectivePrice = getEffectivePrice(watch);
  const hasDiscount = Boolean(watch.discountPrice && watch.discountPrice < watch.price);
  const savingsPct = hasDiscount
    ? Math.round(((watch.price - effectivePrice) / watch.price) * 100)
    : 0;

  const specRows: Array<{ label: string; value: string }> = [
    { label: 'Caliber & Movement', value: watch.specifications.caliber },
    { label: 'Case Dimensions', value: watch.specifications.caseDiameter },
    { label: 'Case Metallurgy', value: watch.specifications.caseMaterial },
    { label: 'Crystal Architecture', value: watch.specifications.crystal },
    { label: 'Water Resistance', value: watch.specifications.waterResistance },
    { label: 'Power Reserve', value: watch.specifications.powerReserve },
    { label: 'Lug Width', value: watch.specifications.lugWidth },
    { label: 'Manufacture Warranty', value: watch.specifications.warranty },
  ];

  return (
    <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
      {/* Breadcrumb Back Navigation */}
      <button
        type="button"
        onClick={() => navigate({ name: 'shop' })}
        className="inline-flex min-h-[40px] items-center gap-2 text-xs font-medium tracking-[0.14em] uppercase text-[#9CA3AF] hover:text-[#F2CA50] transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        <span>Back to Collection</span>
      </button>

      {/* Main Contiguous Purchase Module */}
      <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        {/* Sticky Left Gallery */}
        <div className="lg:col-span-7 lg:sticky lg:top-24 space-y-4">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-white/[0.08] bg-[#12141A]">
            <div
              onClick={() => setZoomed((z) => !z)}
              className="h-full w-full"
            >
              <WatchImage
                src={watch.image}
                alt={`${watch.name} — ${selectedVariant?.name ?? watch.subtitle}`}
                title={watch.name}
                eager
                className={`h-full w-full object-cover transition-transform duration-500 ease-out ${
                  zoomed ? 'scale-125 cursor-zoom-out' : 'hover:scale-105 cursor-zoom-in'
                }`}
              />
            </div>
            <button
              type="button"
              onClick={() => setZoomed((z) => !z)}
              aria-label={zoomed ? 'Reset loupe zoom' : 'Inspect watch detail'}
              className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 inline-flex min-h-[40px] items-center gap-2 rounded border border-white/15 bg-[#0B0C10]/80 backdrop-blur-md px-3.5 py-2 text-xs text-[#F4F0E8] hover:border-[#D4AF37] transition-colors cursor-pointer"
            >
              <ZoomIn className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
              <span>{zoomed ? 'Reset Zoom' : 'Loupe Zoom'}</span>
            </button>
          </div>

          {/* Dial & Strap Finish Preview Strip */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3">
            {watch.variants.map((variant) => {
              const active = variant.id === selectedVariant?.id;
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setSelectedVariantId(variant.id)}
                  className={`flex min-h-[56px] items-center gap-3 rounded border p-3 text-left transition-colors cursor-pointer ${
                    active
                      ? 'border-[#D4AF37] bg-[#D4AF37]/12'
                      : 'border-white/[0.08] bg-[#12141A] hover:border-white/25'
                  }`}
                >
                  <span
                    className="h-6 w-6 rounded-full border border-white/20 shrink-0"
                    style={{ backgroundColor: variant.swatchHex }}
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[#FDFBF7] truncate">{variant.dialColor}</p>
                    <p className="text-[11px] text-[#9CA3AF] truncate">{variant.strapMaterial}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sticky Right Purchase Module */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 glass-sapphire rounded-lg p-5 sm:p-8 space-y-5 sm:space-y-6">
          <div>
            {/* Unboxed Metadata */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium tracking-[0.14em] sm:tracking-[0.16em] uppercase text-[#9CA3AF]">
              <span>{watch.reference}</span>
              <span aria-hidden="true">·</span>
              <span>{watch.primaryCategory}</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#E5C158]">
                {watch.stockStatus} ({watch.stockCount} available)
              </span>
            </div>

            <h1 className="mt-3 font-serif text-2xl sm:text-4xl font-normal text-[#FDFBF7] [text-wrap:balance]">
              {watch.name}
            </h1>
            <p className="mt-1.5 text-sm text-[#D0C5AF]">{watch.subtitle}</p>
          </div>

          {/* Pricing */}
          <div className="flex flex-wrap items-baseline gap-3 border-y border-white/[0.08] py-4 tabular-nums">
            <span className="text-2xl sm:text-3xl font-medium text-[#FDFBF7]">
              {formatCurrency(effectivePrice)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-base text-[#9CA3AF] line-through">
                  {formatCurrency(watch.price)}
                </span>
                <span className="text-xs font-semibold tracking-[0.12em] uppercase text-[#E5C158]">
                  Save {savingsPct}%
                </span>
              </>
            )}
          </div>

          <p className="text-sm sm:text-base font-light leading-relaxed text-[#E3E2E8]">
            {watch.description}
          </p>
          <p className="text-xs italic text-[#D0C5AF]">{watch.storyNote}</p>

          {/* Variant Selector */}
          <div>
            <span className="block text-[10px] font-semibold tracking-[0.18em] uppercase text-[#9CA3AF] mb-2.5">
              Dial & Strap — {selectedVariant?.name}
            </span>
            <div className="flex flex-wrap gap-2">
              {watch.variants.map((variant) => {
                const active = variant.id === selectedVariant?.id;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`inline-flex min-h-[40px] items-center gap-2 rounded border px-3 py-2 text-xs text-left transition-colors cursor-pointer ${
                      active
                        ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#F2CA50]'
                        : 'border-white/12 bg-[#0E1015] text-[#D0C5AF] hover:border-white/30'
                    }`}
                  >
                    <span
                      className="h-3 w-3 rounded-full border border-white/25 shrink-0"
                      style={{ backgroundColor: variant.swatchHex }}
                      aria-hidden="true"
                    />
                    <span>{variant.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity & Primary CTAs */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col xs:flex-row sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <div className="inline-flex items-center justify-between rounded border border-white/15 bg-[#0E1015]">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="inline-flex h-11 w-11 items-center justify-center text-[#D0C5AF] hover:text-[#FDFBF7] cursor-pointer"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 text-sm font-medium tabular-nums text-[#FDFBF7]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  aria-label="Increase quantity"
                  className="inline-flex h-11 w-11 items-center justify-center text-[#D0C5AF] hover:text-[#FDFBF7] cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => addToCart(watch.id, selectedVariant?.id, quantity, true)}
                className="flex-1 min-h-[46px] inline-flex items-center justify-center gap-2 rounded bg-gradient-to-r from-[#D4AF37] to-[#C59F2E] px-6 py-3.5 text-xs font-semibold tracking-[0.16em] uppercase text-[#0B0C10] transition-all hover:brightness-110 gold-glow-hover cursor-pointer"
              >
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                <span>Add to Bag</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => toggleWishlist(watch.id)}
              className={`w-full min-h-[44px] inline-flex items-center justify-center gap-2 rounded border py-3 text-xs font-medium tracking-[0.14em] uppercase transition-colors cursor-pointer ${
                wishlisted
                  ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#F2CA50]'
                  : 'border-[#D4AF37]/35 bg-transparent text-[#F4F0E8] hover:border-[#D4AF37]'
              }`}
            >
              <Heart className={`h-4 w-4 ${wishlisted ? 'fill-current' : ''}`} aria-hidden="true" />
              <span>{wishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
            </button>
          </div>

          {/* Client Assurances */}
          <div className="border-t border-white/[0.08] pt-4 space-y-2 text-xs text-[#9CA3AF]">
            <p className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-[#D4AF37] shrink-0" aria-hidden="true" />
              <span>Complimentary insured air courier delivery worldwide</span>
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-[#D4AF37] shrink-0" aria-hidden="true" />
              <span>{watch.specifications.warranty} & Certificate of Origin</span>
            </p>
          </div>
        </div>
      </div>

      {/* Technical Horological Specifications */}
      <section className="mt-16 sm:mt-20 border-t border-white/[0.08] pt-12 sm:pt-14">
        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#D4AF37]">
          Caliber & Architecture
        </p>
        <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-normal text-[#FDFBF7]">
          Technical Specifications
        </h2>

        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {specRows.map((spec) => (
            <div
              key={spec.label}
              className="rounded border border-white/[0.08] bg-[#12141A] p-4 sm:p-5"
            >
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#9CA3AF]">
                {spec.label}
              </p>
              <p className="mt-2 text-sm font-medium text-[#FDFBF7] tabular-nums">
                {spec.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Timepieces */}
      {relatedWatches.length > 0 && (
        <section className="mt-16 sm:mt-20 border-t border-white/[0.08] pt-12 sm:pt-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#D4AF37]">
                Companion References
              </p>
              <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-normal text-[#FDFBF7]">
                Related Timepieces
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate({ name: 'shop' })}
              className="text-xs tracking-[0.14em] uppercase text-[#D4AF37] underline underline-offset-4 hover:text-[#FDFBF7] whitespace-nowrap cursor-pointer"
            >
              Explore All
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {relatedWatches.map((item) => (
              <ProductCard key={item.id} watch={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
