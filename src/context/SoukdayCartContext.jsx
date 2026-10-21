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
import { toast } from 'react-toastify';

const SoukdayCartContext = createContext(undefined);

export function SoukdayCartProvider({ children }) {
  const dispatch = useDispatch();
  const city = useSelector((state) => state.City?.city);

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
    const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const guestItems = items.map((item) => ({
      id: item.product.id,
      product_id: item.product.id,
      product_variant_id: item.product.variant_id || item.product.variantId || item.product.id,
      qty: item.quantity,
      price: item.product.price,
      productPrice: item.product.price,
      title: item.product.name,
      name: item.product.name,
      image_url: item.product.image,
      image: item.product.image,
      unit: item.product.unit,
      module_id: 1,
    }));

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
    const existingIndex = cart.findIndex((i) => i.product.id === product.id);
    let nextCart = [];
    if (existingIndex > -1) {
      nextCart = cart.map((i, idx) =>
        idx === existingIndex ? { ...i, quantity: i.quantity + quantity } : i
      );
    } else {
      nextCart = [...cart, { product, quantity }];
    }
    persistCart(nextCart);
    toast.success(`${product.name} ajouté au panier !`, {
      position: 'bottom-right',
      autoClose: 2000,
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const nextCart = cart.map((i) =>
      i.product.id === productId ? { ...i, quantity } : i
    );
    persistCart(nextCart);
  };

  const removeFromCart = (productId) => {
    const nextCart = cart.filter((i) => i.product.id !== productId);
    persistCart(nextCart);
  };

  const clearCart = () => {
    persistCart([]);
  };

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartSubtotal = cart.reduce((sum, i) => sum + (i.product.price * i.quantity), 0);

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
