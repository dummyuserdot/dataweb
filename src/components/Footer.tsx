import React from 'react';
import { useStore } from '../context/StoreContext';
import { WATCH_CATEGORIES } from '../data/watches';

export const Footer: React.FC = () => {
  const { navigate } = useStore();

  return (
    <footer className="border-t border-white/[0.08] bg-[#0D0E12] text-[#9CA3AF]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Maison Column */}
          <div>
            <p className="font-serif text-lg tracking-[0.14em] text-[#FDFBF7]">
              VALMONT GENÈVE
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[#9CA3AF]">
              Independent Swiss horology dedicated to mechanical sovereignty, precious metallurgy,
              and enduring elegance since 1924.
            </p>
          </div>

          {/* Timepiece Collections */}
          <div>
            <h3 className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#F4F0E8]">
              Collections
            </h3>
            <ul className="mt-4 space-y-1 text-sm">
              {WATCH_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                <li key={cat}>
                  <button
                    type="button"
                    onClick={() => navigate({ name: 'shop' }, { category: cat })}
                    className="inline-flex min-h-[36px] items-center hover:text-[#F2CA50] transition-colors cursor-pointer"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Maison Links */}
          <div>
            <h3 className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#F4F0E8]">
              Maison & Client Care
            </h3>
            <ul className="mt-4 space-y-1 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ name: 'shop' })}
                  className="inline-flex min-h-[36px] items-center hover:text-[#F2CA50] transition-colors cursor-pointer"
                >
                  All Timepieces
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ name: 'wishlist' })}
                  className="inline-flex min-h-[36px] items-center hover:text-[#F2CA50] transition-colors cursor-pointer"
                >
                  Saved Wishlist
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ name: 'about' })}
                  className="inline-flex min-h-[36px] items-center hover:text-[#F2CA50] transition-colors cursor-pointer"
                >
                  Our Geneva Heritage
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate({ name: 'contact' })}
                  className="inline-flex min-h-[36px] items-center hover:text-[#F2CA50] transition-colors cursor-pointer"
                >
                  Private Concierge
                </button>
              </li>
            </ul>
          </div>

          {/* Geneva Salon */}
          <div>
            <h3 className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#F4F0E8]">
              Geneva Flagship Salon
            </h3>
            <div className="mt-4 space-y-2 text-sm">
              <p>Rue du Rhône 42, 1204 Genève, Switzerland</p>
              <p>
                <a href="mailto:concierge@valmont-geneve.ch" className="hover:text-[#F2CA50] transition-colors">
                  concierge@valmont-geneve.ch
                </a>
              </p>
              <p className="tabular-nums">
                <a href="tel:+41225550194" className="hover:text-[#F2CA50] transition-colors">
                  +41 22 555 0194
                </a>
              </p>
              <p className="pt-2 text-xs text-[#9CA3AF]/80">
                Monday – Saturday · 10:00 – 19:00 CET
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs text-[#9CA3AF]/80">
          <p>© {new Date().getFullYear()} Valmont Genève SA. All rights reserved.</p>
          <p>COSC Certified Chronometers · 5-Year International Warranty</p>
        </div>
      </div>
    </footer>
  );
};
