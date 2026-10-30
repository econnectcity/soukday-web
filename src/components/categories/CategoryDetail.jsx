import React, { useEffect, useState } from "react";
import BreadCrumb from "../breadcrumb/BreadCrumb";
import * as api from "@/api/apiRoutes";
import { useLocalizedRouter } from "@/utils/localizedNav";
import { useRedirectHomeOnModuleChange } from "@/utils/useRedirectHomeOnModuleChange";
import { useDispatch, useSelector } from "react-redux";
import {
  setFilterCategory,
  setSelectedCategories,
  setFilterSort,
  setFilterView,
} from "@/redux/slices/productFilterSlice";
import CardSkeleton from "../skeleton/CardSkeleton";
import { t } from "@/utils/translation";
import Filter from "../productFilter/ProductFilter";
import FilterDrawer from "../productFilter/FilterDrawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { FaThList } from "react-icons/fa";
import ListViewProductCard from "../productcards/ListViewProductCard";
import VerticleProductCard from "../productcards/VerticleProductCard";
import { IoFilter } from "react-icons/io5";
import NoOrderSvg from "@/assets/not_found_images/No_Orders.svg";
import Image from "next/image";
import SubCategorySwiper from "./SubCategorySwiper";
import { isRtl } from "@/lib/utils";
import { getTranslatedCategoryName } from "@/utils/categoryTranslation";
import { PRODUCTS, DEFAULT_CATEGORIES } from "@/data/mockData";
import { Sparkles, ShoppingBag } from "lucide-react";

