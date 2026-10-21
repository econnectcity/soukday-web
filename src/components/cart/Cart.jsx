import React, { useEffect, useState } from "react";
import BreadCrumb from "../breadcrumb/BreadCrumb";
import CartProductCard from "./CartProductCard";
import CartCouponCard from "./CartCouponCard";
import { t } from "@/utils/translation";
import { useSelector, useDispatch } from "react-redux";
import {
  setCartProducts,
  setCartSubTotal,
  setDoorStepDeliveryMode,
  setSelfPickupMode,
} from "@/redux/slices/cartSlice";
import * as api from "@/api/apiRoutes";
import CouponCodeDrawer from "@/components/couponcode/CouponCodeDrawer";
import { LocalizedLink } from "@/utils/localizedNav";
import Image from "next/image";
import NoCartData from "@/assets/Empty_Cart.svg";
import CartPageSkeleton from "./CartLoading";
import { useLocalizedRouter } from "@/utils/localizedNav";
import { clearAllFilter } from "@/redux/slices/productFilterSlice";
import { clearCartPromo } from "@/redux/slices/cartSlice";
import PrescriptionGroupsPanel from "./PrescriptionGroupsPanel";
import { isPrescriptionContext } from "@/utils/prescriptionGroups";
import Login from "../login/Login";

