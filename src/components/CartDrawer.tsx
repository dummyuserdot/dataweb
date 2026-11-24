import React, { useEffect, useState } from 'react';
import { ArrowRight, Minus, Plus, ShieldCheck, Trash2, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { WATCH_CATALOG, formatCurrency, getEffectivePrice } from '../data/watches';
import { WatchImage } from './WatchImage';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartCount,
    cartSubtotal,
    promoDiscount,
    cartTotal,
    isCartOpen,
    closeCart,
    updateCartQuantity,
    removeFromCart,
    promoCode,
    applyPromoCode,
    removePromoCode,
    navigate,
  } = useStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    if (!isCartOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    setPromoFeedback({ ok: res.ok, text: res.message });
    if (res.ok) setPromoInput('');
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) return;
    closeCart();
    navigate({ name: 'checkout' });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer Panel */}
      <div className="relative z-10 flex h-full w-full max-w-lg flex-col glass-dock shadow-2xl">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] px-4 sm:px-6 py-4 sm:py-5">
          <div>
            <h2 className="font-serif text-lg sm:text-xl font-medium text-[#FDFBF7]">
              Your Acquisition Bag ({cartCount})
            </h2>
            <p className="mt-0.5 text-[11px] sm:text-xs tracking-[0.14em] uppercase text-[#9CA3AF]">
              Complimentary Insured Courier
            </p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="inline-flex h-11 w-11 items-center justify-center rounded border border-white/10 text-[#D0C5AF] hover:border-[#D4AF37]/50 hover:text-[#FDFBF7] transition-colors cursor-pointer"
            aria-label="Close bag"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 sm:py-6">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center py-12">
              <p className="font-serif text-2xl text-[#FDFBF7]">Your bag is empty</p>
              <p className="mt-2 max-w-xs text-sm text-[#9CA3AF]">
                Explore our Geneva collection of mechanical, sport, and connected timepieces.
              </p>
              <button
                type="button"
                onClick={() => {
                  closeCart();
                  navigate({ name: 'shop' });
                }}
                className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded bg-gradient-to-r from-[#D4AF37] to-[#C59F2E] px-6 py-3 text-xs font-semibold tracking-[0.14em] uppercase text-[#0B0C10] cursor-pointer"
              >
                <span>Explore Collection</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <ul className="space-y-5">
              {cart.map((item) => {
                const watch = WATCH_CATALOG.find((w) => w.id === item.watchId);
                if (!watch) return null;
                const variant =
                  watch.variants.find((v) => v.id === item.variantId) ?? watch.variants[0];
                const unitPrice = getEffectivePrice(watch);

                return (
                  <li
                    key={`${item.watchId}-${item.variantId}`}
                    className="flex gap-3 sm:gap-4 border-b border-white/[0.07] pb-5"
                  >
                    <div className="h-20 w-24 sm:h-24 sm:w-28 shrink-0 overflow-hidden rounded border border-white/10 bg-[#0D0E12]">
                      <WatchImage
                        src={watch.image}
                        alt={watch.name}
                        title={watch.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={() => {
                              closeCart();
                              navigate({ name: 'product', slug: watch.slug });
                            }}
                            className="font-serif text-sm sm:text-base font-medium text-[#FDFBF7] hover:text-[#F2CA50] text-left truncate block max-w-full cursor-pointer"
                          >
                            {watch.name}
                          </button>
                          <p className="mt-0.5 text-xs text-[#9CA3AF] truncate">
                            {variant?.name}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.watchId, item.variantId)}
                          aria-label={`Remove ${watch.name}`}
                          className="inline-flex h-9 w-9 shrink-0 items-center justify-center text-[#9CA3AF] hover:text-[#FFB4AB] transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-2">
                        <div className="inline-flex items-center rounded border border-white/15 bg-[#0E1015]">
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(item.watchId, item.variantId, item.quantity - 1)
                            }
                            aria-label="Decrease quantity"
                            className="inline-flex h-9 w-9 items-center justify-center text-[#D0C5AF] hover:text-[#FDFBF7] cursor-pointer"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-medium tabular-nums text-[#FDFBF7]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(item.watchId, item.variantId, item.quantity + 1)
                            }
                            aria-label="Increase quantity"
                            className="inline-flex h-9 w-9 items-center justify-center text-[#D0C5AF] hover:text-[#FDFBF7] cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <span className="text-sm font-medium tabular-nums text-[#FDFBF7]">
                          {formatCurrency(unitPrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Cart Footer with Totals & Checkout CTA */}
        {cart.length > 0 && (
          <div className="border-t border-white/[0.08] bg-[#12141A]/95 px-4 sm:px-6 py-4 sm:py-5 space-y-4">
            {!promoCode ? (
              <form onSubmit={handlePromoSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Promo code (VALMONT10)"
                  className="flex-1 min-w-0 rounded border border-white/12 bg-[#0E1015] px-3 py-2.5 text-base sm:text-xs text-[#FDFBF7] placeholder:text-[#9CA3AF]/60 focus:border-[#D4AF37] focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded border border-[#D4AF37]/40 px-4 py-2.5 text-xs font-medium tracking-[0.12em] uppercase text-[#F4F0E8] hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors shrink-0 cursor-pointer"
                >
                  Apply
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-between text-xs text-[#E5C158]">
                <span>Privilege Code Applied: {promoCode} (-10%)</span>
                <button
                  type="button"
                  onClick={() => {
                    removePromoCode();
                    setPromoFeedback(null);
                  }}
                  className="underline hover:text-[#FDFBF7] cursor-pointer"
                >
                  Remove
                </button>
              </div>
            )}

            {promoFeedback && (
              <p className={`text-xs ${promoFeedback.ok ? 'text-[#E5C158]' : 'text-[#FFB4AB]'}`}>
                {promoFeedback.text}
              </p>
            )}

            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-[#9CA3AF]">
                <span>Subtotal</span>
                <span className="tabular-nums text-[#E3E2E8]">{formatCurrency(cartSubtotal)}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-[#E5C158]">
                  <span>Collector Privilege (10%)</span>
                  <span className="tabular-nums">-{formatCurrency(promoDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#9CA3AF]">
                <span>Insured Geneva Courier</span>
                <span className="text-[#E3E2E8]">Complimentary</span>
              </div>
              <div className="flex justify-between border-t border-white/[0.08] pt-3 text-base font-medium text-[#FDFBF7]">
                <span>Estimated Total</span>
                <span className="tabular-nums text-[#F2CA50]">{formatCurrency(cartTotal)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleProceedToCheckout}
              className="w-full min-h-[46px] inline-flex items-center justify-center gap-2 rounded bg-gradient-to-r from-[#D4AF37] to-[#C59F2E] py-3.5 text-xs font-semibold tracking-[0.16em] uppercase text-[#0B0C10] transition-all duration-200 hover:brightness-110 gold-glow-hover cursor-pointer"
            >
              <span>Checkout</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#9CA3AF]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
              <span>Instant WhatsApp Concierge Checkout · COSC Certified</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
