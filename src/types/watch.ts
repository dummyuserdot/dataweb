export type WatchCategory =
  | "Men's Watches"
  | "Women's Watches"
  | "Luxury Watches"
  | "Smart Watches"
  | "Sports Watches"
  | "Casual Watches";

export type StockStatus = 'In Stock' | 'Limited Allocation' | 'Waitlist Only';

export interface WatchVariant {
  id: string;
  name: string;
  dialColor: string;
  strapMaterial: string;
  swatchHex: string;
}

export interface WatchSpecifications {
  caliber: string;
  caseDiameter: string;
  caseMaterial: string;
  crystal: string;
  waterResistance: string;
  powerReserve: string;
  lugWidth: string;
  warranty: string;
}

export interface WatchProduct {
  id: string;
  slug: string;
  reference: string;
  name: string;
  subtitle: string;
  primaryCategory: WatchCategory;
  categories: WatchCategory[];
  price: number;
  discountPrice?: number;
  image: string;
  description: string;
  storyNote: string;
  stockStatus: StockStatus;
  stockCount: number;
  featured: boolean;
  trending: boolean;
  bestSeller: boolean;
  popularityScore: number;
  releaseDate: string;
  variants: WatchVariant[];
  specifications: WatchSpecifications;
}

export interface CartItem {
  watchId: string;
  variantId: string;
  quantity: number;
}

export type SortOption = 'popular' | 'price-asc' | 'price-desc' | 'newest';

export type PriceRangeFilter = 'all' | 'under-3000' | '3000-8000' | 'over-8000';

export type PageRoute =
  | { name: 'home' }
  | { name: 'shop' }
  | { name: 'product'; slug: string }
  | { name: 'wishlist' }
  | { name: 'about' }
  | { name: 'contact' }
  | { name: 'checkout' };

export interface UserPreferences {
  lastCategory: WatchCategory | 'All';
  lastSort: SortOption;
  promoCodeApplied: string | null;
}

export interface OrderReceipt {
  orderNumber: string;
  date: string;
  customerName: string;
  customerPhone?: string;
  customerEmail: string;
  shippingAddress: string;
  postalCode?: string;
  instructions?: string;
  paymentMethod: string;
  totalItems?: number;
  items: Array<{
    name: string;
    variantName: string;
    quantity: number;
    unitPrice: number;
  }>;
  subtotal: number;
  discount: number;
  total: number;
  whatsappUrl?: string;
}
