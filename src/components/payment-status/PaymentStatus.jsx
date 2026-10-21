"use client";
import React, { useEffect, useState } from "react";
import { useLocalizedRouter } from "@/utils/localizedNav";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import * as api from "@/api/apiRoutes";
import { useCart } from "@/context/SoukdayCartContext";
import {
  clearCartPromo,
  setCart,
  setCartProducts,
  setCartSubTotal,
  addtoGuestCart,
} from "@/redux/slices/cartSlice";
import { clearCheckout } from "@/redux/slices/checkoutSlice";
import { t } from "@/utils/translation";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import animationOne from "@/assets/order_place_animation/order_placed_back_animation.json";
import animationTwo from "@/assets/order_place_animation/order_success_tick_animation.json";
import animationFailed from "@/assets/order_place_animation/order_failed_animation.json";

const PaymentStatus = () => {
  const dispatch = useDispatch();
  const phonePeData = useSelector(
    (state) => state.Checkout.phonepecheckoutdetails
  );
  const router = useLocalizedRouter();
  const { query } = router;
  const { clearCart } = useCart();

  const [status, setStatus] = useState("");
  const [type, setType] = useState("");

  const checkPaymentStatus = ({ status, status_code, transaction_status }) => {
    if (status === "pending" || transaction_status === "pending")
      return "pending";
    if (
      status === "success" ||
      status === "PAYMENT_SUCCESS" ||
      (status_code === "200" && transaction_status === "capture")
    )
      return "success";
    return "failed";
  };
  const isWalletTransaction = ({ type, order_id }) =>
    type === "wallet" || order_id?.startsWith("wallet-");

  const isSubscriptionTransaction = ({ type, order_id }) =>
    type === "subscription" || order_id?.startsWith("subscription-");

  useEffect(() => {
    if (!type) return; // wait until the query effect resolves the real type
    const timer = setTimeout(() => {
      if (type == "wallet" || type == "subscription") {
        handleWalletClose();
      } else {
        handlePaymentClose();
      }
    }, 6000);
    return () => clearTimeout(timer);
  }, [type]);

  useEffect(() => {
    if (!query || Object.keys(query).length === 0) return;
    if (query?.payment_method == "phonepe") {
      handleGetOrderStatusPhonepe();
      return;
    }
    const paymentStatus = checkPaymentStatus(query);
    const isWallet = isWalletTransaction(query);
    const isSubscription = isSubscriptionTransaction(query);
    setType(isWallet ? "wallet" : isSubscription ? "subscription" : "order");
    setStatus(paymentStatus);

    if (paymentStatus === "success") {
      try {
        if (clearCart) clearCart();
        if (typeof window !== "undefined") {
          localStorage.removeItem("soukday_cart");
          window.dispatchEvent(new Event("soukday_cart_updated"));
        }
        dispatch(setCart({ data: [] }));
        dispatch(addtoGuestCart({ data: [] }));
        dispatch(clearCartPromo());
        dispatch(setCartSubTotal({ data: 0 }));
        dispatch(setCartProducts({ data: [] }));
      } catch (e) {
        console.error("Error clearing cart on success:", e);
      }
    }
  }, [query]);

  const handleWalletClose = () => {
    try {
      if (clearCart) clearCart();
      if (typeof window !== "undefined") {
        localStorage.removeItem("soukday_cart");
      }
      dispatch(clearCheckout());
    } catch (e) {}
    try {
      router.replace("/");
    } catch (e) {
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
  };

  const handleGetOrderStatusPhonepe = async () => {
    try {
      const response = await api.getOrderStatusPhonepe({
        token: phonePeData.token,
        transaction_id: phonePeData.merchantOrderId,
      });

      if (response?.data?.status == "COMPLETED") {
        setStatus("success");
      } else if (response?.data?.status == "FAILED") {
        await handleFailedOrder(response?.data?.order_id);
        setStatus("failed");
      } else {
        await handleFailedOrder(response?.data?.order_id);
        setStatus("pending");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handlePaymentClose = async () => {
    try {
      if (clearCart) {
        clearCart();
      }
      if (typeof window !== "undefined") {
        localStorage.removeItem("soukday_cart");
        window.dispatchEvent(new Event("soukday_cart_updated"));
      }
      dispatch(setCart({ data: [] }));
      dispatch(addtoGuestCart({ data: [] }));
      dispatch(clearCartPromo());
      dispatch(setCartSubTotal({ data: 0 }));
      dispatch(setCartProducts({ data: [] }));
      dispatch(clearCheckout());

      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (token) {
          await api.deleteCart();
        }
      } catch (cartErr) {
        // Non-blocking for unauthenticated guest checkout
      }
    } catch (error) {
      console.error("Error in handlePaymentClose:", error);
    } finally {
      try {
        router.replace("/");
      } catch (navErr) {
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
      }
    }
  };

  const extractOrderNumber = (orderId) => {
    if (!orderId) return null;
    const regex = /^order-(\d+)-\d+$/;
    const match = orderId.match(regex);
    return match ? match[1] : /^\d+$/.test(orderId) ? orderId : null;
  };

  const handleFailedOrder = async (orderId = null) => {
    try {
      if (!query || Object.keys(query).length === 0) return;
      let localOrderId;
      if (orderId == null) {
        localOrderId = extractOrderNumber(query.order_id);
      } else {
        localOrderId = orderId;
      }
      if (localOrderId) {
        await api.deleteOrder({ orderId: localOrderId });
      }
    } catch (error) {
      console.error("Error", error);
    } finally {
      dispatch(clearCheckout());
      try {
        router.push("/");
      } catch (e) {
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
      }
    }
  };


  const renderContent = () => {
    if (status == "success") {
      return (
        <div className="flex flex-col items-center gap-8">
          <div className="relative h-44">
            <Lottie
              className="h-44"
              animationData={animationTwo}
              loop={false}
            />
            <Lottie
              className="h-44 absolute z-60 -left-5 top-0"
              animationData={animationOne}
              loop={true}
            />
            <Lottie
              className="h-44 absolute z-60 -right-5 top-0"
              animationData={animationOne}
              loop={true}
            />
          </div>
          <div className="text-center mt-8">
            <h1 className="text-2xl font-semibold">
              {type == "wallet"
                ? t("wallet_add_description")
                : type == "subscription"
                  ? t("subscription_add_description")
                  : t("order_placed_description")}
            </h1>
            <div className="flex flex-col md:flex-row justify-center gap-4 mx-4 mt-8">
              <button
                type="button"
                id="payment-status-home-btn"
                className="primaryBackColor text-white px-4 md:px-8 py-2.5 rounded-xl font-bold text-lg shadow-md hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  if (type == "wallet" || type == "subscription") {
                    handleWalletClose();
                  } else {
                    handlePaymentClose();
                  }
                }}
              >
                {t("home")}
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (status == "failed") {
      return (
        <div className="flex flex-col relative gap-8">
          <Lottie
            className="h-44"
            animationData={animationFailed}
            loop={false}
          />
          <div className="text-center mt-8">
            <h1 className="text-2xl">{t("order_failed_description")}</h1>
            <button
              className="mt-8 primaryBackColor text-white px-8 py-2 rounded-sm font-bold text-xl"
              onClick={type == "wallet" || type == "subscription" ? handleWalletClose : handleFailedOrder}
            >
              {t("home")}
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <section className="min-h-[600px] flex items-center">
      <div className="container">{renderContent()}</div>
    </section>
  );
};

export default PaymentStatus;
