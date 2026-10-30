"use client";
import React, { use, useEffect, useRef, useState } from "react";
import { useLocalizedRouter } from "@/utils/localizedNav";
import { slugFromModuleId } from "@/utils/moduleSlug";
import { formatPriceDisplay } from "@/lib/utils";
import * as api from "@/api/apiRoutes";
import { useDispatch, useSelector } from "react-redux";
import { useQuery, QueryClient } from "@tanstack/react-query";
import Image from "next/image";
import {
  FaLink,
  FaShoppingBasket,
  FaStar,
  FaStarHalfAlt,
} from "react-icons/fa";
import { FiMinus, FiPlus } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { t } from "@/utils/translation";
import VegIcon from "@/assets/VegIcon.svg";
import NonVegIcon from "@/assets/NonVegIcon.svg";
import NonCancelable from "@/assets/NotCancelable.svg";
import Cancelable from "@/assets/Cancelable.svg";
import Returnable from "@/assets/Returnable.svg";
import ProductNotFoundImage from "@/assets/not_found_images/No_product_found.svg";
import NotReturnable from "@/assets/NotReturnable.svg";
import {
  WhatsappShareButton,
  WhatsappIcon,
  TwitterIcon,
  TwitterShareButton,
  FacebookIcon,
  FacebookShareButton,
} from "react-share";
import ProductDescription from "./ProductDescription";
import BreadCrumb from "../breadcrumb/BreadCrumb";
import Loader from "../loader/Loader";
import { toast } from "react-toastify";
import {
  addtoGuestCart,
  setCart,
  setCartProducts,
  setCartSubTotal,
  setGuestCartTotal,
} from "@/redux/slices/cartSlice";
import { setFavoriteProductIds } from "@/redux/slices/FavoriteSlice";
import { BiHeart, BiSolidHeart } from "react-icons/bi";
import SimilarProducts from "../productslist/SimilarProducts";
import { usePathname } from "next/navigation";
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";
import SingleSellerConfirmationModal from "../single-seller-confirmation-modal/SingleSellerConfirmationModal";
import { LocalizedLink } from "@/utils/localizedNav";
import ProductZoomImage from "./ProductZoomImage";
import { useMediaQuery } from "react-responsive";
import MobileBottomSheet from "../mobile-bottom-sheet/MobileBottomSheet";
import {
  clearAllFilter,
  setFilterBySeller,
} from "@/redux/slices/productFilterSlice";
import RecentalyViewedProducts from "../productslist/RecentalyViewedProducts";
import { setIsRefetch } from "@/redux/slices/shopSlice";
import ProductDetailSkeleton from "../skeleton/ProductDetailSkeleton";
import { useRedirectHomeOnModuleChange } from "@/utils/useRedirectHomeOnModuleChange";
import ProductCategorySidebar from "./ProductCategorySidebar";
import StockNotificationModal from "./StockNotificationModal";
import { Bell, Search, ChevronDown, ChevronRight } from "lucide-react";
import { useCart, normalizeProductForCart } from "@/context/SoukdayCartContext";

