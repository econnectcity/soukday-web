'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { X, Bell, CheckCircle2, Mail, User as UserIcon, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import * as api from '@/api/apiRoutes';

export default function StockNotificationModal({
  isOpen,
  onClose,
  product,
  selectedVariant,
}) {
  const user = useSelector((state) => state.User?.user);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
    if (user?.name) {
      setName(user.name);
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Veuillez saisir une adresse courriel valide.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.subscribeStockNotification({
        productId: product?.id,
        variantId: selectedVariant?.id,
        email: email.trim(),
        name: name.trim(),
      });

      if (res?.status === 1 || res?.status === true) {
        setIsSuccess(true);
        // Persist locally so UI shows subscribed badge
        try {
          const key = `soukday_notified_${product?.id}`;
          localStorage.setItem(key, 'true');
        } catch (e) {}

        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 2200);
      } else {
        toast.error(res?.message || "Impossible d'enregistrer votre demande.");
      }
    } catch (err) {
      toast.error("Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const productName = product?.translations?.name || product?.name || 'Produit';
  const productImage = product?.image_url || product?.image || '/placeholder.png';
  const variantText = selectedVariant
    ? `${selectedVariant.measurement || ''} ${selectedVariant.stock_unit_name || selectedVariant.unit?.translations?.short_code || ''}`.trim()
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-[#F68B62]/10 via-[#FCEFEA] to-[#F68B62]/10 px-6 pt-6 pb-4 border-b border-[#F68B62]/15 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#F68B62] text-white flex items-center justify-center shadow-md shadow-[#F68B62]/25">
              <Bell className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-extrabold text-stone-900 text-lg sm:text-xl">
                Alerte de retour en stock
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                Recevez un courriel dès qu'il est disponible
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-stone-400 hover:text-stone-700 flex items-center justify-center shadow-xs transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="py-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-[#FCEFEA] text-[#F68B62] flex items-center justify-center mb-4">
                <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
              </div>
              <h4 className="text-lg font-bold text-stone-900 mb-1">
                Demande enregistrée!
              </h4>
              <p className="text-sm text-stone-600 max-w-xs">
                Nous avons bien noté votre courriel ({email}). Vous serez le premier averti lors du réapprovisionnement.
              </p>
            </div>
          ) : (
            <>
              {/* Product preview snippet */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-200/70 mb-5">
                <img
                  src={productImage}
                  alt={productName}
                  className="w-14 h-14 object-contain rounded-xl bg-white p-1 border border-stone-100 mix-blend-multiply"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                    Produit actuellement épuisé
                  </p>
                  <p className="text-sm font-bold text-stone-900 truncate">
                    {productName}
                  </p>
                  {variantText && (
                    <span className="inline-block mt-0.5 text-xs font-semibold px-2 py-0.5 rounded-md bg-stone-200/60 text-stone-600">
                      Format: {variantText}
                    </span>
                  )}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                    Votre nom (optionnel)
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Mohamed K."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#F68B62]/40 focus:border-[#F68B62] text-sm text-stone-900 placeholder:text-stone-400 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                    Adresse courriel <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre.courriel@exemple.ca"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#F68B62]/40 focus:border-[#F68B62] text-sm text-stone-900 placeholder:text-stone-400 font-medium"
                    />
                  </div>
                  {user?.email && (
                    <p className="text-[11px] text-[#F68B62] font-semibold mt-1">
                      ✓ Pré-rempli avec votre compte Soukday
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-2xl bg-[#F68B62] hover:bg-[#e07047] active:scale-[0.98] text-white font-extrabold text-sm shadow-lg shadow-[#F68B62]/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Enregistrement...</span>
                      </>
                    ) : (
                      <>
                        <Bell className="w-4 h-4 stroke-[2.5]" />
                        <span>M'avertir du retour en stock</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-stone-400 text-center leading-relaxed">
                  Pas de spam. Nous vous enverrons un seul courriel dès que ce produit sera disponible.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
