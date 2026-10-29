'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  addtoGuestCart, 
  setGuestCartTotal,
  setCartProducts,
  setCartSubTotal,
  setIsGuest
} from '@/redux/slices/cartSlice';
import * as api from '@/api/apiRoutes';
import { toast } from 'react-toastify';

/**
 * Standardizes any product representation (from search, listing, detail page, modal)
 * into the unified shape required by SoukdayCartContext and CartDrawer.
 */
export function normalizeProductForCart(product, selectedVariant = null) {
  if (!product) return null;

  // Selected or first variant
  const variant =
    selectedVariant ||
    (Array.isArray(product.variants) && product.variants.length > 0
      ? product.variants[0]
      : {});

  // Determine price (discounted_price if > 0, else price)
  const variantPrice = Number(variant.discounted_price) > 0
    ? Number(variant.discounted_price)
    : Number(variant.price) > 0
    ? Number(variant.price)
    : 0;

  const productPrice = Number(product.discounted_price) > 0
    ? Number(product.discounted_price)
    : Number(product.price) > 0
    ? Number(product.price)
    : 0;

  const finalPrice = variantPrice > 0 ? variantPrice : productPrice;

  // Format unit (e.g., "500 g", "1 kg", or product.unit)
  const unitParts = [
    variant.measurement,
    variant.stock_unit_name ||
      variant.unit?.translations?.short_code ||
      variant.measurement_unit_name ||
      variant.unit
  ].filter(Boolean);

  const unit = unitParts.length > 0 ? unitParts.join(' ') : (product.unit || '');

  // Extract best image
  const image =
    product.image_url ||
    product.image ||
    (Array.isArray(product.images) && (product.images[0]?.image_url || product.images[0])) ||
    '/images/placeholder.png';

  // Store information
  const isSoukdayDirectCheck =
    product.seller_id === 0 ||
    product.seller_id === 11 ||
    String(product.seller_name || '').toLowerCase().includes('soukday') ||
    String(product.seller?.translations?.name || '').toLowerCase().includes('soukday') ||
    String(product.seller?.name || '').toLowerCase().includes('soukday');

  const sellerId = product.seller_id || product.seller?.id || product.store_id || 11;
  const storeName = isSoukdayDirectCheck
    ? 'Soukday'
    : product.seller?.translations?.name ||
      product.seller_name ||
      product.store_name ||
      product.seller?.store_name ||
      product.seller?.name ||
      'Soukday';

  const isSoukdayDirect = isSoukdayDirectCheck;
  const variantId = variant.id || product.variant_id || product.variantId || product.id;

  return {
    id: Number(product.id),
    name: product.translations?.name || product.name || '',
    price: finalPrice,
    image: image,
    unit: unit,
    storeName: storeName,
    storeType: isSoukdayDirect ? 'soukday_direct' : 'partner_store',
    variant_id: variantId,
    variantId: variantId,
    seller_id: sellerId,
  };
}

const SoukdayCartContext = createContext(undefined);

