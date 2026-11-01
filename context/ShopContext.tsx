import { CATALOG } from '@/lib/catalog';
import type { CatalogProduct, SkincareKit } from '@/lib/types';
import * as FileSystem from 'expo-file-system/legacy';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const SHOP_FILE = 'docncare_shop.json';

export type CartItem = { productId: string; qty: number };

type ShopState = {
  wishlist: string[];
  cart: CartItem[];
  recentlyViewed: string[];
  savedKit: SkincareKit | null;
};

type ToastMessage = { id: number; text: string } | null;

type ShopContextValue = ShopState & {
  toast: ToastMessage;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  cartCount: number;
  cartProducts: { product: CatalogProduct; qty: number }[];
  cartTotal: number;
  viewProduct: (productId: string) => void;
  saveKit: (kit: SkincareKit) => void;
  showToast: (text: string) => void;
  dismissToast: () => void;
};

const DEFAULT_SHOP: ShopState = {
  wishlist: [],
  cart: [],
  recentlyViewed: [],
  savedKit: null,
};

const ShopContext = createContext<ShopContextValue | null>(null);

function getFilePath(): string | null {
  try {
    const dir = FileSystem.documentDirectory;
    if (!dir) return null;
    return dir.endsWith('/') ? `${dir}${SHOP_FILE}` : `${dir}/${SHOP_FILE}`;
  } catch {
    return null;
  }
}

async function readShop(): Promise<ShopState> {
  try {
    const path = getFilePath();
    if (!path) return DEFAULT_SHOP;
    const info = await FileSystem.getInfoAsync(path);
    if (!info?.exists) return DEFAULT_SHOP;
    const raw = await FileSystem.readAsStringAsync(path);
    return raw ? { ...DEFAULT_SHOP, ...JSON.parse(raw) } : DEFAULT_SHOP;
  } catch {
    return DEFAULT_SHOP;
  }
}

async function writeShop(value: ShopState) {
  try {
    const path = getFilePath();
    if (!path) return;
    await FileSystem.writeAsStringAsync(path, JSON.stringify(value));
  } catch {
    // local persistence is optional
  }
}

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ShopState>(DEFAULT_SHOP);
  const [toast, setToast] = useState<ToastMessage>(null);

  useEffect(() => {
    readShop().then(setState);
  }, []);

  const persist = useCallback((next: ShopState) => {
    setState(next);
    writeShop(next);
  }, []);

  const showToast = useCallback((text: string) => {
    setToast({ id: Date.now(), text });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  const toggleWishlist = useCallback(
    (productId: string) => {
      const has = state.wishlist.includes(productId);
      persist({
        ...state,
        wishlist: has
          ? state.wishlist.filter((id) => id !== productId)
          : [productId, ...state.wishlist],
      });
      showToast(has ? 'Removed from saved formulas' : 'Saved to wishlist');
    },
    [persist, showToast, state]
  );

  const isWishlisted = useCallback(
    (productId: string) => state.wishlist.includes(productId),
    [state.wishlist]
  );

  const addToCart = useCallback(
    (productId: string) => {
      const existing = state.cart.find((item) => item.productId === productId);
      const cart = existing
        ? state.cart.map((item) =>
            item.productId === productId ? { ...item, qty: item.qty + 1 } : item
          )
        : [...state.cart, { productId, qty: 1 }];
      persist({ ...state, cart });
      showToast('Added to routine bag');
    },
    [persist, showToast, state]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      persist({
        ...state,
        cart: state.cart.filter((item) => item.productId !== productId),
      });
    },
    [persist, state]
  );

  const viewProduct = useCallback(
    (productId: string) => {
      const recentlyViewed = [
        productId,
        ...state.recentlyViewed.filter((id) => id !== productId),
      ].slice(0, 12);
      persist({ ...state, recentlyViewed });
    },
    [persist, state]
  );

  const saveKit = useCallback(
    (kit: SkincareKit) => {
      persist({ ...state, savedKit: kit });
      showToast('Routine saved to your profile');
    },
    [persist, showToast, state]
  );

  const cartProducts = useMemo(
    () =>
      state.cart
        .map((item) => {
          const product = CATALOG.find((p) => p.id === item.productId);
          return product ? { product, qty: item.qty } : null;
        })
        .filter((item): item is { product: CatalogProduct; qty: number } => Boolean(item)),
    [state.cart]
  );

  const cartTotal = useMemo(
    () =>
      cartProducts.reduce((sum, item) => {
        const n = parseInt(item.product.price.replace(/[^\d]/g, ''), 10) || 0;
        return sum + n * item.qty;
      }, 0),
    [cartProducts]
  );

  const value = useMemo(
    () => ({
      ...state,
      toast,
      toggleWishlist,
      isWishlisted,
      addToCart,
      removeFromCart,
      cartCount: state.cart.reduce((n, item) => n + item.qty, 0),
      cartProducts,
      cartTotal,
      viewProduct,
      saveKit,
      showToast,
      dismissToast,
    }),
    [
      addToCart,
      cartProducts,
      cartTotal,
      dismissToast,
      isWishlisted,
      removeFromCart,
      saveKit,
      showToast,
      state,
      toast,
      toggleWishlist,
      viewProduct,
    ]
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used inside ShopProvider');
  return ctx;
}
