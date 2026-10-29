"use client";
import React, { useEffect, useState } from "react";
import BreadCrumb from "../breadcrumb/BreadCrumb";
import Stepper from "./Stepper";
import AddressCard from "../cards/AddressCard";
import { t } from "@/utils/translation";
import { GoPlus, GoPlusCircle } from "react-icons/go";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { FaRegCalendarAlt } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CheckoutPayment from "./CheckoutPayment";
import OrderSummaryCard from "./OrderSummaryCard";
import { useDispatch, useSelector } from "react-redux";
import dynamic from 'next/dynamic';
const NewAddressModal = dynamic(() => import('../newaddressmodal/NewAddressModal'), {
  ssr: false,
});
import * as api from "@/api/apiRoutes";
import {
  clearCartPromo,
  setCartCheckout,
  setCartPromo,
  setDoorStepDeliveryMode,
  setSelfPickupMode,
  setCart,
  setCartProducts,
  setCartSubTotal,
  addtoGuestCart,
} from "@/redux/slices/cartSlice";
import { setAllAddresses } from "@/redux/slices/addressSlice";
import {
  setAddress,
  setSelectedDate,
  setCurrentStep,
  setTimeSlot,
  setOrderNote,
  setCheckoutTotal,
  setPhonePeCheckoutDetails,
  setOrderType,
} from "@/redux/slices/checkoutSlice";
import { toast } from "react-toastify";
import { useLocalizedRouter } from "@/utils/localizedNav";
import { setCurrentUser } from "@/redux/slices/userSlice";
import { useCart } from "@/context/SoukdayCartContext";

// Remove: import StripeModal from "./StripeModal";

const StripeModal = dynamic(() => import("./StripeModal"), {
  ssr: false, // Stripe must only load on the client side
});
import PaystackPop from "@paystack/inline-js";
import CheckoutSkeleton from "./CheckoutSkeleton";
import { FiPhoneCall, FiTruck, FiUser, FiPhone, FiMail, FiMapPin, FiHome } from "react-icons/fi";
import { MdOutlineStorefront, MdOutlineWatchLater } from "react-icons/md";
import { IoLocationOutline, IoArrowBack, IoArrowForward } from "react-icons/io5";