export function SoukdayCartProvider({ children }) {
  const dispatch = useDispatch();

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const user = useSelector((state) => state.User?.user);
  const reduxSelectedAddress = useSelector((state) => state.Addresses?.selectedAddress);

  const [sessionAddress, setSessionAddress] = useState(null);

  // Load manually saved session address if customer explicitly picked one
  useEffect(() => {
    try {
      const saved = localStorage.getItem('soukday_address');
      if (saved) {
        setSessionAddress(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  // Priority: 1. session chosen address, 2. user account saved address, 3. null (default is none)
  const userAccountAddress = (reduxSelectedAddress && (reduxSelectedAddress.city || reduxSelectedAddress.area)) ? {
    address: `${reduxSelectedAddress.address || ''}, ${reduxSelectedAddress.city || ''}`,
    city: reduxSelectedAddress.city || '',
    postalCode: reduxSelectedAddress.pincode || reduxSelectedAddress.postalCode || '',
    lat: parseFloat(reduxSelectedAddress.latitude || 45.5017),
    lng: parseFloat(reduxSelectedAddress.longitude || -73.5673),
  } : null;

  const selectedAddress = sessionAddress || userAccountAddress || null;

  // Safely load and sync cart from localStorage AFTER client hydration
  useEffect(() => {
    setIsHydrated(true);
    const timer = setTimeout(() => {
      try {
        const saved = localStorage.getItem('soukday_cart');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCart(parsed);
            syncWithRedux(parsed);
          }
        }
      } catch (e) {
        // ignore
      }
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const syncWithRedux = (items) => {
    const total = items.reduce((sum, item) => {
      const p = item.product || item;
      return sum + ((Number(p.price) || 0) * item.quantity);
    }, 0);
    const guestItems = items.map((item) => {
      const p = item.product || item;
      return {
        id: p.id,
        product_id: p.id,
        product_variant_id: p.variant_id || p.variantId || p.id,
        qty: item.quantity,
        price: p.price,
        productPrice: p.price,
        title: p.name,
        name: p.name,
        image_url: p.image,
        image: p.image,
        unit: p.unit,
        storeName: p.storeName,
        module_id: 1,
      };
    });

    dispatch(setIsGuest({ data: !user?.jwtToken }));
    dispatch(addtoGuestCart({ data: guestItems }));
    dispatch(setGuestCartTotal({ data: total }));
    dispatch(setCartProducts({ data: guestItems }));
    dispatch(setCartSubTotal({ data: total }));
  };

  const persistCart = (newCart) => {
    setCart(newCart);
    try {
      localStorage.setItem('soukday_cart', JSON.stringify(newCart));
    } catch (e) {}
    syncWithRedux(newCart);
  };

  const addToCart = (product, quantity = 1) => {
    if (!product) return;
    const variantId = product.variant_id || product.variantId;
    
    const existingIndex = cart.findIndex((i) => {
      if (variantId && (i.product.variant_id || i.product.variantId)) {
        return (
          Number(i.product.id) === Number(product.id) &&
          Number(i.product.variant_id || i.product.variantId) === Number(variantId)
        );
      }
      return Number(i.product.id) === Number(product.id);
    });

    let nextCart = [];
    if (existingIndex > -1) {
      nextCart = cart.map((i, idx) =>
        idx === existingIndex ? { ...i, quantity: i.quantity + quantity } : i
      );
    } else {
      nextCart = [...cart, { product, quantity }];
    }
    persistCart(nextCart);

    // Sync with backend API if user is authenticated
    if (user?.jwtToken) {
      const targetItem = nextCart.find((i) => {
        if (variantId && (i.product.variant_id || i.product.variantId)) {
          return (
            Number(i.product.id) === Number(product.id) &&
            Number(i.product.variant_id || i.product.variantId) === Number(variantId)
          );
        }
        return Number(i.product.id) === Number(product.id);
      });
      api.addToCart({
        product_id: product.id,
        product_variant_id: variantId || product.id,
        qty: targetItem?.quantity || quantity,
      }).catch((e) => console.log('Cart API sync:', e));
    }

    toast.success(`${product.name} ajouté au panier !`, {
      position: 'bottom-right',
      autoClose: 2000,
    });
  };

  const updateQuantity = (productId, quantity, variantId = null) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    const nextCart = cart.map((i) => {
      const match = variantId && (i.product.variant_id || i.product.variantId)
        ? (Number(i.product.id) === Number(productId) && Number(i.product.variant_id || i.product.variantId) === Number(variantId))
        : (Number(i.product.id) === Number(productId));
      return match ? { ...i, quantity } : i;
    });
    persistCart(nextCart);

    if (user?.jwtToken) {
      api.addToCart({
        product_id: productId,
        product_variant_id: variantId || productId,
        qty: quantity,
      }).catch((e) => console.log('Cart API sync:', e));
    }
  };

  const removeFromCart = (productId, variantId = null) => {
    const nextCart = cart.filter((i) => {
      if (variantId && (i.product.variant_id || i.product.variantId)) {
        return !(Number(i.product.id) === Number(productId) && Number(i.product.variant_id || i.product.variantId) === Number(variantId));
      }
      return Number(i.product.id) !== Number(productId);
    });
    persistCart(nextCart);

    if (user?.jwtToken) {
      api.removeFromCart({
        product_id: productId,
        product_variant_id: variantId || productId,
      }).catch((e) => console.log('Cart API sync:', e));
    }
  };

  const getItemQuantity = (productId, variantId = null) => {
    const found = cart.find((i) => {
      if (variantId && (i.product.variant_id || i.product.variantId)) {
        return (
          Number(i.product.id) === Number(productId) &&
          Number(i.product.variant_id || i.product.variantId) === Number(variantId)
        );
      }
      return Number(i.product.id) === Number(productId);
    });
    return found ? found.quantity : 0;
  };

  const isItemInCart = (productId, variantId = null) => {
    return getItemQuantity(productId, variantId) > 0;
  };

  const clearCart = () => {
    persistCart([]);
  };

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartSubtotal = cart.reduce((sum, i) => {
    const p = i.product || i;
    return sum + ((Number(p.price) || 0) * i.quantity);
  }, 0);

  const setSelectedAddress = (addr) => {
    setSessionAddress(addr);
    try {
      if (addr) {
        localStorage.setItem('soukday_address', JSON.stringify(addr));
      } else {
        localStorage.removeItem('soukday_address');
      }
    } catch (e) {}
  };

  return (
    <SoukdayCartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        getItemQuantity,
        isItemInCart,
        clearCart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        selectedAddress,
        setSelectedAddress,
        isAddressModalOpen,
        setIsAddressModalOpen,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        isHydrated,
      }}
    >
      {children}
    </SoukdayCartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(SoukdayCartContext);
  if (!context) {
    throw new Error('useCart must be used within a SoukdayCartProvider');
  }
  return context;
}
