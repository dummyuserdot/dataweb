import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { StoreProvider, useStore } from './context/StoreContext';
import { AboutPage } from './pages/AboutPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ContactPage } from './pages/ContactPage';
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ShopPage } from './pages/ShopPage';
import { WishlistPage } from './pages/WishlistPage';

const AppShell: React.FC = () => {
  const { route, notification, dismissNotification } = useStore();

  const routeKey = route.name === 'product' ? `product-${route.slug}` : route.name;

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0C10] text-[#E3E2E8] overflow-x-hidden">
      <Navbar />

      <main className="flex-1 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={routeKey}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {route.name === 'home' && <HomePage />}
            {route.name === 'shop' && <ShopPage />}
            {route.name === 'product' && <ProductDetailPage slug={route.slug} />}
            {route.name === 'wishlist' && <WishlistPage />}
            {route.name === 'about' && <AboutPage />}
            {route.name === 'contact' && <ContactPage />}
            {route.name === 'checkout' && <CheckoutPage />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
      <CartDrawer />

      {/* Mobile-Safe Action Feedback Toast */}
      {notification && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-5 sm:bottom-5 sm:max-w-sm z-50 flex items-center justify-between gap-3 rounded border border-[#D4AF37]/40 bg-[#181B22]/95 backdrop-blur-xl px-4 py-3 text-xs text-[#FDFBF7] shadow-xl"
        >
          <span className="truncate">{notification}</span>
          <button
            type="button"
            onClick={dismissNotification}
            aria-label="Dismiss notification"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center text-[#9CA3AF] hover:text-[#FDFBF7] cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppShell />
    </StoreProvider>
  );
}