const Checkout = () => {
  const router = useLocalizedRouter();
  const dispatch = useDispatch();
  const { clearCart } = useCart();

  const city = useSelector((state) => state.City.city);
  const cart = useSelector((state) => state.Cart);
  const address = useSelector((state) => state.Addresses);
  const user = useSelector((state) => state.User.user);
  const token = useSelector((state) => state.User.jwtToken);
  const setting = useSelector((state) => state.Setting);

  const checkout = useSelector((state) => state.Checkout);

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [showStripe, setShowStripe] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // stripe variables
  const [stripeOrderId, setStripeOrderId] = useState(null);
  const [stripeClientSecret, setStripeClientSecret] = useState(null);
  const [stripeTransactionId, setStripeTransactionId] = useState(null);
  // step 1 variables
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  const [showAddAddres, setShowAddAddres] = useState(false);
  const [checkOutError, setCheckOutError] = useState(false);
  const [checkOutErrorMsg, setCheckOutErrorMsg] = useState("");

  // inline form state for delivery & contact details
  const [deliveryForm, setDeliveryForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.mobile || "",
    street: "",
    apartment: "",
    city: city?.name || "Montréal",
    state: "QC",
    postalCode: "",
    deliveryNotes: checkout?.orderNote || "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isEnteringNewAddress, setIsEnteringNewAddress] = useState(false);

  // step 2 Variables
  // const [selectedDate, setSelectedDate] = useState(null)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [timeSlotsData, setTimeSlotsData] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);

  const [availabeleTimeSlot, setAvailableTimeSlot] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  // step 3 variables
  const [checkoutData, setCheckoutData] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState();

  useEffect(() => {
    fetchAddress();
    handleFetchTimeSlots();
    getCurrentUser();
    const orderType =
      cart?.doorstep_delivery_mode === 0 && cart?.self_pickup_mode === 1
        ? "selfpickup"
        : "doorstep";
    handleOrderType(orderType);
  }, []);

  useEffect(() => {
    validateCouponCode();
  }, [cart?.cart, checkout?.address, cart?.cartProducts]);

  useEffect(() => {
    handleFetchCheckout();
  }, [
    cart?.cart,
    cart?.promo_code,
    checkout?.address,
    cart?.cartProducts,
    checkout?.orderType,
    checkout?.timeSlot,
  ]);

  const getCurrentUser = async () => {
    if (!token) return;
    try {
      const response = await api.getUser();
      dispatch(setCurrentUser({ data: response.user }));
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (user) {
      setDeliveryForm((prev) => ({
        ...prev,
        name: prev.name || user?.name || "",
        email: prev.email || user?.email || "",
        phone: prev.phone || user?.mobile || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    if (checkout?.address) {
      setDeliveryForm((prev) => ({
        ...prev,
        name: checkout.address.name || prev.name,
        email: checkout.address.email || prev.email,
        phone: checkout.address.mobile || prev.phone,
        street: checkout.address.street || prev.street,
        apartment: checkout.address.landmark || prev.apartment,
        city: checkout.address.city || prev.city,
        state: checkout.address.state || prev.state,
        postalCode: checkout.address.pincode || prev.postalCode,
      }));
    }
  }, [checkout?.address]);

  const validateCouponCode = async () => {
    if (!cart?.promo_code?.promo_code || !token) {
      return;
    }
    try {
      const response = await api.setPromoCode({
        promoCodeName: cart?.promo_code?.promo_code,
        amount: cart?.cartSubTotal,
      });
      if (response.status == 1) {
        dispatch(setCartPromo({ data: response.data }));
      } else {
        dispatch(clearCartPromo());
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    handleFilterTimeSlots();
  }, [checkout?.selectedDate, timeSlots]);

  const handleFetchCheckout = async () => {
    const couponseCodeId = cart?.promo_code?.promo_code_id;
    const lat = checkout?.address?.latitude || city?.city?.latitude || 45.5017;
    const lng = checkout?.address?.longitude || city?.city?.longitude || -73.5673;
    try {
      if (!token || cart?.isGuest) {
        let activeGuestCart = cart?.guestCart;
        if (!activeGuestCart || activeGuestCart.length === 0) {
          try {
            const saved = typeof window !== "undefined" ? localStorage.getItem("soukday_cart") : null;
            if (saved) {
              const parsed = JSON.parse(saved);
              if (Array.isArray(parsed) && parsed.length > 0) {
                activeGuestCart = parsed.map((item) => ({
                  id: item.product.id,
                  product_id: item.product.id,
                  product_variant_id: item.product.variant_id || item.product.variantId || item.product.id,
                  qty: item.quantity,
                  quantity: item.quantity,
                  price: item.product.price,
                  productPrice: item.product.price,
                  title: item.product.name,
                  name: item.product.name,
                  image_url: item.product.image,
                  image: item.product.image,
                  module_id: 1,
                }));
                dispatch(addtoGuestCart({ data: activeGuestCart }));
              }
            }
          } catch (e) {}
        }

        if (activeGuestCart && activeGuestCart.length > 0) {
          const response = await api.getGuestCart({
            latitude: lat,
            longitude: lng,
            variant_ids: activeGuestCart.map(i => i.product_variant_id || i.variant_id || i.id).join(","),
            quantities: activeGuestCart.map(i => i.quantity || i.qty || 1).join(","),
          });
          if (response?.status == 1) {
            const subTotal = Number(response?.data?.sub_total || 0);
            const deliveryCharge = Number(response?.data?.delivery_charge || 0);
            const effectiveDelivery = checkout?.orderType === "doorstep" ? deliveryCharge : 0;
            const guestCheckoutData = {
              cart: response?.data?.cart || [],
              sub_total: subTotal,
              total_amount: subTotal + effectiveDelivery,
              delivery_charge: {
                total_delivery_charge: effectiveDelivery
              },
              seller_self_pickup: response?.data?.seller_self_pickup || null,
              product_variant_id: activeGuestCart.map(i => i.product_variant_id || i.variant_id || i.id),
              quantity: activeGuestCart.map(i => i.quantity || i.qty || 1),
            };
            if (response?.data?.doorstep_delivery_mode !== undefined) {
              dispatch(setDoorStepDeliveryMode({ data: response.data.doorstep_delivery_mode }));
            }
            if (response?.data?.self_pickup_mode !== undefined) {
              dispatch(setSelfPickupMode({ data: response.data.self_pickup_mode }));
            }
            dispatch(setCartCheckout({ data: guestCheckoutData }));
            dispatch(setCheckoutTotal({ data: guestCheckoutData.total_amount }));
            setCheckoutData(guestCheckoutData);
            setCheckOutError(false);
            return;
          }
        }
        setCheckOutError(false);
        return;
      }
      const response = await api.getCart({
        latitude: lat,
        longitude: lng,
        checkout: 1,
        promocode_id: couponseCodeId,
        order_type: checkout?.orderType,
        is_free_delivery: checkout?.timeSlot?.is_free_delivery,
      });
      if (response?.status == 1) {
        if (response?.data?.doorstep_delivery_mode !== undefined) {
          dispatch(setDoorStepDeliveryMode({ data: response.data.doorstep_delivery_mode }));
        }
        if (response?.data?.self_pickup_mode !== undefined) {
          dispatch(setSelfPickupMode({ data: response.data.self_pickup_mode }));
        }
        dispatch(setCartCheckout({ data: response?.data }));
        dispatch(setCheckoutTotal({ data: response?.data?.total_amount }));
        setCheckoutData(response?.data);
        setCheckOutError(false);
      } else {
        setCheckOutError(true);
        setCheckOutErrorMsg(response?.message);
      }
    } catch (error) {
      console.log("Error", error);
      setCheckOutError(false);
    }
  };

  const handleSelectedDate = (date) => {
    const currentDate = new Date();
    const finalDate = currentDate.setHours(0, 0, 0, 0);
    if (date < finalDate) {
      toast.info(t("please_select_valid_date"));
    }

    dispatch(setSelectedDate({ data: date }));
    dispatch(setTimeSlot({ data: null }));
    setIsPopoverOpen(false);
    handleFilterTimeSlots(date);
  };

  const formatDate = (date) => {
    if (timeSlotsData?.time_slots_is_enabled == "true") {
      if (!date) return t("choose_date");
      return new Date(date).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(
        tomorrow.getDate() + parseInt(timeSlotsData.delivery_estimate_days),
      );
      const finalDate = tomorrow.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
      dispatch(setSelectedDate({ data: finalDate }));
      return finalDate;
    }
  };

  const fetchAddress = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await api.getAddress();
      if (response.status == 1) {
        dispatch(setAllAddresses({ data: response.data }));
        const defaultAddress = response?.data?.find(
          (address) => address.is_default == 1,
        );
        if (checkout?.address != null) {
          setLoading(false);
          return;
        } else if (!defaultAddress) {
          dispatch(setAddress({ data: response?.data[0] }));
        } else {
          dispatch(setAddress({ data: defaultAddress }));
        }
        setLoading(false);
      } else {
        setLoading(false);
        dispatch(setAllAddresses({ data: [] }));
      }
    } catch (error) {
      setLoading(false);
      console.log("Error", error);
    }
  };

  const handleFilterTimeSlots = (dateParam) => {
    const activeDate = dateParam || checkout?.selectedDate || new Date();
    const currentDate = new Date();
    const userSelectedDate = new Date(activeDate);

    const updatedTimeSlots = (timeSlots || []).map((slot) => {
      const lastOrderTime = new Date(activeDate);
      if (slot?.last_order_time) {
        const [hours, minutes, seconds] = slot.last_order_time
          .split(":")
          .map(Number);
        lastOrderTime.setHours(hours || 0, minutes || 0, seconds || 0);
      }

      const isToday =
        userSelectedDate.toDateString() === currentDate.toDateString();
      const isDisabled = isToday && currentDate >= lastOrderTime;

      return {
        ...slot,
        isDisabled,
      };
    });

    setAvailableTimeSlot(updatedTimeSlots);

    const firstAvailable = updatedTimeSlots.find((s) => !s.isDisabled);
    if (firstAvailable && !checkout?.timeSlot) {
      dispatch(setTimeSlot({ data: firstAvailable }));
      setSelectedTimeSlot(firstAvailable);
    }
  };

  const handleFetchTimeSlots = async (selectedDate) => {
    try {
      const response = await api.getTimeSlots();
      const allTimeSlots = response?.data?.time_slots || [];
      setTimeSlotsData(response?.data);
      setTimeSlots(allTimeSlots);

      let initialDate = selectedDate || checkout?.selectedDate;
      if (!initialDate) {
        const d = new Date();
        const estimateDays = parseInt(response?.data?.delivery_estimate_days || 1, 10);
        d.setDate(d.getDate() + Math.max(0, estimateDays - 1));
        initialDate = d;
        dispatch(setSelectedDate({ data: d }));
      }

      handleFilterTimeSlots(initialDate);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleTimeSlotChange = (value) => {
    if (value.isDisabled == true) {
      toast.error(t("please_select_valid_time_slot"));
      return;
    }
    setSelectedTimeSlot(value);
    dispatch(setTimeSlot({ data: value }));
  };

  const handleOrderType = (value) => {
    dispatch(setOrderType({ data: value }));
  };

  const handleChangeOrderNote = (e) => {
    dispatch(setOrderNote({ data: e.target.value }));
    setDeliveryForm((prev) => ({ ...prev, deliveryNotes: e.target.value }));
  };

  const handleDeliveryFormChange = (e) => {
    const { name, value } = e.target;
    setDeliveryForm((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (name === "deliveryNotes") {
      dispatch(setOrderNote({ data: value }));
    }
  };

  const validateDeliveryForm = () => {
    const errors = {};
    if (!deliveryForm.name || !deliveryForm.name.trim()) {
      errors.name = t("name_required") || "Full name is required";
    }
    if (!deliveryForm.phone || !deliveryForm.phone.trim()) {
      errors.phone = t("phone_required") || "Phone number is required";
    }
    if (!deliveryForm.email || !deliveryForm.email.trim()) {
      errors.email = t("email_required") || "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(deliveryForm.email.trim())) {
      errors.email = t("valid_email_required") || "Please enter a valid email address";
    }

    if (checkout?.orderType === "doorstep") {
      if (!deliveryForm.street || !deliveryForm.street.trim()) {
        errors.street = t("street_required") || "Street address is required";
      }
      if (!deliveryForm.city || !deliveryForm.city.trim()) {
        errors.city = t("city_required") || "City is required";
      }
      if (!deliveryForm.postalCode || !deliveryForm.postalCode.trim()) {
        errors.postalCode = t("postal_required") || "Postal code is required";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveInlineAddressAndContinue = () => {
    if (checkOutError) {
      toast.error(checkOutErrorMsg);
      return;
    }
    if (!validateDeliveryForm()) {
      toast.error(t("please_fill_all_required_fields") || "Please fill in all required fields");
      return;
    }
    const fullStreet = deliveryForm.street.trim();
    const fullAddress = deliveryForm.apartment.trim()
      ? `${deliveryForm.apartment.trim()}, ${fullStreet}`
      : fullStreet;

    const customAddress = {
      id: 0,
      name: deliveryForm.name.trim(),
      mobile: deliveryForm.phone.trim(),
      email: deliveryForm.email.trim(),
      address: fullAddress,
      street: fullStreet,
      landmark: deliveryForm.apartment.trim(),
      city: deliveryForm.city.trim(),
      state: deliveryForm.state.trim() || "QC",
      pincode: deliveryForm.postalCode.trim(),
      country: "Canada",
      latitude: city?.city?.latitude || 45.5017,
      longitude: city?.city?.longitude || -73.5673,
      is_default: 1,
    };

    dispatch(setAddress({ data: customAddress }));
    if (deliveryForm.deliveryNotes) {
      dispatch(setOrderNote({ data: deliveryForm.deliveryNotes }));
    }
    dispatch(setCurrentStep({ data: 2 }));
  };

  const handleShowAddress = () => {
    setIsAddressSelected(false);
    setShowAddAddres(true);
  };

  const handleFirstStep = () => {
    if (checkOutError) {
      toast.error(checkOutErrorMsg);
      return;
    }
    if (!checkout?.address) {
      toast.error(t("please_select_address") || "Please select a delivery address");
      return;
    }
    dispatch(setCurrentStep({ data: 2 }));
  };

  const handleSecondStep = () => {
    if (
      checkout?.selectedDate == null &&
      timeSlotsData?.time_slot_setting == "true"
    ) {
      toast.error(t("please_select_date"));
      return;
    } else if (
      timeSlotsData?.time_slots_is_enabled == "true" &&
      checkout?.timeSlot == null
    ) {
      toast.error(t("please_select_time_slot"));
      return;
    }

    dispatch(setCurrentStep({ data: 3 }));
  };

  const handlePickupOrderStep = () => {
    if (checkOutError) {
      toast.error(t(checkOutErrorMsg));
      return;
    }
    if (!validateDeliveryForm()) {
      toast.error(t("please_fill_all_required_fields") || "Please fill in your contact information");
      return;
    }
    const pickupContactAddress = {
      id: 0,
      name: deliveryForm.name.trim(),
      mobile: deliveryForm.phone.trim(),
      email: deliveryForm.email.trim(),
      address: checkoutData?.seller_self_pickup?.pickup_store_address || "Store Pickup",
      street: checkoutData?.seller_self_pickup?.pickup_store_address || "Store Pickup",
      city: deliveryForm.city.trim() || "Montréal",
      state: deliveryForm.state.trim() || "QC",
      pincode: deliveryForm.postalCode.trim() || "H2X 1Y4",
      order_type: "selfpickup",
    };
    dispatch(setAddress({ data: pickupContactAddress }));
    if (deliveryForm.deliveryNotes) {
      dispatch(setOrderNote({ data: deliveryForm.deliveryNotes }));
    }
    dispatch(setCurrentStep({ data: 3 }));
  };

  const handleSummaryAction = () => {
    handlePlaceOrder();
  };

  const formatDateToDDMMYYYY = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatDateWithTimeSlot = (date, timeSlot) => {
    const formattedDate = formatDateToDDMMYYYY(date);
    return timeSlot
      ? `${formattedDate} ${timeSlot.default_title}`
      : formattedDate;
  };

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      // document.body.appendChild(script);
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  const handleRozarpayPayment = async (
    order_id,
    razorpay_transaction_id,
    amount,
    capilizePaymeneMethod,
  ) => {
    try {
      const res = await initializeRazorpay();
      if (!res) {
        console.error("RazorPay SDK Load Failed");
        return;
      }
      const key = setting?.payment_setting?.razorpay_key;
      const convertedAmount = Math.floor(amount * 100);
      const options = {
        key: key,
        amount: convertedAmount,
        currency: "INR",
        name: user?.user?.name,
        description: setting?.setting?.app_name,
        image: setting?.setting?.web_settings.web_logo,
        order_id: razorpay_transaction_id,
        handler: async (res) => {
          if (res.razorpay_payment_id) {
            try {
              setPaymentLoading(true);
              const response = await api.addTransaction({
                orderId: order_id,
                transactionId: res.razorpay_payment_id,
                paymentMethod: capilizePaymeneMethod,
                type: "order",
              });
              if (response.status === 1) {
                setPaymentLoading(false);
                return router.push(
                  `/web-payment-status?status=success&type=order&payment_method=${checkout?.selectedPaymentMethod}&order_id=${order_id}`,
                );
              } else {
                setPaymentLoading(false);
                toast.error(response.message);
              }
            } catch (error) {
              console.error("Transaction error:", error);
            }
          }
        },
        modal: {
          confirm_close: true,
          ondismiss: async (reason) => {
            if (reason === undefined) {
              await handleRazorpayCancel(order_id);
              // dispatch(deductUserBalance({ data: walletDeductionAmt || 0 }));
            }
          },
        },
        prefill: {
          name: user?.user?.name,
          email: user?.user?.email,
          contact: user?.user?.mobile,
        },
        notes: {
          address: "Razorpay Corporate",
        },
        theme: {
          color: setting?.setting?.web_settings.color,
        },
      };

      const rzpay = new window.Razorpay(options);
      rzpay.on("payment.cancel", (response) => {
        handleRazorpayCancel(order_id);
      });
      rzpay.on("payment.failed", (response) => {
        api.deleteOrder({ orderId: order_id });
      });
      rzpay.open();
    } catch (error) {
      console.error("Error initializing Razorpay:", error);
    }
  };

  const handleRazorpayCancel = async (order_id) => {
    await api.deleteOrder({ orderId: order_id });
  };

  const handlePayStackPayment = async (
    orderId,
    amount,
    capilizePaymeneMethod,
  ) => {
    try {
      const handler = PaystackPop.setup({
        key:
          setting.payment_setting &&
          setting.payment_setting.paystack_public_key,
        email: user && user?.email,
        amount: parseFloat(amount) * 100,
        currency:
          setting?.payment_setting &&
          setting?.payment_setting?.paystack_currency_code,
        ref: new Date().getTime().toString(),
        label: setting?.setting && setting?.setting?.support_email,
        onClose: function () {
          api.deleteOrder({ orderId: orderId });
          // setWalletAmount(user.user.balance);
          // dispatch(setWallet({ data: 0 }));
        },
        callback: async function (res) {
          try {
            setPaymentLoading(true);
            const response = await api.addTransaction({
              orderId: orderId,
              transactionId: res.reference,
              paymentMethod: capilizePaymeneMethod,
              type: "order",
            });
            if (response.status == 1) {
              setPaymentLoading(false);
              return router.push(
                `/web-payment-status?status=success&type=order&payment_method=${checkout?.selectedPaymentMethod}&order_id=${orderId}`,
              );
            } else {
              setPaymentLoading(false);
              toast.error(response.message);
            }
          } catch (error) {
            console.log("Error", error);
          }
        },
      });
      handler.openIframe();
    } catch (error) {
      console.log("Paytabs Error", error);
    }
  };

  const handlePlaceOrder = async () => {
    const deliveryDateStr =
      checkout?.orderType === "selfpickup"
        ? "Self Pickup"
        : checkout?.selectedDate
        ? formatDateWithTimeSlot(checkout?.selectedDate, checkout?.timeSlot)
        : "Standard Delivery";

    const activePaymentMethod = checkout?.selectedPaymentMethod || "COD";
    const capilizePaymeneMethod =
      activePaymentMethod === "dpo"
        ? "DPO"
        : String(activePaymentMethod).charAt(0).toUpperCase() +
          String(activePaymentMethod).slice(1);
    const status =
      activePaymentMethod === "COD" || activePaymentMethod === "wallet"
        ? 2
        : 1;

    try {
      if (checkout?.orderType === "doorstep") {
        const hasSavedSelected =
          address?.allAddresses?.length > 0 &&
          !isEnteringNewAddress &&
          checkout?.address?.id &&
          Number(checkout?.address?.id) > 0;

        if (!hasSavedSelected) {
          if (!validateDeliveryForm()) {
            toast.error(
              t("please_fill_all_required_fields") ||
                "Please fill in all required delivery fields",
            );
            if (typeof document !== "undefined") {
              const el = document.getElementById("checkout-delivery-section");
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
            return;
          }
          const syntheticAddress = {
            id: 0,
            name: deliveryForm.name.trim(),
            mobile: deliveryForm.phone.trim(),
            email: deliveryForm.email.trim(),
            address: `${deliveryForm.street.trim()}${
              deliveryForm.apartment.trim() ? `, ${deliveryForm.apartment.trim()}` : ""
            }`,
            street: deliveryForm.street.trim(),
            landmark: deliveryForm.apartment.trim() || "",
            city: deliveryForm.city.trim() || "Montréal",
            state: deliveryForm.state.trim() || "QC",
            pincode: deliveryForm.postalCode.trim() || "H2X 1Y4",
            order_type: "doorstep",
          };
          dispatch(setAddress({ data: syntheticAddress }));
        }
      } else {
        if (!validateDeliveryForm()) {
          toast.error(
            t("please_fill_all_required_fields") ||
              "Please fill in your contact information",
          );
          return;
        }
        const pickupContactAddress = {
          id: 0,
          name: deliveryForm.name.trim(),
          mobile: deliveryForm.phone.trim(),
          email: deliveryForm.email.trim(),
          address: checkoutData?.seller_self_pickup?.pickup_store_address || "Store Pickup",
          street: checkoutData?.seller_self_pickup?.pickup_store_address || "Store Pickup",
          city: deliveryForm.city.trim() || "Montréal",
          state: deliveryForm.state.trim() || "QC",
          pincode: deliveryForm.postalCode.trim() || "H2X 1Y4",
          order_type: "selfpickup",
        };
        dispatch(setAddress({ data: pickupContactAddress }));
      }

      if (!activePaymentMethod) {
        toast.error(t('please_select_payment_method') || "Please select a payment method");
        return;
      }

      setCheckoutLoading(true);

      let rawVariantIds =
        cart?.checkout?.product_variant_id ??
        checkoutData?.product_variant_id ??
        cart?.guestCart?.map((i) => i.variant_id || i.product_variant_id || i.id) ??
        cart?.cartProducts?.map((i) => i.product_variant_id || i.id);

      let rawQuantities =
        cart?.checkout?.quantity ??
        checkoutData?.quantity ??
        cart?.guestCart?.map((i) => i.quantity || 1) ??
        cart?.cartProducts?.map((i) => i.qty || 1);

      if ((!rawVariantIds || (Array.isArray(rawVariantIds) && rawVariantIds.length === 0)) && typeof window !== "undefined") {
        try {
          const savedCart = localStorage.getItem("soukday_cart");
          if (savedCart) {
            const parsed = JSON.parse(savedCart);
            if (Array.isArray(parsed) && parsed.length > 0) {
              rawVariantIds = parsed.map(i => i.product.variant_id || i.product.variantId || i.product.id);
              rawQuantities = parsed.map(i => i.quantity || 1);
            }
          }
        } catch (e) {}
      }

      const variantIdsStr = Array.isArray(rawVariantIds)
        ? rawVariantIds.join(",")
        : String(rawVariantIds || "");

      const quantitiesStr = Array.isArray(rawQuantities)
        ? rawQuantities.join(",")
        : String(rawQuantities || "");

      const subTotalVal =
        cart?.checkout?.sub_total ??
        checkoutData?.sub_total ??
        cart?.cartSubTotal ??
        0;

      const deliveryChargeVal =
        checkout?.orderType === "selfpickup"
          ? 0
          : (cart?.checkout?.delivery_charge?.total_delivery_charge ??
             checkoutData?.delivery_charge?.total_delivery_charge ??
             0);

      const finalTotalVal =
        checkout?.checkoutTotal ??
        checkoutData?.total_amount ??
        (Number(subTotalVal) + Number(deliveryChargeVal));

      const response = await api.placeOrder({
        productVariantId: variantIdsStr,
        quantity: quantitiesStr,
        total: subTotalVal,
        deliveryCharge: deliveryChargeVal,
        finalTotal: finalTotalVal,
        walletUsed: checkout?.isWalletChecked,
        walletBalance: checkout?.usedWalletBalance,
        addressId: checkout?.address?.id || 0,
        deliveryTime: deliveryDateStr,
        orderNote: checkout?.orderNote || deliveryForm.deliveryNotes || "",
        paymentMethod: activePaymentMethod,
        promocodeId: cart?.promo_code?.promo_code_id || 0,
        status: status,
        order_type: checkout?.orderType || "doorstep",
        prescriptionGroups: checkout?.prescriptionGroups?.map((g) => ({
          productVariantIds: g.productIds,
          images: g.images?.map((img) => img.file),
        })),
        address: checkout?.address?.address || checkout?.address?.street || deliveryForm.street,
        name: checkout?.address?.name || deliveryForm.name,
        mobile: checkout?.address?.mobile || deliveryForm.phone,
        email: checkout?.address?.email || deliveryForm.email,
        city: checkout?.address?.city || deliveryForm.city || "Montréal",
        pincode: checkout?.address?.pincode || deliveryForm.postalCode || "H2X 1Y4",
        state: checkout?.address?.state || deliveryForm.state || "QC",
        landmark: checkout?.address?.landmark || deliveryForm.apartment || "",
      });

      if (response?.status == 1) {
        // Immediately empty cart from context, localStorage, and Redux
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
          dispatch(setOrderNote(""));
        } catch (clearErr) {
          console.error("Cart clear error:", clearErr);
        }

        setCheckoutLoading(false);
        const placedOrderId = response?.data?.order_id;
        setOrderId(placedOrderId);
        await handleInitiateTransaction(
          placedOrderId,
          activePaymentMethod,
        );
      } else {
        setCheckoutLoading(false);
        toast.error(response?.message || "Could not place order. Please try again.");
      }
    } catch (error) {
      setCheckoutLoading(false);
      console.error("Place Order Error:", error);
      const serverMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to place order. Please try again.";
      toast.error(serverMsg);
    }
  };

  const handleInitiateTransaction = async (
    currentOrderID,
    paymentMethodParam,
  ) => {
    try {
      const activeMethod = (
        paymentMethodParam ||
        checkout?.selectedPaymentMethod ||
        "COD"
      ).toString().toUpperCase();

      if (activeMethod === "COD") {
        // redirect after successfull COD order
        return router.push(
          `/web-payment-status?status=success&type=order&payment_method=COD&order_id=${currentOrderID || ""}`,
        );
      } else if (activeMethod === "WALLET") {
        // redirect after successfull wallet order
        return router.push(
          `/web-payment-status?status=success&type=order&payment_method=wallet&order_id=${currentOrderID || ""}`,
        );
      } else if (activeMethod === "PAYSTACK") {
        handlePayStackPayment(
          currentOrderID,
          checkout?.checkoutTotal,
          paymentMethodParam || "Paystack",
        );
      } else {
        const response = await api.initiateTrasaction({
          orderId: currentOrderID,
          paymentMethod: paymentMethodParam || activeMethod,
          type: "order",
        });
        if (response.status == 1) {
          if (checkout?.selectedPaymentMethod == "phonepe") {
            dispatch(setPhonePeCheckoutDetails(response?.data));
          }
          if (checkout?.selectedPaymentMethod == "razorpay") {
            handleRozarpayPayment(
              currentOrderID,
              response?.data?.transaction_id,
              checkout?.checkoutTotal,
              capilizePaymeneMethod,
            );
          } else if (checkout?.selectedPaymentMethod == "stripe") {
            setStripeOrderId(currentOrderID);
            setStripeClientSecret(response?.data?.client_secret);
            setStripeTransactionId(response?.data?.id);
            setShowStripe(true);
          } else {
            dispatch(clearCartPromo());
            //  payment methods redirect urls
            const paymentUrls = {
              cashfree: response?.data?.redirectUrl,
              phonepe: response?.data?.redirectUrl,
              paytabs: response?.data?.redirectUrl,
              paypal: response?.data?.paypal_redirect_url,
              midtrans: response?.data?.snapUrl,
              dpo: response?.data?.redirectUrl,
            };
            // Select specific paymentUrls
            const redirectUrl = paymentUrls[checkout?.selectedPaymentMethod];
            if (redirectUrl) {
              router.push(redirectUrl);
            } else {
              console.error(
                "Unsupported payment method:",
                selectedPaymentMethod,
              );
            }
          }
        } else {
          // setIsOrderPlaced(false)
          await api.deleteOrder({ orderId: orderId });
          toast.error(response?.message);
        }
      }
    } catch (error) {
      console.log(("Error", error));
    }
  };

  const handleLocationRedirect = (lat, lng) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
  };

  const handleOptionsClick = (type) => {
    if (type == "doorstep" && cart?.doorstep_delivery_mode == 0) {
      toast.error(t("doorStepDeliveryDisableNote"));
    } else if (type == "selfpickup" && cart?.self_pickup_mode == 0) {
      toast.error(t("selfPickUpDisabledNote"));
    } else {
      return;
    }
  };

  return loading == true ? (
    <CheckoutSkeleton />
  ) : (
    <section>
      <BreadCrumb />
      <div className="container px-2">
        {paymentLoading ? (
          <CheckoutSkeleton />
        ) : (
          <div className="flex justify-center flex-col items-center">
            <div className="w-full flex justify-end mb-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#e06836] dark:text-[#FF7A45] bg-[#FFF5EF] dark:bg-[#F68B62]/10 px-3.5 py-1.5 rounded-full border border-[#FF7A45]/30 dark:border-[#F68B62]/30 w-fit">
                <span>🔒</span>
                <span>{t("secure_checkout_guaranteed") || "Paiement sécurisé SSL 256-bit"}</span>
              </div>
            </div>
            <div className="w-full">
              <div className="grid grid-cols-12 gap-2 md:gap-6">
                <div className="col-span-12 md:col-span-8 lg:col-span-9 space-y-6">
                  {/* Step 1: Delivery Method & Address Section */}
                  <div id="checkout-delivery-section">
                    <div className="flex flex-col cardBorder rounded-lg mb-4 backgroundColor p-4 md:p-5 gap-4">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full primaryBackColor text-white flex items-center justify-center font-bold text-sm">1</span>
                        <h2 className="font-bold text-base md:text-xl text-gray-900 dark:text-gray-100">
                          {t("choose_delivery_method")}
                        </h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div
                          className="flex flex-col"
                          onClick={() => handleOptionsClick("doorstep")}
                        >
                          <label className="flex items-center gap-3 p-4 border rounded-md cursor-pointer  transition bodyBackgroundColor">
                            <input
                              type="radio"
                              name="delivery"
                              value="doorstep"
                              checked={checkout?.orderType == "doorstep"}
                              className="primaryAccentColor scale-150"
                              disabled={cart?.doorstep_delivery_mode == 0}
                              onChange={(e) => handleOrderType(e.target.value)}
                            />
                            <div className="flex items-center gap-3">
                              <div className=" rounded-md  primaryFilledColor addToCartColor p-3 dark:text-black">
                                <FiTruck size={22} />
                              </div>
                              <div>
                                <p className="font-bold">
                                  {t("home_delivery")}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {t("get_it_deliverd_to_your_address")}
                                </p>
                              </div>
                            </div>
                          </label>
                        </div>
                        <div
                          className="flex flex-col"
                          onClick={() => handleOptionsClick("selfpickup")}
                        >
                          <label className="flex items-center gap-3 p-4 border rounded-md cursor-pointer transition bodyBackgroundColor peer-disabled:disabledBackgroundColor">
                            <input
                              type="radio"
                              name="delivery"
                              value="selfpickup"
                              disabled={cart?.self_pickup_mode == 0}
                              checked={checkout?.orderType == "selfpickup"}
                              className="primaryAccentColor scale-150"
                              onChange={(e) => handleOrderType(e.target.value)}
                            />

                            <div className="flex items-center gap-3">
                              <div className="p-3 rounded-md primaryFilledColor addToCartColor dark:text-black">
                                <MdOutlineStorefront size={22} />
                              </div>
                              <div>
                                <p className="font-bold">{t("store_pickup")}</p>
                                <p className="text-sm text-gray-500">
                                  {t("pick_up_from_store")}
                                </p>
                              </div>
                            </div>
                          </label>
                          {cart?.self_pickup_mode == 0 && (
                            <p className="text-xs text-red-600 px-2 my-1">
                              {t("selfPickUpDisabledNote")}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {checkout?.orderType == "doorstep" ? (
                      <div className="flex flex-col cardBorder rounded-lg mb-4 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
                        <div className="flex justify-between items-center backgroundColor py-4 px-4 md:px-5 border-b border-gray-200 dark:border-zinc-700">
                          <div>
                            <span className="font-bold text-base md:text-xl text-gray-900 dark:text-gray-100 block">
                              {address?.allAddresses?.length > 0 && !isEnteringNewAddress
                                ? t("choose_delivery_address")
                                : (t("delivery_details") || "Delivery Details & Address")}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 block mt-0.5">
                              {address?.allAddresses?.length > 0 && !isEnteringNewAddress
                                ? (t("select_saved_address") || "Select a saved address for your delivery")
                                : (t("enter_contact_and_address") || "Enter your contact info and delivery address")}
                            </span>
                          </div>

                          {address?.allAddresses?.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setIsEnteringNewAddress(!isEnteringNewAddress)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-[#FF7A45] text-[#FF7A45] hover:bg-[#FFF5EF] dark:hover:bg-[#F68B62]/10 transition-colors"
                            >
                              {isEnteringNewAddress ? (
                                <>
                                  <IoArrowBack size={14} />
                                  <span>{t("use_saved_address") || "Use Saved Address"}</span>
                                </>
                              ) : (
                                <>
                                  <GoPlus size={16} />
                                  <span>{t("enter_new_address") || "Enter New Address"}</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        {address?.allAddresses?.length > 0 && !isEnteringNewAddress ? (
                          <>
                            <div className="flex flex-col p-4 gap-3">
                              {address?.allAddresses?.map((addr) => {
                                return (
                                  <div key={addr?.id}>
                                    <AddressCard
                                      address={addr}
                                      setShowAddAddres={setShowAddAddres}
                                      setIsAddressSelected={setIsAddressSelected}
                                      fetchAddress={fetchAddress}
                                    />
                                  </div>
                                );
                              })}
                            </div>
                            <div className="flex justify-between items-center p-4 border-t border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800/30">
                              <button
                                type="button"
                                onClick={() => setIsEnteringNewAddress(true)}
                                className="text-sm font-medium text-[#FF7A45] hover:underline flex items-center gap-1"
                              >
                                <GoPlus /> {t("enter_different_address") || "Enter a different address"}
                              </button>
                              <button
                                type="button"
                                onClick={handleFirstStep}
                                className="text-white primaryBackColor px-6 py-2.5 rounded-md text-base font-semibold shadow-sm hover:opacity-95 transition-opacity"
                              >
                                {t("continue")}
                              </button>
                            </div>
                          </>
                        ) : (
                          /* Inline Delivery & Contact Details Form */
                          <div className="p-4 md:p-6 space-y-6">
                            {/* Contact Information Section */}
                            <div>
                              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100 dark:border-zinc-800">
                                <span className="w-6 h-6 rounded-full bg-[#FCEFEA] dark:bg-[#F68B62]/20 text-[#FF7A45] dark:text-[#FF7A45] flex items-center justify-center text-xs font-bold">1</span>
                                <h3 className="font-semibold text-sm md:text-base text-gray-900 dark:text-gray-100">
                                  {t("contact_information") || "Contact Information"}
                                </h3>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                    {t("name") || "Full Name"} <span className="text-red-500">*</span>
                                  </label>
                                  <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                      <FiUser size={16} />
                                    </div>
                                    <input
                                      type="text"
                                      name="name"
                                      value={deliveryForm.name}
                                      onChange={handleDeliveryFormChange}
                                      placeholder="e.g. Jean Tremblay"
                                      className={`w-full pl-9 pr-3 py-2 rounded-md border text-sm outline-none transition-all ${
                                        formErrors.name
                                          ? "border-red-500 bg-red-50/20"
                                          : "border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:border-[#FF7A45] focus:ring-1 focus:ring-[#FF7A45]"
                                      }`}
                                    />
                                  </div>
                                  {formErrors.name && (
                                    <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>
                                  )}
                                </div>

                                <div>
                                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                    {t("phone") || "Phone Number"} <span className="text-red-500">*</span>
                                  </label>
                                  <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                      <FiPhone size={16} />
                                    </div>
                                    <input
                                      type="tel"
                                      name="phone"
                                      value={deliveryForm.phone}
                                      onChange={handleDeliveryFormChange}
                                      placeholder="e.g. (514) 555-0199"
                                      className={`w-full pl-9 pr-3 py-2 rounded-md border text-sm outline-none transition-all ${
                                        formErrors.phone
                                          ? "border-red-500 bg-red-50/20"
                                          : "border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:border-[#FF7A45] focus:ring-1 focus:ring-[#FF7A45]"
                                      }`}
                                    />
                                  </div>
                                  {formErrors.phone && (
                                    <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>
                                  )}
                                </div>

                                <div className="md:col-span-2">
                                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                    {t("email") || "Email Address"} <span className="text-red-500">*</span>
                                    <span className="text-[11px] font-normal text-gray-500 ml-1">({t("for_order_receipt") || "for receipt and live tracking"})</span>
                                  </label>
                                  <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                      <FiMail size={16} />
                                    </div>
                                    <input
                                      type="email"
                                      name="email"
                                      value={deliveryForm.email}
                                      onChange={handleDeliveryFormChange}
                                      placeholder="e.g. jean.tremblay@example.com"
                                      className={`w-full pl-9 pr-3 py-2 rounded-md border text-sm outline-none transition-all ${
                                        formErrors.email
                                          ? "border-red-500 bg-red-50/20"
                                          : "border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:border-[#FF7A45] focus:ring-1 focus:ring-[#FF7A45]"
                                      }`}
                                    />
                                  </div>
                                  {formErrors.email && (
                                    <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Delivery Address Section */}
                            <div>
                              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100 dark:border-zinc-800">
                                <span className="w-6 h-6 rounded-full bg-[#FCEFEA] dark:bg-[#F68B62]/20 text-[#FF7A45] dark:text-[#FF7A45] flex items-center justify-center text-xs font-bold">2</span>
                                <h3 className="font-semibold text-sm md:text-base text-gray-900 dark:text-gray-100">
                                  {t("delivery_address") || "Delivery Address"}
                                </h3>
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                    {t("street_address") || "Street Address"} <span className="text-red-500">*</span>
                                  </label>
                                  <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                      <FiMapPin size={16} />
                                    </div>
                                    <input
                                      type="text"
                                      name="street"
                                      value={deliveryForm.street}
                                      onChange={handleDeliveryFormChange}
                                      placeholder="e.g. 1234 Rue Sainte-Catherine Ouest"
                                      className={`w-full pl-9 pr-3 py-2 rounded-md border text-sm outline-none transition-all ${
                                        formErrors.street
                                          ? "border-red-500 bg-red-50/20"
                                          : "border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:border-[#FF7A45] focus:ring-1 focus:ring-[#FF7A45]"
                                      }`}
                                    />
                                  </div>
                                  {formErrors.street && (
                                    <p className="text-xs text-red-500 mt-1">{formErrors.street}</p>
                                  )}
                                </div>

                                <div>
                                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                    {t("apartment_suite_unit") || "Apt, Suite, Unit, Buzzer"} <span className="text-[11px] font-normal text-gray-500">({t("optional") || "Optional"})</span>
                                  </label>
                                  <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                      <FiHome size={16} />
                                    </div>
                                    <input
                                      type="text"
                                      name="apartment"
                                      value={deliveryForm.apartment}
                                      onChange={handleDeliveryFormChange}
                                      placeholder="e.g. Apt 4B, Buzzer #1042"
                                      className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm outline-none focus:border-[#FF7A45] focus:ring-1 focus:ring-[#FF7A45] transition-all"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                      {t("city") || "City"} <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      name="city"
                                      value={deliveryForm.city}
                                      onChange={handleDeliveryFormChange}
                                      placeholder="e.g. Montréal"
                                      className={`w-full px-3 py-2 rounded-md border text-sm outline-none transition-all ${
                                        formErrors.city
                                          ? "border-red-500 bg-red-50/20"
                                          : "border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:border-[#FF7A45] focus:ring-1 focus:ring-[#FF7A45]"
                                      }`}
                                    />
                                    {formErrors.city && (
                                      <p className="text-xs text-red-500 mt-1">{formErrors.city}</p>
                                    )}
                                  </div>

                                  <div>
                                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                      {t("province_state") || "Province / State"}
                                    </label>
                                    <input
                                      type="text"
                                      name="state"
                                      value={deliveryForm.state}
                                      onChange={handleDeliveryFormChange}
                                      placeholder="e.g. QC"
                                      className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm outline-none focus:border-[#FF7A45] focus:ring-1 focus:ring-[#FF7A45] transition-all"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                      {t("postal_code") || "Postal / ZIP Code"} <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      name="postalCode"
                                      value={deliveryForm.postalCode}
                                      onChange={handleDeliveryFormChange}
                                      placeholder="e.g. H2X 1Y4"
                                      className={`w-full px-3 py-2 rounded-md border text-sm outline-none uppercase transition-all ${
                                        formErrors.postalCode
                                          ? "border-red-500 bg-red-50/20"
                                          : "border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:border-[#FF7A45] focus:ring-1 focus:ring-[#FF7A45]"
                                      }`}
                                    />
                                    {formErrors.postalCode && (
                                      <p className="text-xs text-red-500 mt-1">{formErrors.postalCode}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Delivery Instructions Section */}
                            <div>
                              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100 dark:border-zinc-800">
                                <span className="w-6 h-6 rounded-full bg-[#FCEFEA] dark:bg-[#F68B62]/20 text-[#FF7A45] dark:text-[#FF7A45] flex items-center justify-center text-xs font-bold">3</span>
                                <h3 className="font-semibold text-sm md:text-base text-gray-900 dark:text-gray-100">
                                  {t("delivery_instructions") || "Delivery Instructions & Notes"}
                                </h3>
                              </div>
                              <div>
                                <textarea
                                  name="deliveryNotes"
                                  rows={3}
                                  value={deliveryForm.deliveryNotes}
                                  onChange={handleDeliveryFormChange}
                                  placeholder={t("delivery_instructions_placeholder") || "e.g. Leave at front door, ring doorbell, call upon arrival, gate code 1234"}
                                  maxLength={256}
                                  className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm outline-none focus:border-[#FF7A45] focus:ring-1 focus:ring-[#FF7A45] transition-all resize-none"
                                />
                                <p className="text-[11px] text-gray-400 text-right mt-1">
                                  {(deliveryForm.deliveryNotes || "").length}/256
                                </p>
                              </div>
                            </div>

                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {/* Store Information Card */}
                        <div className="flex flex-col cardBorder rounded-lg bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
                          <div className="flex items-center gap-2 border-b border-gray-200 dark:border-zinc-700 p-4 backgroundColor">
                            <MdOutlineStorefront size={24} className="text-[#FF7A45]" />
                            <span className="font-bold text-base md:text-lg text-gray-900 dark:text-gray-100">
                              {t("pickup_from_store") || "Store Pickup Location"}
                            </span>
                          </div>
                          <div className="flex flex-col p-5 gap-5">
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex gap-3 items-start">
                                <IoLocationOutline size={24} className="text-[#FF7A45] mt-0.5 flex-shrink-0" />
                                <div className="flex flex-col gap-1">
                                  <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">
                                    {checkoutData?.seller_self_pickup?.seller_name || t("pickup_from_store") || "Soukday Partner Store"}
                                  </h3>
                                  <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {checkoutData?.seller_self_pickup?.pickup_store_address || t("address_not_available") || "Montreal, QC"}
                                  </p>
                                </div>
                              </div>
                              {checkoutData?.seller_self_pickup?.pickup_latitude && (
                                <button
                                  type="button"
                                  className="px-3.5 py-1.5 flex items-center text-xs font-semibold footer text-white rounded-md gap-1 hover:opacity-90 flex-shrink-0"
                                  onClick={() => {
                                    if (
                                      checkoutData?.seller_self_pickup?.pickup_latitude &&
                                      checkoutData?.seller_self_pickup?.pickup_longitude
                                    ) {
                                      handleLocationRedirect(
                                        checkoutData.seller_self_pickup.pickup_latitude,
                                        checkoutData.seller_self_pickup.pickup_longitude,
                                      );
                                    }
                                  }}
                                >
                                  <IoLocationOutline size={16} />
                                  {t("direction") || "Directions"}
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-gray-100 dark:border-zinc-800 text-sm">
                              {checkoutData?.seller_self_pickup?.seller_mobile && (
                                <div className="flex gap-2.5 items-center">
                                  <FiPhoneCall size={18} className="text-[#FF7A45] flex-shrink-0" />
                                  <div>
                                    <span className="text-xs text-gray-500 font-medium block">{t("phone") || "Store Phone"}</span>
                                    <span className="font-medium text-gray-800 dark:text-gray-200">{checkoutData.seller_self_pickup.seller_mobile}</span>
                                  </div>
                                </div>
                              )}
                              <div className="flex gap-2.5 items-center">
                                <MdOutlineWatchLater size={18} className="text-[#FF7A45] flex-shrink-0" />
                                <div>
                                  <span className="text-xs text-gray-500 font-medium block">{t("open_hours") || "Store Hours"}</span>
                                  <span className="font-medium text-gray-800 dark:text-gray-200">
                                    {checkoutData?.seller_self_pickup?.opening_time && checkoutData?.seller_self_pickup?.closing_time
                                      ? `${t("today") || "Today"}: ${checkoutData.seller_self_pickup.opening_time} - ${checkoutData.seller_self_pickup.closing_time}`
                                      : checkoutData?.seller_self_pickup?.opening_time
                                      ? `${t("today") || "Today"}: ${checkoutData.seller_self_pickup.opening_time}`
                                      : "9:00 AM - 9:00 PM"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Pickup Contact Information Form */}
                        <div className="flex flex-col cardBorder rounded-lg bg-white dark:bg-zinc-900 overflow-hidden shadow-sm p-4 md:p-6 space-y-4">
                          <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-zinc-800">
                            <span className="w-6 h-6 rounded-full bg-[#FCEFEA] dark:bg-[#F68B62]/20 text-[#FF7A45] dark:text-[#FF7A45] flex items-center justify-center text-xs font-bold">1</span>
                            <h3 className="font-semibold text-sm md:text-base text-gray-900 dark:text-gray-100">
                              {t("pickup_contact_information") || "Who will pick up this order?"}
                            </h3>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                {t("name") || "Full Name"} <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                  <FiUser size={16} />
                                </div>
                                <input
                                  type="text"
                                  name="name"
                                  value={deliveryForm.name}
                                  onChange={handleDeliveryFormChange}
                                  placeholder="e.g. Jean Tremblay"
                                  className={`w-full pl-9 pr-3 py-2 rounded-md border text-sm outline-none transition-all ${
                                    formErrors.name
                                      ? "border-red-500 bg-red-50/20"
                                      : "border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:border-[#FF7A45] focus:ring-1 focus:ring-[#FF7A45]"
                                  }`}
                                />
                              </div>
                              {formErrors.name && (
                                <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>
                              )}
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                {t("phone") || "Phone Number"} <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                  <FiPhone size={16} />
                                </div>
                                <input
                                  type="tel"
                                  name="phone"
                                  value={deliveryForm.phone}
                                  onChange={handleDeliveryFormChange}
                                  placeholder="e.g. (514) 555-0199"
                                  className={`w-full pl-9 pr-3 py-2 rounded-md border text-sm outline-none transition-all ${
                                    formErrors.phone
                                      ? "border-red-500 bg-red-50/20"
                                      : "border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:border-[#FF7A45] focus:ring-1 focus:ring-[#FF7A45]"
                                  }`}
                                />
                              </div>
                              {formErrors.phone && (
                                <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>
                              )}
                            </div>

                            <div className="md:col-span-2">
                              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                {t("email") || "Email Address"} <span className="text-red-500">*</span>
                                <span className="text-[11px] font-normal text-gray-500 ml-1">({t("for_pickup_ready_alert") || "for pickup confirmation and barcode receipt"})</span>
                              </label>
                              <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                  <FiMail size={16} />
                                </div>
                                <input
                                  type="email"
                                  name="email"
                                  value={deliveryForm.email}
                                  onChange={handleDeliveryFormChange}
                                  placeholder="e.g. jean.tremblay@example.com"
                                  className={`w-full pl-9 pr-3 py-2 rounded-md border text-sm outline-none transition-all ${
                                    formErrors.email
                                      ? "border-red-500 bg-red-50/20"
                                      : "border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:border-[#FF7A45] focus:ring-1 focus:ring-[#FF7A45]"
                                  }`}
                                />
                              </div>
                              {formErrors.email && (
                                <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
                              )}
                            </div>
                          </div>

                          <div className="pt-2">
                            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                              {t("order_note_title") || "Pickup Notes & Special Requests"} <span className="text-[11px] font-normal text-gray-500">({t("optional") || "Optional"})</span>
                            </label>
                            <textarea
                              name="deliveryNotes"
                              rows={2}
                              value={deliveryForm.deliveryNotes}
                              onChange={handleDeliveryFormChange}
                              placeholder={t("order_note") || "Add any specific instructions for store staff..."}
                              maxLength={256}
                              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm outline-none focus:border-[#FF7A45] focus:ring-1 focus:ring-[#FF7A45] transition-all resize-none"
                            />
                          </div>

                        </div>
                      </div>
                    )}
                  </div>
                  {/* End Step 1: Delivery Details */}

                  {/* Step 2: Preferred Delivery Schedule & Time slot (Only when time slots are enabled in settings) */}
                  {checkout?.orderType === "doorstep" &&
                    (timeSlotsData?.time_slot_setting === "true" ||
                      timeSlotsData?.time_slot_setting === true) && (
                    <div className="flex flex-col cardBorder rounded-lg bg-white dark:bg-zinc-900 shadow-sm overflow-hidden" id="checkout-schedule-section">
                      <div className="flex items-center gap-3 backgroundColor py-4 px-4 md:px-5 border-b border-gray-200 dark:border-zinc-700">
                        <span className="w-7 h-7 rounded-full primaryBackColor text-white flex items-center justify-center font-bold text-sm">
                          2
                        </span>
                        <div>
                          <h2 className="font-bold text-base md:text-xl text-gray-900 dark:text-gray-100">
                            {t("preferred_day_and_time") || "Créneau de livraison souhaité"}
                          </h2>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {t("select_delivery_slot_subtitle") || "Choisissez la date et le créneau horaire souhaités"}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col p-4 md:p-6 gap-6">
                        <div className="grid grid-cols-12 items-center gap-4">
                          <div className="col-span-12 md:col-span-6 flex flex-col gap-1">
                            <span className="text-base font-bold">
                              {timeSlotsData?.time_slots_is_enabled == "true"
                                ? t("preferred_delivery_day")
                                : t("estimage_delivery_date")}
                              <span className="text-red-500">*</span>
                            </span>

                            <Popover open={isPopoverOpen}>
                              <PopoverTrigger
                                className="cardBorder w-full px-4 py-2.5 rounded-md items-center flex justify-between bg-white dark:bg-zinc-800"
                                onClick={() =>
                                  setIsPopoverOpen(!isPopoverOpen)
                                }
                              >
                                {formatDate(checkout?.selectedDate)}
                                <FaRegCalendarAlt className="text-[#FF7A45]" />
                              </PopoverTrigger>
                              {timeSlotsData?.time_slots_is_enabled ==
                                "true" && (
                                <PopoverContent className="w-full p-0">
                                  <Calendar
                                    mode="single"
                                    selected={checkout?.selectedDate}
                                    onSelect={handleSelectedDate}
                                    className="rounded-md w-full"
                                    fromDate={(() => {
                                      let date = new Date();
                                      date.setDate(
                                        date.getDate() +
                                          parseInt(
                                            timeSlotsData.delivery_estimate_days -
                                              1,
                                          ),
                                      );
                                      return date;
                                    })()}
                                    toDate={(() => {
                                      let date = new Date();
                                      let allowedDays =
                                        parseInt(
                                          setting?.setting
                                            ?.time_slots_allowed_days,
                                        ) || 15;
                                      date.setDate(
                                        date.getDate() +
                                          parseInt(
                                            timeSlotsData.delivery_estimate_days -
                                              1,
                                          ) +
                                          (allowedDays - 1),
                                      );
                                      return date;
                                    })()}
                                  />
                                </PopoverContent>
                              )}
                            </Popover>
                          </div>
                          {timeSlotsData?.time_slots_is_enabled == "true" && (
                            <div className="col-span-12 md:col-span-6 flex flex-col gap-1">
                              <span className="text-base font-bold">
                                {t("preferred_delivery_time")}
                                <span className="text-red-500">*</span>
                              </span>
                              <Select
                                onValueChange={handleTimeSlotChange}
                                value={selectedTimeSlot}
                              >
                                <SelectTrigger className="w-full py-5 cardBorder rounded-md">
                                  <SelectValue placeholder="Select a timezone">
                                    {checkout?.timeSlot?.title || checkout?.timeSlot?.translations?.title || "Sélectionnez un créneau"}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  {availabeleTimeSlot?.map((slot) => {
                                    return (
                                      <div key={slot?.id}>
                                        <SelectItem
                                          value={slot}
                                          style={{
                                            opacity:
                                              slot.isDisabled == "true"
                                                ? 0.4
                                                : 1,
                                          }}
                                          className={`
                                            ${slot.isDisabled == true ? "opacity-40 cursor-not-allowed text-gray-400" : ""}
                                          `}
                                        >
                                          <div className="flex justify-between items-center w-full gap-4">
                                            <p className="font-medium">
                                              {slot?.translations?.title || slot?.title}
                                            </p>
                                            <p className="whitespace-nowrap text-xs text-[#FF7A45] font-semibold">
                                              {slot?.is_free_delivery
                                                ? t("freedelivery")
                                                : ""}
                                            </p>
                                          </div>
                                        </SelectItem>
                                      </div>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Method */}
                  <div className="flex flex-col cardBorder rounded-lg bg-white dark:bg-zinc-900 shadow-sm overflow-hidden" id="checkout-payment-section">
                    <div className="flex items-center gap-3 backgroundColor py-4 px-4 md:px-5 border-b border-gray-200 dark:border-zinc-700">
                      <span className="w-7 h-7 rounded-full primaryBackColor text-white flex items-center justify-center font-bold text-sm">
                        {checkout?.orderType === "doorstep" &&
                        (timeSlotsData?.time_slot_setting === "true" ||
                          timeSlotsData?.time_slot_setting === true)
                          ? "3"
                          : "2"}
                      </span>
                      <div>
                        <h2 className="font-bold text-base md:text-xl text-gray-900 dark:text-gray-100">
                          {t("payment_method") || "Mode de paiement"}
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {t("select_payment_method") || "Sélectionnez votre mode de règlement sécurisé"}
                        </p>
                      </div>
                    </div>
                    <div className="p-4 md:p-6">
                      <CheckoutPayment
                        checkoutData={checkoutData}
                        selectedPaymentMethod={selectedPaymentMethod}
                        setSelectedPaymentMethod={setSelectedPaymentMethod}
                        setCurrentStep={setCurrentStep}
                        handlePlaceOrder={handlePlaceOrder}
                        checkoutLoading={checkoutLoading}
                        isSinglePage={true}
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-4 lg:col-span-3 col-span-12">
                  <OrderSummaryCard
                    step={3}
                    checkoutData={checkoutData}
                    handlePlaceOrder={handlePlaceOrder}
                    checkOutError={checkOutError}
                    checkoutLoading={checkoutLoading}
                    handleSummaryAction={handlePlaceOrder}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {showAddAddres && (<NewAddressModal
        fetchAddress={fetchAddress}
        showAddAddres={showAddAddres}
        setShowAddAddres={setShowAddAddres}
        isAddressSelected={isAddressSelected}
      />)}
      {showStripe && (<StripeModal
        showStripe={showStripe}
        setShowStripe={setShowStripe}
        amount={checkout?.checkoutTotal}
        clientSecret={stripeClientSecret}
        stripeTransId={stripeTransactionId}
        stripeOrderId={stripeOrderId}
        type="order"
      />)}
      {/* <OrderSuccessModal showOrderSuccess={showOrderSuccess} handlePaymentClose={handlePaymentClose} /> */}
    </section>
  );
};

export default Checkout;