const CategoryDetail = () => {
  const dispatch = useDispatch();
  const router = useLocalizedRouter();
  const { slug } = router.query;

  const city = useSelector((state) => state.City);
  const filter = useSelector((state) => state.ProductFilter);
  const language = useSelector((state) => state.Language.selectedLanguage);
  const categoryBreadcrumb = useSelector(
    (state) => state.ProductFilter.categoryBreadcrumb
  );
  const rtl = isRtl();

  // A category can't exist in another module — on user module switch, go home.
  useRedirectHomeOnModuleChange();

  // ─── Slug Resolution ───────────────────────────────────────────────────────
  const slugArray = Array.isArray(slug) ? slug : slug ? [slug] : [];
  const isAll = slugArray[0] === "all";
  const currentSlug = isAll ? "" : slugArray[slugArray.length - 1] || "";
  const slug_id = currentSlug;

  // ─── Category state ────────────────────────────────────────────────────────
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCategories, setTotalCategories] = useState(0);
  const [page, setPage] = useState(1);
  const categoryPerPage = 12;

  // ─── Products state ────────────────────────────────────────────────────────
  const [productResult, setProductResult] = useState([]);
  const [offset, setOffset] = useState(0);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [values, setValues] = useState([]);
  const [isLoader, setisLoader] = useState(false);
  const [totalProducts, settotalProducts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [fetchedCategoryName, setFetchedCategoryName] = useState(null);

  const total_products_per_page = 12;
  const placeholderItems = Array.from({ length: 12 }).map((_, index) => index);
  const isFrench = (language?.code || "fr").toLowerCase() === "fr";

  // Formatted human title fallback
  const formattedSlug = currentSlug
    ? String(currentSlug)
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : "";

  // Check DEFAULT_CATEGORIES mock fallback for title
  const defaultCategoryMatch = DEFAULT_CATEGORIES.find((c) => c.slug === currentSlug);
  const defaultCatName = defaultCategoryMatch ? getTranslatedCategoryName(defaultCategoryMatch, isFrench) : null;

  const categoryName = categoryBreadcrumb?.find((c) => c.slug === currentSlug)?.name;
  const rawTitle = fetchedCategoryName || defaultCatName || categoryName || formattedSlug;
  const breadcrumbTitle = isAll
    ? t("all")
    : getTranslatedCategoryName({ name: rawTitle, slug: currentSlug }, isFrench);

  // ─── Fetch the current category's own name ──────────────────────────────────
  useEffect(() => {
    setFetchedCategoryName(null);
    if (isAll || !currentSlug) return;
    let cancelled = false;
    api
      .getCategories({ slug: currentSlug, is_own_data: 1 })
      .then((res) => {
        if (cancelled) return;
        const data = res?.data;
        const matchedCategory = Array.isArray(data)
          ? data.find((c) => c.slug === currentSlug)
          : data;
        if (matchedCategory) {
          const name = getTranslatedCategoryName(matchedCategory, isFrench);
          if (name) setFetchedCategoryName(name);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [currentSlug, isAll, language?.id, isFrench]);

  // ─── Reset category page when slug changes ─────────────────────────────────
  useEffect(() => {
    setPage(1);
  }, [slug_id]);

  useEffect(() => {
    const offsetCalc = (page - 1) * categoryPerPage;
    fetchCategories(slug_id, offsetCalc);
  }, [page, slug_id]);

  // ─── Category fetch ────────────────────────────────────────────────────────
  const fetchCategories = async (Slug = "", offsetNum = 0) => {
    setIsLoading(true);
    try {
      const result = await api.getCategories({
        limit: categoryPerPage,
        offset: offsetNum,
        slug: Slug,
      });
      setCategories(result);
      setTotalCategories(result?.total || 0);
    } catch (error) {
      console.log("Error fetching categories", error);
    }
    setIsLoading(false);
  };

  // ─── Category click ────────────────────────────────────────────────────────
  const handleCategoryClick = (category) => {
    dispatch(setSelectedCategories({ data: category?.slug }));
    dispatch(setFilterCategory({ data: category?.slug }));

    const baseSlugPath = slugArray[0] === "all" ? [] : slugArray;
    const newPath = [...baseSlugPath, category.slug];

    router.push(`/categories/${newPath.join("/")}`);
  };

  // ─── Fallback mock products for category ───────────────────────────────────
  const getFallbackMockProducts = (catSlug) => {
    if (!catSlug) return [];
    const q = catSlug.toLowerCase().trim();
    return PRODUCTS.filter((p) => {
      const pCat = (p.categorySlug || "").toLowerCase();
      const pSub = (p.subcategorySlug || "").toLowerCase();
      const pName = (p.name || "").toLowerCase();

      if (pCat === q || pSub === q) return true;
      if (q.includes("boulangerie") && (pCat.includes("boulangerie") || pName.includes("pain") || pName.includes("croissant") || pName.includes("makrout"))) return true;
      if (q.includes("maghreb") && (pCat.includes("maghreb") || pName.includes("semoule") || pName.includes("harissa") || pName.includes("couscous"))) return true;
      if (q.includes("epice") && (pCat.includes("epice") || pSub.includes("epice") || pName.includes("curcuma") || pName.includes("thym") || pName.includes("paprika"))) return true;
      if (q.includes("fruit") && (pCat.includes("fruit") || pCat.includes("legume") || pName.includes("pomme") || pName.includes("orange") || pName.includes("tomate"))) return true;
      if (q.includes("noix") && (pCat.includes("noix") || pName.includes("amande") || pName.includes("datte") || pName.includes("pistache"))) return true;
      if (q.includes("viande") && (pCat.includes("viande") || p.isHalal || pName.includes("boeuf") || pName.includes("agneau") || pName.includes("poulet"))) return true;
      if (q.includes("poisson") && (pCat.includes("poisson") || pName.includes("sardine") || pName.includes("thon") || pName.includes("crevette"))) return true;
      if (q.includes("plat") && (pCat.includes("plat") || pName.includes("tajine") || pName.includes("couscous"))) return true;
      return false;
    }).map((m) => ({
      id: m.id,
      name: m.name,
      translations: { name: m.name },
      slug: m.slug,
      image_url: m.image,
      price: m.price,
      discounted_price: m.originalPrice ? m.price : 0,
      seller_name: m.storeName || "Soukday",
      seller: { store_name: m.storeName || "Soukday" },
      variants: [
        {
          id: m.id * 100,
          product_id: m.id,
          measurement: m.unit || "1 unit",
          stock: 100,
          price: m.price,
          discounted_price: m.originalPrice ? m.price : 0,
        },
      ],
      is_deliverable: true,
    }));
  };

  // ─── Products fetch ────────────────────────────────────────────────────────
  const filterProductsFromApi = async (filterParams, targetOffset, categorySlug) => {
    try {
      if (targetOffset === 0) {
        setLoading(true);
      } else {
        setIsLoadMoreLoading(true);
      }

      // Safe coordinates with Montreal defaults
      const lat = city?.city?.latitude ? parseFloat(city.city.latitude) : 45.5017;
      const lng = city?.city?.longitude ? parseFloat(city.city.longitude) : -73.5673;

      const result = await api.getProductByFilter({
        latitude: lat,
        longitude: lng,
        filters: { ...filterParams, category_slug: categorySlug },
      });

      if (result && result.status === 1 && Array.isArray(result.data) && result.data.length > 0) {
        handlePrices(result);
        if (targetOffset === 0) {
          setProductResult(result.data);
        } else {
          setProductResult((prevProduct) => [...prevProduct, ...result.data]);
        }
        settotalProducts(result.total);
      } else {
        // Fallback to rich mock catalog for this category if API returned no items
        const fallback = getFallbackMockProducts(categorySlug);
        if (fallback.length > 0) {
          if (targetOffset === 0) {
            setProductResult(fallback);
          } else {
            setProductResult((prev) => [...prev, ...fallback]);
          }
          settotalProducts(fallback.length);
        } else {
          setProductResult([]);
          settotalProducts(0);
        }
      }
    } catch (error) {
      console.warn("Error fetching category products, applying catalog fallback:", error);
      const fallback = getFallbackMockProducts(categorySlug);
      if (fallback.length > 0) {
        setProductResult(fallback);
        settotalProducts(fallback.length);
      } else {
        setProductResult([]);
        settotalProducts(0);
      }
    } finally {
      setLoading(false);
      setIsLoadMoreLoading(false);
    }
  };

  // ─── Fetch products whenever filter or slug changes ────────────────────────
  useEffect(() => {
    setOffset(0);
    filterProductsFromApi(
      {
        min_price: filter.price_filter?.min_price,
        max_price: filter.price_filter?.max_price,
        brand_ids: filter?.brand_ids ? filter.brand_ids.toString() : "",
        sort: filter?.sort_filter,
        limit: total_products_per_page,
        sizes: filter?.search_sizes
          ?.filter((obj) => obj.checked)
          .map((obj) => obj["size"])
          .join(","),
        offset: 0,
        unit_ids: filter?.search_sizes
          ?.filter((obj) => obj.checked)
          .map((obj) => obj["unit_id"])
          .join(","),
        seller_id: filter?.seller_id,
        country_id: filter?.country_id,
        section_id: filter?.section_id,
      },
      0,
      slug_id
    );
  }, [
    slug_id,
    filter.brand_ids,
    filter.sort_filter,
    filter?.search_sizes,
    filter?.price_filter,
    filter?.seller_id,
    filter?.country_id,
    filter?.section_id,
    city?.city,
  ]);

  const handlePrices = async (result) => {
    if (minPrice == null && maxPrice == null && filter?.price_filter == null) {
      setMinPrice(parseInt(result.total_min_price || 0));
      if (result.total_min_price === result.total_max_price) {
        setMaxPrice(parseInt(result.total_max_price || 100) + 100);
        setValues([
          parseInt(result.total_min_price || 0),
          parseInt(result.total_max_price || 100) + 100,
        ]);
      } else {
        setMaxPrice(parseInt(result.total_max_price || 100));
        setValues([
          parseInt(result.total_min_price || 0),
          parseInt(result.total_max_price || 100),
        ]);
      }
    }
  };

  const handleGridViewChange = () => {
    dispatch(setFilterView({ data: true }));
  };
  const handleListViewChange = () => {
    dispatch(setFilterView({ data: false }));
  };

  const handleFetchMore = async () => {
    const nextOffset = offset + total_products_per_page;
    setOffset(nextOffset);
    filterProductsFromApi(
      {
        min_price: filter.price_filter?.min_price,
        max_price: filter.price_filter?.max_price,
        brand_ids: filter?.brand_ids ? filter.brand_ids.toString() : "",
        sort: filter?.sort_filter,
        limit: total_products_per_page,
        sizes: filter?.search_sizes
          ?.filter((obj) => obj.checked)
          .map((obj) => obj["size"])
          .join(","),
        offset: nextOffset,
        unit_ids: filter?.search_sizes
          ?.filter((obj) => obj.checked)
          .map((obj) => obj["unit_id"])
          .join(","),
        seller_id: filter?.seller_id,
        country_id: filter?.country_id,
        section_id: filter?.section_id,
      },
      nextOffset,
      slug_id
    );
  };

  const sortProduct = async (value) => {
    setProductResult([]);
    setOffset(0);
    dispatch(setFilterSort({ data: value }));
  };

  return (
    <section className="bg-stone-50 min-h-screen pb-16">
      {/* 1. BreadCrumb Navigation */}
      <BreadCrumb title={breadcrumbTitle} />

      {/* 2. Category Header Banner (Store-like visual header) */}
      <div className="bg-white border-b border-stone-200/80 pt-6 pb-7 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FCEFEA] border border-[#F68B62]/30 text-[#F68B62] text-xs font-bold mb-2 shadow-2xs">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{isFrench ? "Rayon Soukday" : "Soukday Aisle"}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight leading-tight">
                {breadcrumbTitle}
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1">
                {isFrench 
                  ? "Découvrez tous les produits frais, de spécialités et d'épicerie disponibles dans ce rayon." 
                  : "Discover all fresh, specialty, and grocery items available in this aisle."}
              </p>
            </div>

            {/* Product Count Badge */}
            <div className="shrink-0 flex items-center gap-2">
              <div className="bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#F68B62]" />
                <span className="text-xs font-bold text-stone-700">
                  {totalProducts} {totalProducts === 1 ? (isFrench ? "produit" : "product") : (isFrench ? "produits disponibles" : "products available")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile filter trigger */}
        <div
          className="w-full cardBorder md:hidden flex p-3 my-4 bg-white rounded-xl gap-2 items-center text-sm font-bold shadow-xs hover:cursor-pointer"
          onClick={() => setShowFilter(true)}
        >
          <IoFilter className="w-4 h-4 text-[#F68B62]" />
          <span>{t("filter")}</span>
        </div>

        <div className="grid grid-cols-12 gap-6 items-start">
          {/* Sidebar filter (desktop) */}
          <div className="col-span-12 md:col-span-4 lg:col-span-3 rounded-2xl hidden md:block sticky top-24">
            <Filter
              setProductResult={setProductResult}
              setOffset={setOffset}
              handlePrices={handlePrices}
              minPrice={minPrice}
              maxPrice={maxPrice}
              values={values}
              setValues={setValues}
              setMaxPrice={setMaxPrice}
              setMinPrice={setMinPrice}
              setisLoader={setisLoader}
              hideCategory={true}
              disableFilter={false}
            />
          </div>

          {/* Product listing area */}
          <div className="col-span-12 md:col-span-8 lg:col-span-9">
            <div className="flex flex-col gap-5">
              
              {/* Subcategory swiper (if subcategories exist for this department) */}
              {categories?.data?.length > 0 && (
                <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs">
                  <SubCategorySwiper
                    subCategories={categories?.data ?? []}
                    isLoading={isLoading}
                    languageType={language?.type}
                    rtl={rtl}
                    onCategoryClick={handleCategoryClick}
                  />
                </div>
              )}

              {/* Sort / view toggle header */}
              {loading ? (
                <CardSkeleton height={70} />
              ) : (
                <div className="flex justify-between flex-col sm:flex-row sm:items-center p-3.5 bg-white border border-stone-200/80 rounded-2xl gap-3 shadow-xs">
                  <p className="text-xs sm:text-sm font-bold text-stone-700">
                    {totalProducts} {t("products_found")}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-stone-500 whitespace-nowrap">
                        {t("sortBy")}
                      </span>
                      <Select
                        onValueChange={sortProduct}
                        value={filter?.sort_filter || "default"}
                      >
                        <SelectTrigger className="w-[140px] sm:w-[170px] h-9 text-xs font-bold bg-stone-50 border border-stone-200 rounded-xl focus:ring-[#F68B62]/30">
                          <SelectValue placeholder={t("default")} />
                        </SelectTrigger>
                        <SelectContent className="z-30 bg-white shadow-xl rounded-xl border border-stone-200">
                          <SelectItem value="default" className="text-xs">{t("default")}</SelectItem>
                          <SelectItem value="new" className="text-xs">{t("newest_first")}</SelectItem>
                          <SelectItem value="old" className="text-xs">{t("oldest_first")}</SelectItem>
                          <SelectItem value="high" className="text-xs">{t("high_to_low")}</SelectItem>
                          <SelectItem value="low" className="text-xs">{t("low_to_high")}</SelectItem>
                          <SelectItem value="discount" className="text-xs">{t("discount_high_to_low")}</SelectItem>
                          <SelectItem value="popular" className="text-xs">{t("popularity")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-1.5 border-l border-stone-200 pl-3">
                      <button
                        type="button"
                        onClick={handleGridViewChange}
                        aria-label="Grid View"
                        className={`p-1.5 rounded-lg transition-all ${
                          filter?.grid_view
                            ? "bg-[#F68B62] text-white shadow-xs"
                            : "text-stone-400 hover:text-stone-700 hover:bg-stone-100"
                        }`}
                      >
                        <BsFillGrid3X3GapFill size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={handleListViewChange}
                        aria-label="List View"
                        className={`p-1.5 rounded-lg transition-all ${
                          !filter?.grid_view
                            ? "bg-[#F68B62] text-white shadow-xs"
                            : "text-stone-400 hover:text-stone-700 hover:bg-stone-100"
                        }`}
                      >
                        <FaThList size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Product cards grid */}
              <div className="grid grid-cols-12 gap-3 sm:gap-4 h-full">
                {loading ? (
                  placeholderItems.map((index) => (
                    <div
                      className={
                        filter?.grid_view
                          ? "col-span-6 sm:col-span-6 md:col-span-6 lg:col-span-4"
                          : "col-span-12"
                      }
                      key={index}
                    >
                      <CardSkeleton height={filter?.grid_view ? 320 : 180} />
                    </div>
                  ))
                ) : productResult?.length <= 0 ? (
                  <div className="flex flex-col justify-center items-center col-span-12 py-16 bg-white rounded-3xl border border-stone-200/70 p-8 text-center">
                    <div className="w-48 h-48 opacity-80 mb-4">
                      <Image
                        src={NoOrderSvg}
                        alt="Product not found"
                        width={200}
                        height={200}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <h2 className="font-extrabold text-lg sm:text-xl text-stone-900">
                      {t("no_product_found")}
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-500 max-w-sm mt-1">
                      {isFrench 
                        ? "Aucun produit ne correspond à vos filtres dans ce rayon." 
                        : "No products matched your filters in this aisle."}
                    </p>
                  </div>
                ) : (
                  productResult?.map((product) => (
                    <div
                      className={
                        filter?.grid_view
                          ? "col-span-6 sm:col-span-6 md:col-span-6 lg:col-span-4"
                          : "col-span-12"
                      }
                      key={product?.id}
                    >
                      {filter?.grid_view ? (
                        <VerticleProductCard product={product} />
                      ) : (
                        <ListViewProductCard product={product} />
                      )}
                    </div>
                  ))
                )}

                {/* Load more skeleton */}
                {isLoadMoreLoading &&
                  placeholderItems.slice(0, 4).map((index) => (
                    <div
                      className={
                        filter?.grid_view
                          ? "col-span-6 sm:col-span-6 md:col-span-6 lg:col-span-4"
                          : "col-span-12"
                      }
                      key={`load-more-${index}`}
                    >
                      <CardSkeleton height={filter?.grid_view ? 320 : 180} />
                    </div>
                  ))}

                {/* Load more button */}
                {totalProducts > productResult?.length && (
                  <div className="col-span-12 mt-6 w-full flex justify-center mx-auto">
                    <button
                      type="button"
                      className="bg-[#F68B62] hover:bg-[#e07750] active:scale-95 text-white text-sm font-bold py-2.5 px-6 rounded-full shadow-md shadow-[#F68B62]/25 transition-all cursor-pointer"
                      onClick={handleFetchMore}
                    >
                      {t("load_more")}
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <FilterDrawer
        showFilter={showFilter}
        setShowFilter={setShowFilter}
        setProductResult={setProductResult}
        setOffset={setOffset}
        handlePrices={handlePrices}
        minPrice={minPrice}
        maxPrice={maxPrice}
        values={values}
        setValues={setValues}
        setMaxPrice={setMaxPrice}
        setMinPrice={setMinPrice}
        hideCategory={true}
        disableFilter={false}
      />
    </section>
  );
};

export default CategoryDetail;