const Cart = () => {
  const dispatch = useDispatch();
  const router = useLocalizedRouter();
  const city = useSelector((state) => state.City.city);
  const cart = useSelector((state) => state.Cart);
  const user = useSelector((state) => state.User);
  const activeModuleId = useSelector((state) => state.Module.activeModuleId);

  const [cartProductsData, setCartProductsData] = useState([]);
  const [showCouponCode, setShowCouponCode] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const isUserLoggedIn = !!user?.jwtToken;

    if (isUserLoggedIn && cart?.guestCart?.length > 0) {
      // Migrate guest items to server cart
      const variantIds = cart.guestCart.map((p) => p.product_variant_id).filter(Boolean).join(",");
      const quantities = cart.guestCart.map((p) => p.qty).join(",");
      if (variantIds) {
        api.addToBulkCart({ variant_ids: variantIds, quantities })
          .then(() => {
            dispatch(addtoGuestCart({ data: [] }));
            fetchCart();
          })
          .catch(() => fetchCart());
      } else {
        fetchCart();
      }
    } else if (isUserLoggedIn) {
      fetchCart();
    } else if (cart?.guestCart?.length > 0) {
      fetchGuestCart();
    } else {
      // Check localStorage for offline / persisted guest cart
      try {
        const saved = localStorage.getItem("soukday_cart");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const guestItems = parsed.map((item) => ({
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
              module_id: 1,
            }));
            dispatch(addtoGuestCart({ data: guestItems }));
            return;
          }
        }
      } catch (e) {}

      setCartProductsData([]);
      setInitialLoad(false);
    }
  }, [activeModuleId, user?.jwtToken, cart?.guestCart?.length]);

  const fetchGuestCart = async () => {
    setLoading(true);
    try {
      const moduleGuestCart =
        cart?.guestCart?.filter((p) => !activeModuleId || p.module_id == activeModuleId || !p.module_id) || cart?.guestCart || [];
      const variantIds = moduleGuestCart.map((p) => p.product_variant_id).filter(Boolean);
      const quantities = moduleGuestCart.map((p) => p.qty);

      if (!variantIds.length) {
        setCartProductsData([]);
        setLoading(false);
        setInitialLoad(false);
        return;
      }

      const response = await api.getGuestCart({
        latitude: city?.latitude || 45.5017,
        longitude: city?.longitude || -73.5673,
        variant_ids: variantIds?.join(","),
        quantities: quantities?.join(","),
      });
      if (response?.status == 1 && response?.data?.cart && response.data.cart.length > 0) {
        setCartProductsData(response.data.cart);
        dispatch(setCartSubTotal({ data: response?.data?.sub_total }));
        if (response?.data?.doorstep_delivery_mode !== undefined) {
          dispatch(setDoorStepDeliveryMode({ data: response.data.doorstep_delivery_mode }));
        }
        if (response?.data?.self_pickup_mode !== undefined) {
          dispatch(setSelfPickupMode({ data: response.data.self_pickup_mode }));
        }
      } else if (moduleGuestCart.length > 0) {
        // Fallback to local guest cart items so customer cart is never lost
        const fallbackItems = moduleGuestCart.map((item) => ({
          id: item.product_variant_id || item.product_id || item.id,
          product_id: item.product_id || item.id,
          product_variant_id: item.product_variant_id || item.product_id,
          name: item.title || item.name || 'Produit',
          price: item.price || item.productPrice || 0,
          qty: item.qty || 1,
          image_url: item.image_url || item.image,
          image: item.image_url || item.image,
          final_price_with_tax: (item.price || item.productPrice || 0) * (item.qty || 1),
          product: {
            id: item.product_id || item.id,
            name: item.title || item.name,
            image_url: item.image_url || item.image,
          }
        }));
        setCartProductsData(fallbackItems);
        const total = fallbackItems.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
        dispatch(setCartSubTotal({ data: total }));
      }
      setLoading(false);
      setInitialLoad(false);
    } catch (error) {
      // In case of network error, still render the local items
      const moduleGuestCart = cart?.guestCart || [];
      if (moduleGuestCart.length > 0) {
        const fallbackItems = moduleGuestCart.map((item) => ({
          id: item.product_variant_id || item.product_id || item.id,
          product_id: item.product_id || item.id,
          product_variant_id: item.product_variant_id || item.product_id,
          name: item.title || item.name || 'Produit',
          price: item.price || item.productPrice || 0,
          qty: item.qty || 1,
          image_url: item.image_url || item.image,
          image: item.image_url || item.image,
          final_price_with_tax: (item.price || item.productPrice || 0) * (item.qty || 1),
          product: {
            id: item.product_id || item.id,
            name: item.title || item.name,
            image_url: item.image_url || item.image,
          }
        }));
        setCartProductsData(fallbackItems);
      }
      setLoading(false);
      setInitialLoad(false);
      console.log("Error", error);
    }
  };

  const fetchCart = async () => {
    setLoading(true);
    try {
      const cartData = await api.getCart({
        latitude: city?.latitude || 45.5017,
        longitude: city?.longitude || -73.5673,
      });
      if (cartData?.status == 1) {
        setCartProductsData(cartData?.data?.cart || []);
        dispatch(setCartSubTotal({ data: cartData?.data?.sub_total }));
        dispatch(setSelfPickupMode({ data: cartData?.data?.self_pickup_mode }));
        dispatch(
          setDoorStepDeliveryMode({
            data: cartData?.data?.doorstep_delivery_mode,
          })
        );
        setCartData(cartData?.data);
        setLoading(false);
        setInitialLoad(false);
        const productsData = cartData?.data?.cart?.map((product) => {
          return {
            product_id: product?.product_id,
            product_variant_id: product?.product_variant_id,
            qty: product?.qty,
          };
        });
        dispatch(setCartProducts({ data: productsData || [] }));
      } else {
        dispatch(setCartProducts({ data: [] }));
        dispatch(setCartSubTotal({ data: 0 }));
        setCartProductsData([]);
        setCartSubTotal(0);
        setLoading(false);
        setInitialLoad(false);
      }
    } catch (error) {
      setLoading(false);
      setInitialLoad(false);
      console.log("error", error);
    }
  };

  // Show skeleton during initial load
  if (initialLoad) {
    return (
      <>
        <BreadCrumb />
        <CartPageSkeleton />
      </>
    );
  }

  // Show empty state when no products and not loading
  if (!loading && cartProductsData?.length === 0) {
    return (
      <section>
        <BreadCrumb />
        <div className="container">
          <div className="flex items-center justify-center h-full my-auto mx-10">
            <div className="flex items-center justify-center flex-col gap-2 my-4">
              <Image
                 src={NoCartData}
                  alt="No Cart Data"
                  width={512}
                  height={325}
                  className="object-contain"
              />
              <h1 className="font-bold text-[22px] text-center py-2">
                {t("empty_cart_list_message")}
              </h1>
              <p className="font-bold text-xs text-center">
                {t("empty_cart_list_description")}
              </p>
              <button
                onClick={() => {
                  router.push("/products")
                  dispatch(clearAllFilter());
                  setShowCouponCode(false);
                  dispatch(clearCartPromo());
                }}
                className="primaryBackColor text-white font-bold p-1 rounded-sm"
              >
                {t("empty_cart_list_button_name")}
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <BreadCrumb />
      <div className="container">
        {loading ? (
          // Show skeleton when updating cart
          <div className="my-12 px-2">
            <CartPageSkeleton />
          </div>
        ) : (
          // Show cart content
          <div className="my-12 px-2">
            <div className="flex flex-col gap-1">
              <h1 className="font-bold text-2xl">{t("myCart")}</h1>
              <p className="font-medium text-base">
                {`${t("there_are")} ${cartProductsData?.length} ${t(
                  "product_in_your_cart"
                )}`}
              </p>
            </div>
            <div className="grid grid-cols-12 gap-4 mt-6">
              <div className="col-span-12 lg:col-span-8 cardBorder rounded-sm w-full overflow-hidden self-start">
                <div className="w-full overflow-x-auto">
                  <div className="grid grid-cols-12 gap-4 min-w-0 md:min-w-[600px] p-4 font-medium border-b border-gray-300 backgroundColor">
                    <div className="col-span-4 font-bold">{t("product")}</div>
                    <div className="col-span-2 text-center font-bold hidden md:block">
                      {t("price")}
                    </div>
                    <div className="col-span-3 text-center font-bold hidden md:block">
                      {t("quantity")}
                    </div>
                    <div className="col-span-2 text-center font-bold hidden md:block">
                      {t("total")}
                    </div>
                    <div className="col-span-1 text-center font-bold hidden md:block">
                      {t("action")}
                    </div>
                  </div>

                  {cartProductsData?.map((product) => {
                    const cartProduct = cart?.cartProducts?.find(
                      (prdct) =>
                        prdct?.product_variant_id == product?.product_variant_id
                    );
                    const guestProduct = cart?.guestCart?.find(
                      (prdct) =>
                        prdct?.product_variant_id == product?.product_variant_id
                    );

                    if (cartProduct?.qty > 0 || guestProduct?.qty > 0 || Number(product?.qty) > 0) {
                      return (
                        <CartProductCard
                          key={product?.id}
                          product={product}
                          cartProductsData={cartProductsData}
                          setCartProductsData={setCartProductsData}
                          showPrescriptionSelect={false}
                        />
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
              <div className="col-span-12 lg:col-span-4">
                <CartCouponCard
                  setShowCouponCode={setShowCouponCode}
                  setShowLogin={setShowLogin}
                  cartProductsData={cartProductsData}
                  requiresPrescription={false}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <CouponCodeDrawer
        showCouponCode={showCouponCode}
        setShowCouponCode={setShowCouponCode}
      />
      <Login showLogin={showLogin} setShowLogin={setShowLogin} />
    </section>
  );
};

export default Cart;