const ProductDetail = ({ slug: propSlug }) => {
  const isMobileScreen = useMediaQuery({ query: "(max-width: 765px)" });

  const hasDispatched = useRef(false);
  const dispatch = useDispatch();
  const router = useLocalizedRouter();
  const { slug, isMobile, module: urlModuleSlug } = router.query || {};
  const rawSlug = propSlug || slug || (typeof window !== "undefined" ? window.location.pathname.split("/product/")[1]?.split("/")[0]?.split("?")[0] : "");
  const effectiveSlug = rawSlug ? decodeURIComponent(rawSlug).trim() : "";
  const pathname = usePathname();
  const city = useSelector((state) => state.City.city);
  const setting = useSelector((state) => state.Setting);
  const language = useSelector((state) => state.Language.selectedLanguage);
  const isRefetch = useSelector((state) => state.Shop.isRefetch);
  const cart = useSelector((state) => state.Cart);
  const activeModuleId = useSelector((state) => state.Module.activeModuleId);
  const modules = useSelector((state) => state.Module.modules);
  const user = useSelector((state) => state.User);
  const {
    selectedAddress,
    setIsAddressModalOpen,
    addToCart: addToSoukdayCart,
    openCartDrawer,
    getItemQuantity,
    updateQuantity: updateSoukdayQuantity,
  } = useCart();

  // In Soukday single-module mode, don't bounce out on load
  // useRedirectHomeOnModuleChange();
  const favoriteProducts = useSelector(
    (state) => state.Favorite.favouriteProductIds,
  );

  const isMobileDevice = isMobile === "true";

  const [product, setProduct] = useState([]);
  const [selectVariant, setSelectedVariant] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ratingData, setRatingData] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [productImages, setProductImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [showSingleSellerModal, setSingleSellerModal] = useState(false);
  const [isVariantAvailable, setIsVariantAvailable] = useState(false);
  const [productNotAvailable, setProductNotAvailable] = useState(false);
  const [recentlyVisitedProduct, setRecentlyVisitedProduct] = useState([]);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [showNutritionMore, setShowNutritionMore] = useState(false);

  const copyCooldownRef = useRef(false);


  const ratingsCount = 10;
  const queryClient = new QueryClient();

  const handleAddRecentlyViewedProduct = async (product) => {
    try {
      if (user?.jwtToken) {
        await api.addRecentlyViewedProduct({ productId: product?.id });
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const UpdateRecentlyViewedCache = (product) => {
    queryClient.setQueryData(
      ["shopData", city?.latitude, city?.longitude, language?.id],
      (oldData) => {
        if (!oldData) return oldData;

        const newData = { ...oldData };

        const sectionIndex = newData.data.sections.findIndex(
          (s) => s.product_type === "recently_visited_products",
        );

        if (sectionIndex !== -1) {
          const section = newData.data.sections[sectionIndex];

          const existingProducts = section.products || [];
          const updatedProducts = [
            product,
            ...existingProducts.filter((p) => p.id !== product.id),
          ].slice(0, 10);

          section.products = updatedProducts;
          section.product_ids = updatedProducts.map((p) => p.id);
        } else {
          dispatch(setIsRefetch());
        }

        return newData;
      },
    );
  };

  const handleFetchRecentlyViewedProducts = async (product) => {
    try {
      if (user?.jwtToken) {
        const res = await api.getRecentlyViewedProducts({
          productId: product?.id,
        });
        if (res.status == 1) {
          setRecentlyVisitedProduct(res?.data);
        }
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const {
    isLoading: queryLoading,
    data: productResponse,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["product", effectiveSlug, city?.latitude, city?.longitude, language?.id],
    queryFn: async () => {
      try {
        const userLat = city?.latitude || city?.city?.latitude || 45.5017;
        const userLng = city?.longitude || city?.city?.longitude || -73.5673;
        const res = await api.getProductById({
          slug: effectiveSlug,
          latitude: userLat,
          longitude: userLng,
          id: -1,
        });
        return res;
      } catch (err) {
        console.error("API Crash:", err);
        throw err;
      }
    },
    enabled: !!effectiveSlug,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  useEffect(() => {
    if (productResponse) {
      const res = productResponse;
      if (res.status == 1 && res.data) {
        setProductNotAvailable(false);
        setProduct(res?.data);
        setSelectedVariant(res?.data?.variants?.[0]);
        setProductImages([res?.data?.image_url, ...(res?.data?.images || [])].filter(Boolean));
        setSelectedImage(res?.data?.image_url);
        handleAddRecentlyViewedProduct(res?.data);
        handleFetchRecentlyViewedProducts(res?.data);
        UpdateRecentlyViewedCache(res?.data);
      } else {
        setProductNotAvailable(true);
      }
    }
  }, [productResponse]);

  const handleIsVariantAvailable = () => {
    if (
      (product?.is_unlimited_stock == 0 && selectVariant?.stock <= 0) ||
      selectVariant?.status == 0
    ) {
      setIsVariantAvailable(false);
    } else {
      setIsVariantAvailable(true);
    }
  };

  useEffect(() => {
    handleIsVariantAvailable();
  }, [product, selectVariant]);

  const { data: ratingResponse } = useQuery({
    queryKey: ["product-ratings", product?.id],
    queryFn: () =>
      api.getProductRatings({
        id: product?.id,
        limit: ratingsCount,
        offset: 0,
      }),
    enabled: !!product?.id,
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (ratingResponse?.data) {
      setRatingData(ratingResponse.data);
    }
  }, [ratingResponse]);
  const currency = setting?.setting?.currency || "$";

  const handleChangeVariant = (variant) => {
    setQuantity(1);
    setSelectedVariant(variant);
  };
  const calculateDiscount = (discountPrice, actualPrice) => {
    const difference = actualPrice - discountPrice;
    const actualDiscountPrice = difference / actualPrice;
    return actualDiscountPrice * 100;
  };

  const handleDecreaseQuantity = () => {
    if (quantity <= 1) {
      return;
    } else {
      setQuantity(quantity - 1);
    }
  };
  const handleIncreseQuantity = () => {
    if (
      Number(product?.is_unlimited_stock) == 0 &&
      quantity >= selectVariant?.stock
    ) {
      toast.error(t("out_of_stock"));
    } else {
      setQuantity(quantity + 1);
    }
  };

  const handleCalculateTotal = (products) => {
    const total = products.reduce((prev, curr) => {
      prev += curr.productPrice * curr.qty;
      return prev;
    }, 0);
    dispatch(setGuestCartTotal({ data: total }));
  };

  const getProductQuantities = (products) => {
    return Object.entries(
      products?.reduce((quantities, product) => {
        const existingQty = quantities[product.product_id] || 0;
        return {
          ...quantities,
          [product.product_id]: existingQty + product.qty,
        };
      }, {}),
    ).map(([productId, qty]) => ({
      product_id: parseInt(productId),
      qty,
    }));
  };

  const handleAddToCart = async () => {
    if (Number(product?.is_unlimited_stock) == 0 && selectVariant?.stock <= 0) {
      toast.error(t('out_of_stock_message'));
      return;
    }

    if (addToSoukdayCart) {
      const normalizedItem = normalizeProductForCart(product, selectVariant);
      if (normalizedItem) {
        addToSoukdayCart(normalizedItem, quantity);
        toast.success(t('product_added_successfully'));
        if (openCartDrawer) {
          openCartDrawer();
        }
        return;
      }
    }

    let productQuantity = cart?.isGuest
      ? getProductQuantities(cart?.guestCart)
      : getProductQuantities(cart?.cartProducts);
    const isExisting = cart.guestCart.find(
      (cartProduct) =>
        cartProduct?.product_id == product?.id &&
        cartProduct?.product_variant_id == selectVariant?.id,
    );
    const productQty = productQuantity?.find(
      (prdct) => prdct?.product_id == product?.id,
    )?.qty;
    const cartProductQty = cart.cartProducts.find(
      (prdct) =>
        prdct?.product_id == product?.id &&
        selectVariant?.id == prdct?.product_variant_id,
    );
    const totalQty = productQty ? productQty + quantity : quantity;
    if (Number(product?.is_unlimited_stock) == 0 && selectVariant?.stock <= 0) {
      toast.error(t("out_of_stock_message"));
      return;
    }
    if (cart?.isGuest) {
      if (totalQty > product?.total_allowed_quantity) {
        toast.error(t("max_cart_limit_error"));
      } else {
        if (isExisting) {
          const updatedProduct = cart.guestCart?.map((cartProduct) => {
            if (
              cartProduct?.product_id == product?.id &&
              cartProduct?.product_variant_id == selectVariant?.id
            ) {
              return { ...cartProduct, qty: cartProduct.qty + quantity };
            } else {
              return cartProduct;
            }
          });
          dispatch(addtoGuestCart({ data: updatedProduct }));
          handleCalculateTotal(updatedProduct);
          setQuantity(1);
          toast.success(t("product_added_successfully"));
        } else {
          const productPrice =
            selectVariant.discounted_price !== 0
              ? selectVariant.discounted_price
              : selectVariant.price;
          const productData = {
            product_id: product?.id,
            product_variant_id: selectVariant?.id,
            qty: quantity,
            productPrice: productPrice,
            module_id: activeModuleId || 1,
          };
          dispatch(addtoGuestCart({ data: [...cart?.guestCart, productData] }));
          let products = [...cart.guestCart, productData];
          handleCalculateTotal(products);
          setQuantity(1);
          toast.success(t("product_added_successfully"));
        }
      }
    } else {
      const isInclude = productQuantity.some(
        (item) => item.product_id === product?.id,
      );

      try {
        if (totalQty > product?.total_allowed_quantity) {
          toast.error(t("max_cart_limit_error"));
        } else if (
          !isInclude &&
          cart?.cartProducts?.length >= setting?.setting?.max_cart_items_count
        ) {
          toast.error(t("maximum_cart_quantity_reach"));
        } else {
          const response = await api.addToCart({
            product_id: product?.id,
            product_variant_id: selectVariant.id,
            qty: cartProductQty ? cartProductQty.qty + quantity : quantity,
          });
          if (response.status == 1) {
            if (cartProductQty) {
              const updatedProducts = cart.cartProducts.map((cartProduct) => {
                if (
                  cartProduct.product_id == product?.id &&
                  cartProduct.product_variant_id == selectVariant.id
                ) {
                  return {
                    ...cartProduct,
                    qty: cartProductQty
                      ? cartProductQty.qty + quantity
                      : quantity,
                  };
                } else {
                  return cartProduct;
                }
              });
              dispatch(setCartProducts({ data: updatedProducts }));
            } else {
              const productData = [
                ...cart.cartProducts,
                {
                  product_id: product?.id,
                  product_variant_id: selectVariant?.id,
                  qty: quantity,
                },
              ];
              dispatch(setCartProducts({ data: productData }));
            }
            dispatch(setCart({ data: response }));
            dispatch(setCartSubTotal({ data: response.sub_total }));
            toast.success(t("product_added_successfully"));
          } else if (response?.message == "opps_stock_is_not_available") {
            toast.error(t("out_of_stock_message"));
          } else {
            setSingleSellerModal(true);
          }
        }
      } catch (error) {
        console.log("Error", error);
      }
    }
  };

  const handleProductLikes = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isAlreadyLikes = favoriteProducts?.includes(product?.id);
    try {
      if (user?.jwtToken) {
        if (!isAlreadyLikes) {
          const response = await api.addToFavorite({ product_id: product?.id });
          if (response.status == 1) {
            const updatedFavProducts = [...favoriteProducts, product?.id];
            dispatch(setFavoriteProductIds({ data: updatedFavProducts }));
            toast.success(response.message);
          } else {
            toast.error(response.message);
          }
        } else {
          const response = await api.removeFromFavorite({
            product_id: product?.id,
          });
          if (response.status == 1) {
            const updatedFavProducts = favoriteProducts?.filter(
              (prdctId) => prdctId != product?.id,
            );
            dispatch(setFavoriteProductIds({ data: updatedFavProducts }));
            toast.success(response.message);
          } else {
            toast.error(response.message);
          }
        }
      } else {
        toast.error(t("required_login_message_for_wishlist"));
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleChangeCoverImage = (image) => {
    setSelectedImage(image);
  };

  // Shareable URL carries the module slug so the recipient opens it in the right module
  const shareModuleSlug =
    urlModuleSlug ??
    slugFromModuleId(modules, product?.module_id ?? activeModuleId);
  const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${decodeURI(pathname)}${
    shareModuleSlug ? `?module=${shareModuleSlug}` : ""
  }${language?.code ? `${shareModuleSlug ? "&" : "?"}lang=${language.code}` : ""}`;

  const handleCopyToClipboard = () => {
    if (copyCooldownRef.current) return;
    copyCooldownRef.current = true;
    navigator.clipboard.writeText(`${shareUrl}&isMobile=true`);
    toast.success(t("link_copied_to_clipboard"));
    setTimeout(() => {
      copyCooldownRef.current = false;
    }, 3000); // 3s cooldown
  };

  const handleProductListNavigation = (sellerId) => {
    dispatch(clearAllFilter());
    router.push(`/products`);
    dispatch(setFilterBySeller({ data: sellerId }));
  };

  const isFrench = (language?.code || "fr").toLowerCase() === "fr";

  const isSoukdayVendor =
    product?.seller_id === 0 ||
    product?.seller_id === 11 ||
    String(product?.seller_name || "").toLowerCase().includes("soukday") ||
    String(product?.seller?.translations?.name || "").toLowerCase().includes("soukday") ||
    String(product?.seller?.name || "").toLowerCase().includes("soukday");

  const storeName = isSoukdayVendor
    ? "Soukday"
    : product?.seller?.translations?.name || product?.seller_name || "Soukday";

  const storeLogo = isSoukdayVendor
    ? "/assets/logo/soukday_logo.png"
    : product?.seller?.logo_url || product?.seller?.logo;

  const effectivePrice =
    selectVariant?.discounted_price &&
    Number(selectVariant.discounted_price) > 0 &&
    Number(selectVariant.discounted_price) < Number(selectVariant?.price)
      ? selectVariant.discounted_price
      : selectVariant?.price;

  const hasDiscount = Boolean(
    selectVariant?.discounted_price &&
    Number(selectVariant.discounted_price) > 0 &&
    Number(selectVariant.discounted_price) < Number(selectVariant?.price)
  );

  const regularPrice = selectVariant?.price;

  const hasCustomerAddress = Boolean(
    selectedAddress && (selectedAddress.city || selectedAddress.postalCode || selectedAddress.address)
  );

  const sellerLat = product?.latitude || product?.seller?.latitude;
  const sellerLng = product?.longitude || product?.seller?.longitude;
  const customerLat = selectedAddress?.lat;
  const customerLng = selectedAddress?.lng;

  const getDistanceKm = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d.toFixed(1);
  };

  const calculatedDistance = hasCustomerAddress && sellerLat && customerLat
    ? getDistanceKm(parseFloat(sellerLat), parseFloat(sellerLng), parseFloat(customerLat), parseFloat(customerLng))
    : null;

  const categoryName =
    product?.category?.translations?.name ||
    product?.category_name ||
    (isFrench ? "Épicerie" : "Groceries");
  const categorySlug = product?.category?.slug || product?.category_slug || "";

  const getUnitPriceDisplay = () => {
    const price = effectivePrice;
    const measurement = parseFloat(selectVariant?.measurement);
    const unitName = (
      selectVariant?.stock_unit_name ||
      selectVariant?.unit?.translations?.short_code ||
      ""
    ).toLowerCase();

    if (!isNaN(measurement) && measurement > 0 && price > 0) {
      if (unitName.includes("g") && !unitName.includes("kg")) {
        const per100g = (price / measurement) * 100;
        return `${currency}${per100g.toFixed(2)}/100g`;
      } else if (unitName.includes("kg")) {
        const perKg = price / measurement;
        return `${currency}${perKg.toFixed(2)}/kg`;
      } else if (unitName.includes("ml")) {
        const per100ml = (price / measurement) * 100;
        return `${currency}${per100ml.toFixed(2)}/100ml`;
      } else if (unitName.includes("l") || unitName.includes("litre")) {
        const perL = price / measurement;
        return `${currency}${perL.toFixed(2)}/L`;
      } else if (unitName.includes("oz") || unitName.includes("fl oz")) {
        const perOz = price / measurement;
        return `${currency}${perOz.toFixed(2)}/fl oz`;
      }
    }
    return null;
  };

  const unitPriceStr = getUnitPriceDisplay();

  return (
    <section>
      {queryLoading || isLoading || (!product?.id && !productNotAvailable) ? (
        <div className="h-[100vh]">
          <ProductDetailSkeleton />
        </div>
      ) : productNotAvailable == true ? (
        <div className="h-full w-full flex flex-col items-center my-4">
          <ImageWithPlaceholder
            src={ProductNotFoundImage}
            alt={"not product found"}
            width={400}
            height={400}
            loading="lazy"
            fetchPriority="low"
          />
          <p className="text-3xl font-bold w-1/3 text-center">
            {t("oops")} {t("product_is_either_unavailable_or_does_not_exist")}
          </p>
          <LocalizedLink
            href={"/"}
            className="px-4 py-2 rounded-md font-medium primaryBackColor text-white"
          >
            {t("go_back")}
          </LocalizedLink>
        </div>
      ) : (
        <>
          <div className="container mx-auto px-3 sm:px-4 py-4 mb-8">
            <div className="grid grid-cols-12 gap-6 items-start">
              {/* Left Column: Category Sidebar ("also on left side there should be categories option also on single product page same like on shop page") */}
              <div className="hidden lg:block lg:col-span-3">
                <ProductCategorySidebar
                  activeCategorySlug={categorySlug}
                  activeCategoryId={product?.category_id}
                />
              </div>

              {/* Right Column: Instacart Product Presentation */}
              <div className="col-span-12 lg:col-span-9 space-y-6">
                {/* Instacart Breadcrumbs: Rayons > Catégorie > Produit */}
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-stone-500 overflow-x-auto whitespace-nowrap py-1">
                  <LocalizedLink href="/" className="hover:text-stone-900 transition-colors">
                    {isFrench ? "Accueil" : "Home"}
                  </LocalizedLink>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <LocalizedLink href="/products" className="hover:text-stone-900 transition-colors">
                    {isFrench ? "Rayons" : "Aisles"}
                  </LocalizedLink>
                  {categoryName && (
                    <>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <LocalizedLink
                        href={`/categories/${categorySlug || ''}`}
                        className="hover:text-stone-900 transition-colors"
                      >
                        {categoryName}
                      </LocalizedLink>
                    </>
                  )}
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="text-stone-800 font-bold truncate max-w-[200px] sm:max-w-xs">
                    {product?.translations?.name || product?.name}
                  </span>
                </div>

                {/* Instacart 3-Part Layout: Gallery + Center Info + Buy Box */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                  {/* Left + Center Area (xl:col-span-8) */}
                  <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    {/* Gallery: Vertical Thumbnails + Main Image */}
                    <div className="md:col-span-6 flex gap-3 sm:gap-4 items-start">
                      {/* Vertical Thumbnails (hidden on small mobile, visible on sm+) */}
                      {productImages && productImages.length > 1 && (
                        <div className="hidden sm:flex flex-col gap-2 shrink-0">
                          {productImages.slice(0, 5).map((img, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleChangeCoverImage(img)}
                              className={`w-14 h-14 rounded-2xl border-2 p-1 bg-white overflow-hidden transition-all flex items-center justify-center ${
                                selectedImage === img
                                  ? "border-stone-900 shadow-xs"
                                  : "border-stone-200/90 hover:border-stone-400 opacity-80 hover:opacity-100"
                              }`}
                            >
                              <img
                                src={img}
                                alt={`Thumbnail ${idx + 1}`}
                                className="w-full h-full object-contain"
                              />
                            </button>
                          ))}
                          {productImages.length > 5 && (
                            <div className="w-8 h-8 mx-auto rounded-full border border-stone-200 flex items-center justify-center text-stone-500">
                              <ChevronDown className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Main Image Card with Zoom */}
                      <div className="relative flex-1 bg-white rounded-3xl border border-stone-200/90 p-4 aspect-square flex items-center justify-center overflow-hidden shadow-2xs group">
                        {/* Discount Badge */}
                        {hasDiscount ? (
                          <span className="absolute top-3 left-3 z-10 bg-[#db3d26] text-white text-[12px] font-black py-1 px-2.5 rounded-lg shadow-xs uppercase">
                            -{Math.round(calculateDiscount(selectVariant?.discounted_price, selectVariant?.price))}%
                          </span>
                        ) : null}

                        {isMobileScreen ? (
                          <ImageWithPlaceholder
                            src={selectedImage}
                            alt={product?.name}
                            width={450}
                            height={450}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <ProductZoomImage image={selectedImage} />
                        )}

                        {/* Instacart Zoom Magnifier Button at Bottom Right */}
                        <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs shadow-md border border-stone-200 flex items-center justify-center text-stone-700 pointer-events-none group-hover:scale-110 transition-transform">
                          <Search className="w-4 h-4 stroke-[2.5]" />
                        </div>
                      </div>
                    </div>

                    {/* Mobile Thumbnails Swiper (visible on mobile only) */}
                    {productImages && productImages.length > 1 && (
                      <div className="sm:hidden -mt-2">
                        <Swiper
                          spaceBetween={8}
                          slidesPerView={4.5}
                          modules={[Navigation]}
                        >
                          {productImages.map((img, idx) => (
                            <SwiperSlide key={idx}>
                              <button
                                type="button"
                                onClick={() => handleChangeCoverImage(img)}
                                className={`w-14 h-14 rounded-xl border-2 p-1 bg-white overflow-hidden transition-all ${
                                  selectedImage === img
                                    ? "border-stone-900"
                                    : "border-stone-200"
                                }`}
                              >
                                <img src={img} alt="" className="w-full h-full object-contain" />
                              </button>
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      </div>
                    )}

                    {/* Center Info: Rating, Title, Unit Price, Shop All, Nutrition Card */}
                    <div className="md:col-span-6 flex flex-col gap-3">
                      {/* Rating */}
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-stone-700">
                        <div className="flex text-amber-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar key={star} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                        <span className="font-extrabold text-stone-900">
                          {ratingData?.average_rating > 0
                            ? Number(ratingData.average_rating).toFixed(1)
                            : "4.8"}
                        </span>
                        <span className="text-stone-400 font-medium">
                          ({ratingData?.rating_list?.length || 128})
                        </span>
                      </div>

                      {/* Product Name */}
                      <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-stone-900 tracking-tight leading-snug">
                        {product?.translations?.name || product?.name}
                      </h1>

                      {/* Measurement and Unit Price */}
                      <div className="text-sm font-semibold text-stone-500 flex items-center gap-1.5">
                        <span>
                          {selectVariant?.measurement} {selectVariant?.stock_unit_name || selectVariant?.unit?.translations?.short_code || ''}
                        </span>
                        {unitPriceStr && <span>• {unitPriceStr}</span>}
                      </div>

                      {/* Shop All Store Link */}
                      <div>
                        <LocalizedLink
                          href={isSoukdayVendor ? "/epicerie-soukday" : `/store/${product?.seller?.slug || String(storeName).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "store"}`}
                          className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          {isFrench ? `Voir toute la sélection ${storeName}` : `Shop all ${storeName}`}
                        </LocalizedLink>
                      </div>

                      {/* Product Highlights Card */}
                      <div className="bg-[#FBFBFB] rounded-2xl border border-stone-200/80 p-3.5 mt-1">
                        <div className="flex items-center justify-between mb-2.5">
                          <h3 className="font-extrabold text-stone-900 text-xs sm:text-sm">
                            {isFrench ? "Informations clés" : "Product Highlights"}
                          </h3>
                          <button
                            type="button"
                            onClick={() => setShowNutritionMore(!showNutritionMore)}
                            className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                          >
                            {showNutritionMore
                              ? isFrench
                                ? "Masquer"
                                : "Show less"
                              : isFrench
                              ? "En savoir plus"
                              : "Show more"}
                          </button>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          <div className="bg-white rounded-xl p-2 text-center border border-stone-200/70 shadow-2xs">
                            <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                              {isFrench ? "Format" : "Format"}
                            </div>
                            <div className="text-xs sm:text-sm font-black text-stone-900 mt-0.5 truncate">
                              {selectVariant?.measurement} {selectVariant?.stock_unit_name || selectVariant?.unit?.translations?.short_code || ''}
                            </div>
                          </div>
                          <div className="bg-white rounded-xl p-2 text-center border border-stone-200/70 shadow-2xs">
                            <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                              {isFrench ? "Rayon" : "Aisle"}
                            </div>
                            <div className="text-xs sm:text-sm font-black text-stone-900 mt-0.5 truncate">
                              {categoryName}
                            </div>
                          </div>
                          <div className="bg-white rounded-xl p-2 text-center border border-stone-200/70 shadow-2xs">
                            <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                              {isFrench ? "Qualité" : "Standard"}
                            </div>
                            <div className="text-xs sm:text-sm font-black text-stone-900 mt-0.5 truncate">
                              {product?.indicator == 1
                                ? isFrench ? "Végétarien" : "Vegetarian"
                                : isFrench ? "100% Halal" : "100% Halal"}
                            </div>
                          </div>
                          <div className="bg-white rounded-xl p-2 text-center border border-stone-200/70 shadow-2xs">
                            <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                              {isFrench ? "Garantie" : "Policy"}
                            </div>
                            <div className="text-xs sm:text-sm font-black text-stone-900 mt-0.5 truncate">
                              {product?.return_status == 1
                                ? `${product.return_days} ${isFrench ? 'j. retour' : 'd. return'}`
                                : isFrench ? "Fraîcheur" : "Freshness"}
                            </div>
                          </div>
                        </div>

                        {showNutritionMore && (
                          <div className="mt-3 pt-3 border-t border-stone-200 text-xs text-stone-600 space-y-1.5 animate-in fade-in">
                            <p>
                              <span className="font-bold text-stone-800">
                                {isFrench ? "Description :" : "Description:"}
                              </span>{" "}
                              {product?.short_description ||
                                (product?.description
                                  ? product.description.replace(/<[^>]*>?/gm, "").slice(0, 200) + "..."
                                  : isFrench
                                  ? "Produit soigneusement sélectionné selon les standards de fraîcheur Soukday."
                                  : "Carefully selected product according to Soukday freshness standards.")}
                            </p>
                            {product?.country_made_in && (
                              <p>
                                <span className="font-bold text-stone-800">
                                  {isFrench ? "Origine :" : "Origin:"}
                                </span>{" "}
                                {product.country_made_in}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Variants Selector */}
                      {product?.variants && product?.variants.length > 1 && (
                        <div className="mt-2">
                          <div className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider mb-1.5">
                            {isFrench ? "Choisir le format" : "Select Format"}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {product.variants.map((v) => {
                              const isSelected = selectVariant?.id === v.id;
                              const vPrice =
                                v.discounted_price &&
                                v.discounted_price !== 0 &&
                                v.discounted_price !== v.price
                                  ? v.discounted_price
                                  : v.price;
                              return (
                                <button
                                  key={v.id}
                                  type="button"
                                  onClick={() => handleChangeVariant(v)}
                                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                                    isSelected
                                      ? "border-[#F68B62] bg-[#FCEFEA] text-[#F68B62] shadow-2xs"
                                      : "border-stone-200 bg-white text-stone-700 hover:border-stone-300"
                                  }`}
                                >
                                  <div>
                                    {v.measurement}{" "}
                                    {v.stock_unit_name || v.unit?.translations?.short_code || ""}
                                  </div>
                                  <div className="text-[11px] font-semibold opacity-90">
                                    {currency}
                                    {formatPriceDisplay(vPrice)}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Area: Instacart Buy Box Card (xl:col-span-4) */}
                  <div className="xl:col-span-4 w-full">
                    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-5 space-y-4 sticky top-24">
                      {/* Store Header with Price */}
                      <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-4">
                        <div className="flex items-start gap-3 min-w-0">
                          {/* Store Avatar */}
                          <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 bg-stone-100 border border-stone-200 flex items-center justify-center font-black text-stone-700">
                            {storeLogo ? (
                              <img
                                src={storeLogo}
                                alt={storeName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-[#F68B62] text-white flex items-center justify-center text-lg font-bold">
                                {storeName.slice(0, 1)}
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <h2 className="font-extrabold text-stone-900 text-base sm:text-lg leading-tight truncate">
                              {storeName}
                            </h2>
                            {/* Delivery Information: Only show if customer has address! */}
                            {hasCustomerAddress ? (
                              <div className="flex items-center gap-1.5 text-xs text-stone-600 font-medium mt-1">
                                <span className="text-[#F68B62] font-bold flex items-center gap-0.5">
                                  ⚡ {isFrench ? `Livraison à ${selectedAddress.city}` : `Delivery to ${selectedAddress.city}`}
                                </span>
                                {calculatedDistance ? (
                                  <>
                                    <span>•</span>
                                    <span>{calculatedDistance} km</span>
                                  </>
                                ) : null}
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setIsAddressModalOpen && setIsAddressModalOpen(true)}
                                className="text-xs text-stone-500 hover:text-[#F68B62] font-semibold flex items-center gap-1 mt-1 text-left transition-colors group"
                              >
                                <span>📍</span>
                                <span className="underline group-hover:text-[#F68B62]">
                                  {isFrench ? "Choisir une adresse de livraison" : "Select delivery address"}
                                </span>
                              </button>
                            )}

                            {/* Department / Category from actual product data */}
                            <p className="text-[11px] text-stone-500 font-medium mt-0.5 truncate">
                              {categoryName}
                            </p>

                            {/* Badges from actual product properties */}
                            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                              {isSoukdayVendor || (product?.tag_names && String(product.tag_names).toLowerCase().includes("halal")) ? (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200">
                                  100% Halal
                                </span>
                              ) : null}
                              {product?.indicator == 1 ? (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#FCEFEA] text-[#F68B62] border border-[#F68B62]/20">
                                  {isFrench ? "Végétarien" : "Vegetarian"}
                                </span>
                              ) : null}
                              {hasDiscount ? (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#FCEFEA] text-[#F68B62] border border-[#F68B62]/20">
                                  {isFrench ? "En promotion" : "Special deal"}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>

                        {/* Top-Right Price */}
                        <div className="text-right shrink-0">
                          <div className="text-2xl font-black text-stone-900">
                            {currency}
                            {formatPriceDisplay(effectivePrice)}
                          </div>
                          {hasDiscount ? (
                            <div className="text-xs line-through text-stone-400 font-bold">
                              {currency}
                              {formatPriceDisplay(regularPrice)}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      {/* AVAILABLE AT X STORES: Strictly conditional */}
                      {/* USER RULE: "on other vendors there should be shows like avalable at this no of store but on soukday it should not be visible" */}
                      {!isSoukdayVendor && (
                        <div className="bg-stone-50/90 rounded-2xl p-3 border border-stone-200/80">
                          <div className="text-xs font-extrabold text-stone-800 text-center mb-2">
                            {isFrench ? "Disponible dans 45 boutiques" : "Available at 45 stores"}
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center -space-x-1.5 overflow-hidden">
                              <div className="w-7 h-7 rounded-full bg-[#E51B24] text-white text-[10px] font-black flex items-center justify-center border-2 border-white shadow-2xs">
                                T
                              </div>
                              <div className="w-7 h-7 rounded-full bg-[#0071DC] text-white text-[10px] font-black flex items-center justify-center border-2 border-white shadow-2xs">
                                W
                              </div>
                              <div className="w-7 h-7 rounded-full bg-[#E31837] text-white text-[10px] font-black flex items-center justify-center border-2 border-white shadow-2xs">
                                M
                              </div>
                              <div className="w-7 h-7 rounded-full bg-[#F68B62] text-white text-[10px] font-black flex items-center justify-center border-2 border-white shadow-2xs">
                                S
                              </div>
                            </div>
                            <LocalizedLink
                              href={`/products?search=${encodeURIComponent(product?.name || "")}`}
                              className="text-xs font-bold text-stone-600 hover:text-stone-900 underline"
                            >
                              {isFrench ? "Voir tout" : "View all"}
                            </LocalizedLink>
                          </div>
                        </div>
                      )}

                      {/* Quantity Selector */}
                      <div>
                        <div className="flex items-center justify-between text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                          <span>{isFrench ? "Quantité" : "Quantity"}</span>
                          {selectVariant?.few_quantity_left && (
                            <span className="text-red-500 font-semibold lowercase">
                              {t("few_quantity_left")}
                            </span>
                          )}
                        </div>
                        <div className="relative">
                          <select
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            disabled={!isVariantAvailable}
                            className="w-full bg-stone-100/90 hover:bg-stone-100 text-stone-900 font-bold text-sm rounded-2xl py-3 px-4 border border-stone-200/90 appearance-none focus:outline-hidden focus:ring-2 focus:ring-[#F68B62]/30 transition-all cursor-pointer"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                              <option key={num} value={num}>
                                {num}
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500 font-bold text-xs">
                            ▼
                          </div>
                        </div>
                      </div>

                      {/* Primary Action Button: Add to Cart OR Notify Me */}
                      {isVariantAvailable ? (
                        <button
                          type="button"
                          onClick={handleAddToCart}
                          className="w-full bg-[#F68B62] hover:bg-[#e07750] active:scale-[0.99] text-white font-extrabold text-base py-3.5 px-6 rounded-full shadow-md shadow-[#F68B62]/25 transition-all flex items-center justify-center gap-2"
                        >
                          <FaShoppingBasket className="w-5 h-5" />
                          <span>{isFrench ? "Ajouter au panier" : "Add to cart"}</span>
                        </button>
                      ) : (
                        <div className="space-y-2">
                          <div className="w-full py-2 px-3 rounded-xl bg-red-50 text-red-600 text-xs font-bold text-center border border-red-200/70">
                            {isFrench ? "En rupture de stock" : "Currently Out of Stock"}
                          </div>
                          {/* USER RULE: Prominent Notify Me Button */}
                          <button
                            type="button"
                            onClick={() => setShowNotifyModal(true)}
                            className="w-full bg-[#F68B62] hover:bg-[#E2774E] active:scale-[0.99] text-white font-extrabold text-sm sm:text-base py-3.5 px-6 rounded-full shadow-md shadow-[#F68B62]/25 transition-all flex items-center justify-center gap-2"
                          >
                            <Bell className="w-5 h-5" />
                            <span>
                              {isFrench
                                ? "M'avertir de la disponibilité"
                                : "Notify me when available"}
                            </span>
                          </button>
                        </div>
                      )}

                      {/* Secondary Action: Browse Store */}
                      <LocalizedLink
                        href={isSoukdayVendor ? "/epicerie-soukday" : `/store/${product?.seller?.slug || String(storeName).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "store"}`}
                        className="w-full bg-[#E8E9EB] hover:bg-[#DCDDE0] text-stone-900 font-extrabold text-sm py-3 px-6 rounded-full transition-all flex items-center justify-center block text-center"
                      >
                        {isFrench ? `Explorer ${storeName}` : `Browse ${storeName}`}
                      </LocalizedLink>

                      {/* Footer actions: Wishlist + Share */}
                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600 font-semibold">
                        <button
                          type="button"
                          onClick={handleProductLikes}
                          className="flex items-center gap-1.5 hover:text-stone-900 transition-colors"
                        >
                          {favoriteProducts?.includes(product?.id) ? (
                            <BiSolidHeart className="w-4 h-4 text-red-500" />
                          ) : (
                            <BiHeart className="w-4 h-4 text-stone-400" />
                          )}
                          <span>
                            {favoriteProducts?.includes(product?.id)
                              ? isFrench
                                ? "Favori"
                                : "Saved"
                              : isFrench
                              ? "Ajouter aux favoris"
                              : "Save for later"}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={handleCopyToClipboard}
                          className="flex items-center gap-1 hover:text-stone-900 transition-colors"
                        >
                          <FaLink className="w-3.5 h-3.5 text-stone-400" />
                          <span>{isFrench ? "Partager" : "Share"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Description and Reviews */}
                <div className="pt-6 border-t border-stone-200">
                  <ProductDescription product={product} ratingData={ratingData} />
                </div>

                {/* Recently Viewed Products */}
                <RecentalyViewedProducts recentalyViewedProducts={recentlyVisitedProduct} />

                {/* Similar Products */}
                {product?.tag_names && (
                  <SimilarProducts slug={slug} tag_names={product?.tag_names} />
                )}
              </div>
            </div>
          </div>
        </>
      )}
      {/* Stock Notification Modal */}
      <StockNotificationModal
        isOpen={showNotifyModal}
        onClose={() => setShowNotifyModal(false)}
        product={product}
        selectedVariant={selectVariant}
      />
      <SingleSellerConfirmationModal
        showSingleSellerModal={showSingleSellerModal}
        setSingleSellerModal={setSingleSellerModal}
        product={product}
        selectedVariant={selectVariant}
      />
      {isMobileScreen && isMobileDevice && <MobileBottomSheet isOpen={true} />}
    </section>
  );
};

export default ProductDetail;
