'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { useCart } from '@/context/SoukdayCartContext';
import { useRouter } from 'next/router';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Truck, 
  ArrowRight, 
  Store as StoreIcon,
  ShieldCheck
} from 'lucide-react';

export default function CartDrawer() {
  const router = useRouter();
  const user = useSelector((state: any) => state.User);
  const setting = useSelector((state: any) => state.Setting?.setting);
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    cartSubtotal, 
    cartCount,
    selectedAddress 
  } = useCart();

  // Prevent background body scrolling when drawer is open
  React.useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  // Handle escape key to close drawer smoothly
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  // Group items by store
  const storeGroups = cart.reduce((acc, item) => {
    const p = item.product || item;
    const key = p.storeName || (p as any).seller_name || 'Soukday';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, typeof cart>);

  const deliveryFee = cartSubtotal > 50 ? 0 : 4.99;
  const grandTotal = cartSubtotal + (cartSubtotal > 0 ? deliveryFee : 0);

  return (
    <div 
      className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ${
        isCartOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none delay-300'
      }`}
      aria-hidden={!isCartOpen}
    >
      {/* Backdrop with smooth blur and fade */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ease-in-out ${
          isCartOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 pointer-events-none">
        <div 
          className={`w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between pointer-events-auto transform transition-transform duration-350 ease-out ${
            isCartOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#FCEFEA] text-[#F68B62] border border-[#F68B62]/20 flex items-center justify-center shadow-xs">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-black text-stone-900">Votre Panier Soukday</h2>
                <p className="text-xs text-stone-500">
                  {cartCount} article{cartCount > 1 ? 's' : ''} • {selectedAddress ? `Livraison à ${selectedAddress.city}` : 'Livraison locale rapide'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-stone-200/80 active:scale-95 flex items-center justify-center text-stone-400 hover:text-stone-700 hover:rotate-90 transition-all duration-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-[#FCEFEA] border border-[#F68B62]/20 flex items-center justify-center mx-auto text-[#F68B62]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="text-base font-bold text-stone-800">Votre panier est vide</div>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Ajoutez des produits d’épicerie ou de boucherie pour commencer votre commande.
                </p>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-[#F68B62] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Découvrir les produits
                </button>
              </div>
            ) : (
              Object.entries(storeGroups).map(([storeName, items]) => {
                const firstP = items[0]?.product || items[0];
                const isSoukdayDirect = (firstP as any)?.storeType === 'soukday_direct' || (firstP as any)?.seller_id == 11;
                return (
                  <div key={storeName} className={`space-y-3 p-3.5 rounded-2xl border ${
                    isSoukdayDirect ? 'bg-[#FCEFEA]/45 border-[#F68B62]/30' : 'bg-stone-50/70 border-stone-200/70'
                  }`}>
                    {/* Store Title */}
                    <div className="flex items-center justify-between border-b border-stone-200/60 pb-2">
                      <div className="flex items-center gap-1.5 font-black text-xs text-stone-900">
                        <StoreIcon className="w-3.5 h-3.5 text-[#F68B62]" />
                        <span>{storeName}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isSoukdayDirect
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-[#FCEFEA] text-emerald-800'
                      }`}>
                        {isSoukdayDirect ? 'Expédition Canada & USA' : 'Livraison Locale'}
                      </span>
                    </div>

                    {/* Store Items */}
                    <div className="space-y-3">
                      {items.map((item, idx) => {
                        const p = item.product || item;
                        const variantId = (p as any).variant_id || (p as any).variantId;
                        const price = Number(p.price) || 0;
                        const itemKey = `${p.id || idx}-${variantId || 'base'}`;

                        return (
                          <div key={itemKey} className="flex items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-stone-100">
                            <img
                              src={p.image || '/images/placeholder.png'}
                              alt={p.name}
                              className="w-12 h-12 rounded-lg object-cover bg-stone-100 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-stone-900 truncate">
                                {p.name}
                              </h4>
                              <div className="text-[11px] text-stone-500">
                                {price.toFixed(2)}$ {p.unit ? `/ ${p.unit}` : ''}
                              </div>
                              <div className="text-xs font-black text-[#F68B62] mt-0.5">
                                {(price * item.quantity).toFixed(2)}$
                              </div>
                            </div>

                            {/* Quantity control */}
                            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg shrink-0">
                              <button
                                type="button"
                                onClick={() => updateQuantity(p.id, item.quantity - 1, variantId)}
                                className="w-6 h-6 rounded bg-white hover:bg-stone-200 flex items-center justify-center text-stone-700 cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold w-5 text-center">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(p.id, item.quantity + 1, variantId)}
                                className="w-6 h-6 rounded bg-white hover:bg-stone-200 flex items-center justify-center text-stone-700 cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeFromCart(p.id, variantId)}
                              className="text-stone-300 hover:text-red-500 p-1 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-200 bg-white space-y-3">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Sous-total articles</span>
                  <span className="font-bold text-stone-900">{cartSubtotal.toFixed(2)}$</span>
                </div>
                <div className="flex justify-between">
                  <span>Frais de livraison estimés</span>
                  <span className="font-bold text-stone-900">
                    {deliveryFee === 0 ? (
                      <span className="text-[#FF7A45] font-bold">Gratuite</span>
                    ) : (
                      `${deliveryFee.toFixed(2)}$`
                    )}
                  </span>
                </div>
                {cartSubtotal < 50 && (
                  <div className="text-[11px] text-[#F68B62] bg-[#FCEFEA] border border-[#F68B62]/25 p-2 rounded-xl font-semibold flex items-center justify-between">
                    <span>Ajoutez <strong>{(50 - cartSubtotal).toFixed(2)}$</strong> pour la livraison gratuite !</span>
                    <Truck className="w-3.5 h-3.5 shrink-0" />
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-stone-100 text-sm font-black text-stone-900">
                  <span>Total estimé</span>
                  <span className="text-lg text-[#F68B62]">{grandTotal.toFixed(2)}$</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => { setIsCartOpen(false); router.push('/cart'); }}
                  className="py-3 px-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-stone-600" />
                  <span>Voir le panier</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    const isGuestCheckout =
                      Number(setting?.guest_checkout) === 1 ||
                      Number(setting?.guest_cart) === 1 ||
                      setting?.guest_checkout === true ||
                      setting?.guest_cart === true;
                    if (!user?.jwtToken && !isGuestCheckout) {
                      router.push('/cart');
                    } else {
                      router.push('/checkout');
                    }
                  }}
                  className="py-3 px-3 rounded-2xl bg-[#F68B62] hover:bg-[#e07750] text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#F68B62]/25 active:scale-95 transition-all cursor-pointer"
                >
                  <span>Commander</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FF7A45]" />
                <span>Paiement 100% sécurisé via Stripe / Cartes</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
