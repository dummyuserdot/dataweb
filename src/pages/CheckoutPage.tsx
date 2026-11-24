import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  ExternalLink,
  FileText,
  Hash,
  Loader2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  ShoppingBag,
  User,
} from 'lucide-react';
import { WatchImage } from '../components/WatchImage';
import {
  buildWhatsAppOrderMessage,
  buildWhatsAppOrderUrl,
  generateWatchOrderId,
} from '../config/whatsapp';
import { useStore } from '../context/StoreContext';
import { WATCH_CATALOG, formatCurrency, getEffectivePrice } from '../data/watches';
import { OrderReceipt } from '../types/watch';

interface CheckoutFormState {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  instructions: string;
}

const INITIAL_FORM: CheckoutFormState = {
  fullName: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  postalCode: '',
  instructions: '',
};

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'h-4 w-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M12.03 2C6.51 2 2.02 6.49 2.02 12c0 1.77.46 3.5 1.34 5.02L2 22l5.12-1.34A9.96 9.96 0 0 0 12.03 22c5.51 0 10-4.49 10-10S17.54 2 12.03 2Zm5.82 14.12c-.24.68-1.41 1.3-1.95 1.38-.5.08-1.13.11-1.82-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.8-4.18-4.95-4.38-.14-.19-1.18-1.57-1.18-3s.74-2.12 1.01-2.41c.26-.29.58-.36.77-.36.19 0 .38.01.55.01.18 0 .42-.07.66.5.24.58.82 2.01.89 2.15.07.15.12.32.02.51-.1.19-.14.31-.29.48-.14.17-.3.38-.43.51-.14.14-.29.3-.13.59.17.29.74 1.22 1.59 1.98 1.09.97 2.01 1.27 2.3 1.42.29.14.46.12.63-.07.17-.19.72-.84.91-1.13.19-.29.38-.24.65-.14.26.1 1.68.79 1.97.94.29.14.48.22.55.34.07.12.07.7-.17 1.38Z" />
  </svg>
);

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartCount,
    cartSubtotal,
    promoCode,
    promoDiscount,
    cartTotal,
    recordOrder,
    navigate,
  } = useStore();

  const [form, setForm] = useState<CheckoutFormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormState, string>>>({});
  const [orderId] = useState<string>(() => generateWatchOrderId());
  const [orderDateTime] = useState<string>(() =>
    new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [handoffState, setHandoffState] = useState<{
    whatsappUrl: string;
    messagePreview: string;
    receipt: OrderReceipt;
    returnedFromWhatsApp: boolean;
  } | null>(null);
  const [orderFinalized, setOrderFinalized] = useState(false);

  const detailedItems = useMemo(() => {
    return cart
      .map((item) => {
        const watch = WATCH_CATALOG.find((w) => w.id === item.watchId);
        if (!watch) return null;
        const variant = watch.variants.find((v) => v.id === item.variantId) ?? watch.variants[0];
        const unitPrice = getEffectivePrice(watch);
        return {
          watch,
          variantName: variant?.name ?? 'Standard Finish',
          quantity: item.quantity,
          unitPrice,
          subtotal: unitPrice * item.quantity,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, [cart]);

  useEffect(() => {
    if (!handoffState || orderFinalized) return;
    const handleFocus = () => {
      setHandoffState((prev) => (prev ? { ...prev, returnedFromWhatsApp: true } : prev));
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [handoffState, orderFinalized]);

  const validateForm = (): boolean => {
    const nextErrors: Partial<Record<keyof CheckoutFormState, string>> = {};
    if (form.fullName.trim().length < 2) {
      nextErrors.fullName = 'Full name is required.';
    }
    const cleanPhone = form.phone.replace(/[\s\-().]/g, '');
    if (cleanPhone.length < 7 || !/^\+?\d{7,16}$/.test(cleanPhone)) {
      nextErrors.phone = 'Please enter a valid WhatsApp or phone number.';
    }
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address or leave blank.';
    }
    if (form.address.trim().length < 5) {
      nextErrors.address = 'Please enter your complete delivery address.';
    }
    if (form.city.trim().length < 2) {
      nextErrors.city = 'City is required.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const openWhatsAppTab = (url: string) => {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const handleConfirmWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (detailedItems.length === 0 || isProcessing) return;
    if (!validateForm()) return;

    setIsProcessing(true);

    const payload = {
      orderId,
      orderDateTime,
      customer: {
        fullName: form.fullName,
        phone: form.phone,
        email: form.email,
        address: form.address,
        city: form.city,
        postalCode: form.postalCode,
        instructions: form.instructions,
      },
      items: detailedItems.map((entry) => ({
        name: entry.watch.name,
        variantName: entry.variantName,
        unitPrice: entry.unitPrice,
        quantity: entry.quantity,
        subtotal: entry.subtotal,
      })),
      totalItems: cartCount,
      subtotal: cartSubtotal,
      promoCode,
      promoDiscount,
      grandTotal: cartTotal,
    };

    const messagePreview = buildWhatsAppOrderMessage(payload);
    const whatsappUrl = buildWhatsAppOrderUrl(payload);

    const receipt: OrderReceipt = {
      orderNumber: orderId.replace('#', ''),
      date: orderDateTime,
      customerName: form.fullName.trim(),
      customerPhone: form.phone.trim(),
      customerEmail: form.email.trim() || 'Not provided',
      shippingAddress: `${form.address.trim()}, ${form.city.trim()}${
        form.postalCode.trim() ? ` ${form.postalCode.trim()}` : ''
      }`,
      postalCode: form.postalCode.trim() || undefined,
      instructions: form.instructions.trim() || undefined,
      paymentMethod: 'WhatsApp Concierge Order',
      totalItems: cartCount,
      items: detailedItems.map((entry) => ({
        name: entry.watch.name,
        variantName: entry.variantName,
        quantity: entry.quantity,
        unitPrice: entry.unitPrice,
      })),
      subtotal: cartSubtotal,
      discount: promoDiscount,
      total: cartTotal,
      whatsappUrl,
    };

    window.setTimeout(() => {
      setIsProcessing(false);
      setHandoffState({
        whatsappUrl,
        messagePreview,
        receipt,
        returnedFromWhatsApp: false,
      });
      openWhatsAppTab(whatsappUrl);
    }, 350);
  };

  const handleFinalizeAndClearCart = () => {
    if (!handoffState) return;
    recordOrder(handoffState.receipt);
    setOrderFinalized(true);
    setForm(INITIAL_FORM);
    setErrors({});
  };

  if (orderFinalized && handoffState) {
    return (
      <section className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 py-12 sm:py-16 min-h-[70vh]">
        <div className="mx-auto max-w-2xl glass-sapphire rounded-lg border border-[#D4AF37]/30 p-6 sm:p-12 text-center space-y-6">
          <CheckCircle2 className="h-12 w-12 text-[#D4AF37] mx-auto" />
          <div>
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#E5C158]">
              Order {orderId} Recorded
            </p>
            <h1 className="mt-2 font-serif text-3xl sm:text-4xl text-[#FDFBF7]">
              Thank You for Your Order
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#D0C5AF]">
              Your shopping bag has been cleared and your WhatsApp order dossier has been saved. Our
              horological concierge will confirm delivery dispatch directly in your WhatsApp chat.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-2">
            <button
              type="button"
              onClick={() => navigate({ name: 'shop' })}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded bg-gradient-to-r from-[#D4AF37] to-[#C59F2E] px-7 py-3.5 text-xs font-semibold tracking-[0.15em] uppercase text-[#0B0C10] cursor-pointer"
            >
              <span>Continue Exploring Watches</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => navigate({ name: 'home' })}
              className="min-h-[44px] rounded border border-white/15 px-6 py-3.5 text-xs font-medium tracking-[0.14em] uppercase text-[#F4F0E8] hover:border-[#D4AF37] transition-colors cursor-pointer"
            >
              Return Home
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (detailedItems.length === 0 && !handoffState) {
    return (
      <section className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 py-16 sm:py-20 min-h-[70vh]">
        <div className="mx-auto max-w-lg rounded-lg border border-white/[0.08] bg-[#12141A] p-8 sm:p-12 text-center space-y-5">
          <ShoppingBag className="h-9 w-9 text-[#D4AF37]/70 mx-auto" aria-hidden="true" />
          <h1 className="font-serif text-2xl sm:text-3xl text-[#FDFBF7]">
            Your Shopping Bag is Empty
          </h1>
          <p className="text-sm text-[#9CA3AF]">
            Add a timepiece to your bag before proceeding to WhatsApp checkout.
          </p>
          <button
            type="button"
            onClick={() => navigate({ name: 'shop' })}
            className="inline-flex min-h-[44px] items-center gap-2 rounded bg-gradient-to-r from-[#D4AF37] to-[#C59F2E] px-6 py-3 text-xs font-semibold tracking-[0.14em] uppercase text-[#0B0C10] cursor-pointer"
          >
            <span>Browse Watches</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
      <button
        type="button"
        onClick={() => navigate({ name: 'shop' })}
        className="inline-flex min-h-[40px] items-center gap-2 text-xs font-medium tracking-[0.14em] uppercase text-[#9CA3AF] hover:text-[#F2CA50] transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        <span>Back to Collection</span>
      </button>

      <div className="mt-4 border-b border-white/[0.08] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#D4AF37]">
            Private Concierge Acquisition
          </p>
          <h1 className="mt-2 font-serif text-2xl sm:text-4xl font-normal text-[#FDFBF7]">
            WhatsApp Order Checkout
          </h1>
        </div>
        <div className="text-xs text-[#9CA3AF] tabular-nums">
          <span>Reference: </span>
          <span className="font-medium text-[#F2CA50]">{orderId}</span>
          <span className="mx-2" aria-hidden="true">·</span>
          <span>{orderDateTime}</span>
        </div>
      </div>

      {/* Responsive Grid: Order Summary visible on top on mobile or right on desktop? Form first or Summary first? Keeping Summary collapsible/concise or standard flow: Order Summary right on desktop, cleanly below on mobile */}
      <div className="mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: Customer Form or WhatsApp Handoff Confirmation */}
        <div className="lg:col-span-7">
          {handoffState ? (
            <div className="glass-sapphire rounded-lg border border-[#D4AF37]/30 p-5 sm:p-8 space-y-6">
              <div className="flex items-start gap-3.5">
                <CheckCircle2 className="h-6 w-6 text-[#25D366] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#25D366]">
                    WhatsApp Order Ready · {orderId}
                  </p>
                  <h2 className="mt-1 font-serif text-xl sm:text-2xl text-[#FDFBF7]">
                    {handoffState.returnedFromWhatsApp
                      ? 'Welcome Back — Finalize Your Order'
                      : 'Complete Sending in WhatsApp'}
                  </h2>
                  <p className="mt-2 text-sm text-[#D0C5AF]">
                    {handoffState.returnedFromWhatsApp
                      ? 'Once you have tapped Send inside WhatsApp, click the button below to clear your bag and save your receipt.'
                      : 'WhatsApp has been opened in a new tab with your complete order details pre-filled. Tap Send in WhatsApp, then return here to clear your bag.'}
                  </p>
                </div>
              </div>

              <div className="rounded border border-white/[0.08] bg-[#0B0C10] p-4 overflow-hidden">
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#9CA3AF] mb-2">
                  Formatted WhatsApp Message Preview
                </p>
                <pre className="whitespace-pre-wrap break-words font-sans text-xs leading-relaxed text-[#E3E2E8] max-h-64 overflow-y-auto">
                  {handoffState.messagePreview}
                </pre>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={handoffState.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-h-[46px] inline-flex items-center justify-center gap-2.5 rounded bg-[#25D366] hover:bg-[#1FB857] px-5 py-3.5 text-xs font-semibold tracking-[0.12em] uppercase text-[#06210F] transition-colors text-center"
                >
                  <WhatsAppIcon className="h-4 w-4 shrink-0" />
                  <span>Open WhatsApp Chat</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                </a>

                <button
                  type="button"
                  onClick={handleFinalizeAndClearCart}
                  className="flex-1 min-h-[46px] inline-flex items-center justify-center gap-2 rounded bg-gradient-to-r from-[#D4AF37] to-[#C59F2E] px-5 py-3.5 text-xs font-semibold tracking-[0.12em] uppercase text-[#0B0C10] hover:brightness-110 transition-all cursor-pointer text-center"
                >
                  <span>I Sent the Order — Clear Bag</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setHandoffState(null)}
                className="min-h-[36px] text-xs text-[#9CA3AF] hover:text-[#F2CA50] underline cursor-pointer"
              >
                Edit Customer Information (Keep Items in Bag)
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleConfirmWhatsAppOrder}
              noValidate
              className="glass-sapphire rounded-lg p-5 sm:p-8 space-y-5 sm:space-y-6"
            >
              <div>
                <h2 className="font-serif text-xl sm:text-2xl text-[#FDFBF7]">
                  Customer & Delivery Details
                </h2>
                <p className="mt-1 text-sm text-[#9CA3AF]">
                  Required fields are marked with *. Your cart items and totals are automatically
                  attached.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="checkout-name"
                    className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-[#9CA3AF] mb-1.5"
                  >
                    Full Name *
                  </label>
                  <div className="relative">
                    <User
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#D4AF37]/80"
                      aria-hidden="true"
                    />
                    <input
                      id="checkout-name"
                      type="text"
                      value={form.fullName}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, fullName: e.target.value }));
                        if (errors.fullName) setErrors((er) => ({ ...er, fullName: undefined }));
                      }}
                      placeholder="Ahmed Ali"
                      className="w-full min-h-[44px] rounded border border-white/12 bg-[#0E1015] pl-10 pr-4 py-3 text-base sm:text-sm text-[#FDFBF7] placeholder:text-[#9CA3AF]/50 focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-1.5 text-xs text-[#FFB4AB]">{errors.fullName}</p>
                  )}
                </div>

                {/* WhatsApp / Phone Number */}
                <div>
                  <label
                    htmlFor="checkout-phone"
                    className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-[#9CA3AF] mb-1.5"
                  >
                    WhatsApp / Phone Number *
                  </label>
                  <div className="relative">
                    <Phone
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#D4AF37]/80"
                      aria-hidden="true"
                    />
                    <input
                      id="checkout-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, phone: e.target.value }));
                        if (errors.phone) setErrors((er) => ({ ...er, phone: undefined }));
                      }}
                      placeholder="+92 300 1234567"
                      className="w-full min-h-[44px] rounded border border-white/12 bg-[#0E1015] pl-10 pr-4 py-3 text-base sm:text-sm text-[#FDFBF7] placeholder:text-[#9CA3AF]/50 focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1.5 text-xs text-[#FFB4AB]">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Email Address (optional) */}
              <div>
                <label
                  htmlFor="checkout-email"
                  className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-[#9CA3AF] mb-1.5"
                >
                  Email Address (Optional)
                </label>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#D4AF37]/80"
                    aria-hidden="true"
                  />
                  <input
                    id="checkout-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, email: e.target.value }));
                      if (errors.email) setErrors((er) => ({ ...er, email: undefined }));
                    }}
                    placeholder="client@domain.com"
                    className="w-full min-h-[44px] rounded border border-white/12 bg-[#0E1015] pl-10 pr-4 py-3 text-base sm:text-sm text-[#FDFBF7] placeholder:text-[#9CA3AF]/50 focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                {errors.email && <p className="mt-1.5 text-xs text-[#FFB4AB]">{errors.email}</p>}
              </div>

              {/* Complete Delivery Address */}
              <div>
                <label
                  htmlFor="checkout-address"
                  className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-[#9CA3AF] mb-1.5"
                >
                  Complete Delivery Address *
                </label>
                <div className="relative">
                  <MapPin
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#D4AF37]/80"
                    aria-hidden="true"
                  />
                  <input
                    id="checkout-address"
                    type="text"
                    value={form.address}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, address: e.target.value }));
                      if (errors.address) setErrors((er) => ({ ...er, address: undefined }));
                    }}
                    placeholder="House 123, Main Boulevard, Block B"
                    className="w-full min-h-[44px] rounded border border-white/12 bg-[#0E1015] pl-10 pr-4 py-3 text-base sm:text-sm text-[#FDFBF7] placeholder:text-[#9CA3AF]/50 focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                {errors.address && (
                  <p className="mt-1.5 text-xs text-[#FFB4AB]">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {/* City */}
                <div>
                  <label
                    htmlFor="checkout-city"
                    className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-[#9CA3AF] mb-1.5"
                  >
                    City *
                  </label>
                  <div className="relative">
                    <Building2
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#D4AF37]/80"
                      aria-hidden="true"
                    />
                    <input
                      id="checkout-city"
                      type="text"
                      value={form.city}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, city: e.target.value }));
                        if (errors.city) setErrors((er) => ({ ...er, city: undefined }));
                      }}
                      placeholder="Geneva / Karachi / Dubai"
                      className="w-full min-h-[44px] rounded border border-white/12 bg-[#0E1015] pl-10 pr-4 py-3 text-base sm:text-sm text-[#FDFBF7] placeholder:text-[#9CA3AF]/50 focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                  {errors.city && <p className="mt-1.5 text-xs text-[#FFB4AB]">{errors.city}</p>}
                </div>

                {/* Postal Code (optional) */}
                <div>
                  <label
                    htmlFor="checkout-postal"
                    className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-[#9CA3AF] mb-1.5"
                  >
                    Postal Code (Optional)
                  </label>
                  <div className="relative">
                    <Hash
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#D4AF37]/80"
                      aria-hidden="true"
                    />
                    <input
                      id="checkout-postal"
                      type="text"
                      value={form.postalCode}
                      onChange={(e) => setForm((f) => ({ ...f, postalCode: e.target.value }))}
                      placeholder="75500"
                      className="w-full min-h-[44px] rounded border border-white/12 bg-[#0E1015] pl-10 pr-4 py-3 text-base sm:text-sm text-[#FDFBF7] placeholder:text-[#9CA3AF]/50 focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Order Instructions (optional) */}
              <div>
                <label
                  htmlFor="checkout-instructions"
                  className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-[#9CA3AF] mb-1.5"
                >
                  Additional Order Instructions (Optional)
                </label>
                <div className="relative">
                  <FileText
                    className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-[#D4AF37]/80"
                    aria-hidden="true"
                  />
                  <textarea
                    id="checkout-instructions"
                    rows={3}
                    value={form.instructions}
                    onChange={(e) => setForm((f) => ({ ...f, instructions: e.target.value }))}
                    placeholder="Preferred evening delivery, complimentary engraving initials, or wrist sizing..."
                    className="w-full rounded border border-white/12 bg-[#0E1015] pl-10 pr-4 py-3 text-base sm:text-sm text-[#FDFBF7] placeholder:text-[#9CA3AF]/50 focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              {/* WhatsApp Submit Button */}
              <div className="pt-2 space-y-3">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full min-h-[48px] inline-flex items-center justify-center gap-2.5 rounded bg-[#25D366] hover:bg-[#1FB857] disabled:opacity-70 px-5 sm:px-6 py-4 text-xs sm:text-sm font-semibold tracking-[0.12em] sm:tracking-[0.14em] uppercase text-[#06210F] transition-all shadow-lg cursor-pointer text-center"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
                      <span>Preparing WhatsApp Order...</span>
                    </>
                  ) : (
                    <>
                      <WhatsAppIcon className="h-5 w-5 shrink-0" />
                      <span>Confirm Order on WhatsApp</span>
                    </>
                  )}
                </button>

                <p className="flex items-start sm:items-center justify-center gap-1.5 text-xs text-[#9CA3AF] text-center">
                  <ShieldCheck className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
                  <span>
                    Opens WhatsApp in a new tab with your pre-filled order. Bag remains saved until
                    confirmed.
                  </span>
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Automatic Cart Order Summary */}
        <aside className="lg:col-span-5 lg:sticky lg:top-24 rounded-lg border border-[#D4AF37]/25 bg-[#12141A] p-5 sm:p-8 space-y-6">
          <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
            <div>
              <h2 className="font-serif text-xl text-[#FDFBF7]">Order Summary</h2>
              <p className="mt-0.5 text-xs text-[#9CA3AF] tabular-nums">
                {orderId} · {cartCount} {cartCount === 1 ? 'Item' : 'Items'}
              </p>
            </div>
            <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#E5C158] whitespace-nowrap">
              Live Cart Sync
            </span>
          </div>

          <ul className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
            {detailedItems.map((entry) => (
              <li
                key={`${entry.watch.id}-${entry.variantName}`}
                className="flex gap-3.5 sm:gap-4 border-b border-white/[0.06] pb-4 last:border-b-0 last:pb-0"
              >
                <div className="h-20 w-24 shrink-0 overflow-hidden rounded border border-white/10 bg-[#0D0E12]">
                  <WatchImage
                    src={entry.watch.image}
                    alt={entry.watch.name}
                    title={entry.watch.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-sm font-medium text-[#FDFBF7] truncate">
                    {entry.watch.name}
                  </p>
                  <p className="mt-0.5 text-xs text-[#9CA3AF] truncate">{entry.variantName}</p>
                  <div className="mt-2 flex items-center justify-between gap-2 text-xs tabular-nums">
                    <span className="text-[#D0C5AF]">
                      {formatCurrency(entry.unitPrice)} × {entry.quantity}
                    </span>
                    <span className="font-medium text-[#FDFBF7]">
                      {formatCurrency(entry.subtotal)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t border-white/[0.08] pt-5 space-y-2.5 text-sm">
            <div className="flex justify-between text-[#9CA3AF]">
              <span>Total Items</span>
              <span className="tabular-nums text-[#E3E2E8]">{cartCount}</span>
            </div>
            <div className="flex justify-between text-[#9CA3AF]">
              <span>Subtotal</span>
              <span className="tabular-nums text-[#E3E2E8]">{formatCurrency(cartSubtotal)}</span>
            </div>
            {promoDiscount > 0 && (
              <div className="flex justify-between text-[#E5C158]">
                <span>Collector Privilege ({promoCode})</span>
                <span className="tabular-nums">-{formatCurrency(promoDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#9CA3AF]">
              <span>Insured Delivery</span>
              <span className="text-[#E3E2E8]">Complimentary</span>
            </div>
            <div className="border-t border-white/[0.08] pt-3 flex justify-between items-baseline">
              <span className="text-base font-medium text-[#FDFBF7]">Grand Total</span>
              <span className="text-xl font-semibold tabular-nums text-[#F2CA50]">
                {formatCurrency(cartTotal)}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};
