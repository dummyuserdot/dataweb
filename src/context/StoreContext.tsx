import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { WATCH_CATALOG, getEffectivePrice } from '../data/watches';
import {
  CartItem,
  OrderReceipt,
  PageRoute,
  PriceRangeFilter,
  SortOption,
  UserPreferences,
  WatchCategory,
} from '../types/watch';

const STORAGE_KEYS = {
  CART: 'valmont_cart_v1',
  WISHLIST: 'valmont_wishlist_v1',
  PREFS: 'valmont_prefs_v1',
  ORDERS: 'valmont_orders_v1',
} as const;

const DEFAULT_PREFS: UserPreferences = {
  lastCategory: 'All',
  lastSort: 'popular',
  promoCodeApplied: null,
};

function parseHashRoute(): PageRoute {
  const raw = window.location.hash.replace(/^#\/?/, '').trim();
  if (!raw || raw === 'home') return { name: 'home' };
  if (raw === 'shop') return { name: 'shop' };
  if (raw === 'wishlist') return { name: 'wishlist' };
  if (raw === 'about') return { name: 'about' };
  if (raw === 'contact') return { name: 'contact' };
  if (raw === 'checkout') return { name: 'checkout' };
  if (raw.startsWith('watch/')) {
    const slug = raw.slice('watch/'.length);
    if (slug) return { name: 'product', slug };
  }
  return { name: 'home' };
}

function serializeRoute(route: PageRoute): string {
  switch (route.name) {
    case 'home':
      return '#home';
    case 'shop':
      return '#shop';
    case 'wishlist':
      return '#wishlist';
    case 'about':
      return '#about';
    case 'contact':
      return '#contact';
    case 'checkout':
      return '#checkout';
    case 'product':
      return `#watch/${route.slug}`;
  }
}

function readLocalStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function sanitizeCart(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  const validIds = new Set(WATCH_CATALOG.map((w) => w.id));
  return raw.filter(
    (item): item is CartItem =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as CartItem).watchId === 'string' &&
      validIds.has((item as CartItem).watchId) &&
      typeof (item as CartItem).variantId === 'string' &&
      typeof (item as CartItem).quantity === 'number' &&
      (item as CartItem).quantity > 0,
  );
}

function sanitizeWishlist(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const validIds = new Set(WATCH_CATALOG.map((w) => w.id));
  return Array.from(
    new Set(raw.filter((id): id is string => typeof id === 'string' && validIds.has(id))),
  );
}

interface StoreContextValue {
  route: PageRoute;
  navigate: (next: PageRoute, options?: { category?: WatchCategory | 'All' }) => void;
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  promoDiscount: number;
  cartTotal: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (watchId: string, variantId?: string, quantity?: number, openDrawer?: boolean) => void;
  updateCartQuantity: (watchId: string, variantId: string, quantity: number) => void;
  removeFromCart: (watchId: string, variantId: string) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (watchId: string) => void;
  isWishlisted: (watchId: string) => boolean;
  selectedCategory: WatchCategory | 'All';
  setSelectedCategory: (category: WatchCategory | 'All') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  priceRange: PriceRangeFilter;
  setPriceRange: (range: PriceRangeFilter) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  promoCode: string | null;
  applyPromoCode: (code: string) => { ok: boolean; message: string };
  removePromoCode: () => void;
  recentOrders: OrderReceipt[];
  recordOrder: (receipt: OrderReceipt) => void;
  notification: string | null;
  dismissNotification: () => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [route, setRoute] = useState<PageRoute>(() => parseHashRoute());
  const [cart, setCart] = useState<CartItem[]>(() =>
    sanitizeCart(readLocalStorage(STORAGE_KEYS.CART, [])),
  );
  const [wishlist, setWishlist] = useState<string[]>(() =>
    sanitizeWishlist(readLocalStorage(STORAGE_KEYS.WISHLIST, [])),
  );
  const [prefs, setPrefs] = useState<UserPreferences>(() => ({
    ...DEFAULT_PREFS,
    ...readLocalStorage<Partial<UserPreferences>>(STORAGE_KEYS.PREFS, DEFAULT_PREFS),
  }));
  const [recentOrders, setRecentOrders] = useState<OrderReceipt[]>(() =>
    readLocalStorage(STORAGE_KEYS.ORDERS, []),
  );

  const [selectedCategory, setSelectedCategoryState] = useState<WatchCategory | 'All'>(
    prefs.lastCategory,
  );
  const [sortBy, setSortByState] = useState<SortOption>(prefs.lastSort);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<PriceRangeFilter>('all');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotice = useCallback((message: string) => {
    setNotification(message);
  }, []);

  const dismissNotification = useCallback(() => {
    setNotification(null);
  }, []);

