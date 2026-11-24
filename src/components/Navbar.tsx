import React, { useEffect, useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PageRoute } from '../types/watch';

interface NavLinkItem {
  label: string;
  route: PageRoute;
  match: PageRoute['name'];
}

export const Navbar: React.FC = () => {
  const { route, navigate, cartCount, wishlist, openCart } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
    };
  }, [mobileOpen]);

  const navItems: NavLinkItem[] = [
    { label: 'Home', route: { name: 'home' }, match: 'home' },
    { label: 'Shop', route: { name: 'shop' }, match: 'shop' },
    {
      label: wishlist.length > 0 ? `Wishlist (${wishlist.length})` : 'Wishlist',
      route: { name: 'wishlist' },
      match: 'wishlist',
    },
    { label: 'About', route: { name: 'about' }, match: 'about' },
    { label: 'Contact', route: { name: 'contact' }, match: 'contact' },
  ];

  const handleNav = (target: PageRoute) => {
    setMobileOpen(false);
    navigate(target);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-sapphire border-b border-white/[0.08]">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-2 sm:gap-4 md:gap-8 px-4 sm:px-6 lg:px-12">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNav({ name: 'home' });
          }}
          className="font-serif text-[15px] sm:text-lg lg:text-xl font-medium tracking-[0.1em] sm:tracking-[0.14em] text-[#FDFBF7] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]"
        >
          VALMONT GENÈVE
        </a>

        {/* Zone 2: 5 Concise Single-Line Navigation Links */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-6 lg:gap-8">
          {navItems.map((item) => {
            const isActive =
              route.name === item.match ||
              (item.match === 'shop' && route.name === 'product');
            return (
              <a
                key={item.match}
                href={`#${item.match}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(item.route);
                }}
                className={`relative py-1 text-sm font-normal tracking-wide whitespace-nowrap shrink-0 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] ${
                  isActive
                    ? 'text-[#F2CA50]'
                    : 'text-[#D0C5AF] hover:text-[#FDFBF7]'
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 right-0 -bottom-0.5 h-px bg-[#D4AF37] transition-transform duration-200 origin-center ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              openCart();
            }}
            className="inline-flex min-h-[40px] sm:min-h-[40px] items-center gap-1.5 sm:gap-2 rounded border border-[#D4AF37]/40 bg-[#181B22]/70 px-3 sm:px-4 py-2 text-[11px] sm:text-xs font-medium tracking-[0.1em] sm:tracking-[0.14em] uppercase text-[#FDFBF7] whitespace-nowrap shrink-0 transition-all duration-200 hover:border-[#D4AF37] hover:bg-[#D4AF37]/15 gold-glow-hover focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37] cursor-pointer"
            aria-label={`Open shopping bag with ${cartCount} items`}
          >
            <ShoppingBag className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
            <span className="tabular-nums">Bag ({cartCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded border border-white/10 text-[#F4F0E8] hover:border-[#D4AF37]/40 transition-colors cursor-pointer"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Navigation */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-[#12141A]/98 backdrop-blur-xl px-4 sm:px-6 py-3">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive =
                route.name === item.match ||
                (item.match === 'shop' && route.name === 'product');
              return (
                <a
                  key={item.match}
                  href={`#${item.match}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav(item.route);
                  }}
                  className={`flex min-h-[44px] items-center justify-between px-3 rounded text-sm tracking-wide transition-colors ${
                    isActive
                      ? 'text-[#F2CA50] bg-[#D4AF37]/10'
                      : 'text-[#E3E2E8] hover:text-[#F2CA50]'
                  }`}
                >
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};