  useEffect(() => {
    if (!notification) return;
    const timer = window.setTimeout(() => setNotification(null), 3200);
    return () => window.clearTimeout(timer);
  }, [notification]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch {
      // Ignore storage quota errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    } catch {
      // Ignore storage quota errors
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.PREFS, JSON.stringify(prefs));
    } catch {
      // Ignore storage quota errors
    }
  }, [prefs]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(recentOrders));
    } catch {
      // Ignore storage quota errors
    }
  }, [recentOrders]);

  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseHashRoute());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const setSelectedCategory = useCallback((category: WatchCategory | 'All') => {
    setSelectedCategoryState(category);
    setPrefs((prev) => ({ ...prev, lastCategory: category }));
  }, []);

  const setSortBy = useCallback((sort: SortOption) => {
    setSortByState(sort);
    setPrefs((prev) => ({ ...prev, lastSort: sort }));
  }, []);

  const navigate = useCallback(
    (next: PageRoute, options?: { category?: WatchCategory | 'All' }) => {
      if (options?.category) {
        setSelectedCategory(options.category);
      }
      const nextHash = serializeRoute(next);
      if (window.location.hash !== nextHash) {
        window.location.hash = nextHash;
      } else {
        setRoute(next);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [setSelectedCategory],
  );

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const addToCart = useCallback(
    (watchId: string, variantId?: string, quantity = 1, openDrawer = true) => {
      const watch = WATCH_CATALOG.find((w) => w.id === watchId);
      if (!watch) return;
      const targetVariantId = variantId ?? watch.variants[0]?.id ?? 'default';

      setCart((prev) => {
        const idx = prev.findIndex(
          (item) => item.watchId === watchId && item.variantId === targetVariantId,
        );
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], quantity: Math.min(10, next[idx].quantity + quantity) };
          return next;
        }
        return [...prev, { watchId, variantId: targetVariantId, quantity: Math.max(1, quantity) }];
      });

      showNotice(`Added ${watch.name} to your bag`);
      if (openDrawer) {
        setIsCartOpen(true);
      }
    },
    [showNotice],
  );

  const updateCartQuantity = useCallback((watchId: string, variantId: string, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) {
        return prev.filter(
          (item) => !(item.watchId === watchId && item.variantId === variantId),
        );
      }
      return prev.map((item) =>
        item.watchId === watchId && item.variantId === variantId
          ? { ...item, quantity: Math.min(10, quantity) }
          : item,
      );
    });
  }, []);

  const removeFromCart = useCallback((watchId: string, variantId: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.watchId === watchId && item.variantId === variantId)),
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const toggleWishlist = useCallback(
    (watchId: string) => {
      const watch = WATCH_CATALOG.find((w) => w.id === watchId);
      setWishlist((prev) => {
        const exists = prev.includes(watchId);
        if (exists) {
          if (watch) showNotice(`Removed ${watch.name} from wishlist`);
          return prev.filter((id) => id !== watchId);
        }
        if (watch) showNotice(`Saved ${watch.name} to wishlist`);
        return [...prev, watchId];
      });
    },
    [showNotice],
  );

  const isWishlisted = useCallback(
    (watchId: string) => wishlist.includes(watchId),
    [wishlist],
  );

  const applyPromoCode = useCallback((rawCode: string) => {
    const normalized = rawCode.trim().toUpperCase();
    if (normalized === 'VALMONT10' || normalized === 'GENEVE10') {
      setPrefs((prev) => ({ ...prev, promoCodeApplied: normalized }));
      return { ok: true, message: '10% Collector Privilege applied.' };
    }
    return { ok: false, message: 'Code not recognized. Try VALMONT10 for 10% off.' };
  }, []);

  const removePromoCode = useCallback(() => {
    setPrefs((prev) => ({ ...prev, promoCodeApplied: null }));
  }, []);

  const recordOrder = useCallback((receipt: OrderReceipt) => {
    setRecentOrders((prev) => [receipt, ...prev].slice(0, 10));
    setCart([]);
    setPrefs((prev) => ({ ...prev, promoCodeApplied: null }));
  }, []);

  const { cartCount, cartSubtotal, promoDiscount, cartTotal } = useMemo(() => {
    let count = 0;
    let subtotal = 0;
    for (const item of cart) {
      const watch = WATCH_CATALOG.find((w) => w.id === item.watchId);
      if (!watch) continue;
      count += item.quantity;
      subtotal += getEffectivePrice(watch) * item.quantity;
    }
    const discount = prefs.promoCodeApplied ? Math.round(subtotal * 0.1) : 0;
    const total = Math.max(0, subtotal - discount);
    return { cartCount: count, cartSubtotal: subtotal, promoDiscount: discount, cartTotal: total };
  }, [cart, prefs.promoCodeApplied]);

  const value = useMemo<StoreContextValue>(
    () => ({
      route,
      navigate,
      cart,
      cartCount,
      cartSubtotal,
      promoDiscount,
      cartTotal,
      isCartOpen,
      openCart,
      closeCart,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      wishlist,
      toggleWishlist,
      isWishlisted,
      selectedCategory,
      setSelectedCategory,
      searchQuery,
      setSearchQuery,
      priceRange,
      setPriceRange,
      sortBy,
      setSortBy,
      promoCode: prefs.promoCodeApplied,
      applyPromoCode,
      removePromoCode,
      recentOrders,
      recordOrder,
      notification,
      dismissNotification,
    }),
    [
      route,
      navigate,
      cart,
      cartCount,
      cartSubtotal,
      promoDiscount,
      cartTotal,
      isCartOpen,
      openCart,
      closeCart,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      wishlist,
      toggleWishlist,
      isWishlisted,
      selectedCategory,
      setSelectedCategory,
      searchQuery,
      priceRange,
      sortBy,
      setSortBy,
      prefs.promoCodeApplied,
      applyPromoCode,
      removePromoCode,
      recentOrders,
      recordOrder,
      notification,
      dismissNotification,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return ctx;
}
