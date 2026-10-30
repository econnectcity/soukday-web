import { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import * as api from "@/api/apiRoutes";
import {
  setAvailableLanguages,
  setSelectedLanguage,
} from "@/redux/slices/languageSlice";
import { setPaymentSetting, setSetting } from "@/redux/slices/settingSlice";
import { setFavoriteProductIds } from "@/redux/slices/FavoriteSlice";
import { useRouter } from "next/router";
import Loader from "../loader/Loader";
import dynamic from "next/dynamic";
import { setModules, setActiveModule } from "@/redux/slices/moduleSlice";

const PushNotification = dynamic(
  () => import("../firebasenotification/PushNotification"),
  { ssr: false }
);

const MaintanceMode = dynamic(
  () => import("../error/MaintanceMode"),
  { ssr: false }
);

const CartDrawer = dynamic(
  () => import("../soukday/CartDrawer"),
  { ssr: false }
);

const AddressModal = dynamic(
  () => import("../soukday/AddressModal"),
  { ssr: false }
);

const Layout = ({ children, hideHeader = false, hideFooter = false }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.Theme.theme);
  const language = useSelector((state) => state.Language.selectedLanguage);
  const setting = useSelector((state) => state.Setting);

  const modules = useSelector((state) => state.Module.modules);
  const activeModuleId = useSelector((state) => state.Module.activeModuleId);

  useEffect(() => {
    if (!modules?.length || !activeModuleId) return;
    const stillEnabled = modules.some(
      (m) => String(m?.id) === String(activeModuleId)
    );
    if (!stillEnabled) {
      dispatch(setActiveModule({ data: modules[0].id }));
    }
  }, [modules, activeModuleId]);

  const availableLanguages = useSelector(
    (state) => state.Language.availableLanguages,
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!language?.type) return;
    document.documentElement.dir = language.type.toLowerCase();
    document.documentElement.lang = language.code || "fr";
  }, [language?.type, language?.code]);

  useEffect(() => {
    fetchModules();
    fetchSetting();
    fetchPaymentSetting();
    if (!availableLanguages?.length) {
      fetchLanguage();
    }
  }, []);

  const fetchModules = async () => {
    try {
      const res = await api.getModules();
      if (res && res.data && res.data.length > 0) {
        // Enforce grocery-only module
        const groceryModules = res.data.filter(
          (m) => m.slug === "grocery" || m.id == 1
        );
        const finalList = groceryModules.length > 0 ? groceryModules : [res.data[0]];
        dispatch(setModules({ data: finalList }));
        dispatch(setActiveModule({ data: finalList[0].id }));
      } else {
        dispatch(setModules({ data: [{ id: 1, slug: "grocery", name: "Épicerie" }] }));
        dispatch(setActiveModule({ data: 1 }));
      }
    } catch (e) {
      dispatch(setActiveModule({ data: 1 }));
    }
  };

  const fetchLanguage = async () => {
    try {
      const response = await api.getSystemLanguages({
        id: 0,
        isDefault: 0,
        systemType: 3,
      });
      if (response.status == 1 && response.data) {
        dispatch(setAvailableLanguages({ data: response.data }));
        // Default to Canadian French (code: 'fr')
        const frLang = response.data.find(
          (l) => (l.code || "").toLowerCase() === "fr"
        ) || response.data.find((l) => l.is_default == 1) || response.data[0];

        if (frLang) {
          if (!language || language.code !== "en") {
            dispatch(setSelectedLanguage({ data: frLang }));
          }
        }
      }
    } catch (error) {
      console.log("Error fetching languages", error);
    }
  };

  const fetchSetting = async () => {
    try {
      const res = await api.getSetting();
      if (res && res.data) {
        const decoded = JSON.parse(atob(res.data));
        decoded.currency = "$";
        decoded.currency_code = "CAD";
        dispatch(setSetting({ data: decoded }));
        dispatch(setFavoriteProductIds({ data: decoded?.favorite_product_ids }));

        const themeColor = decoded?.web_settings?.color || "#F68B62";
        document.documentElement.style.setProperty("--primary-color", themeColor);
        document.documentElement.style.setProperty(
          "--light-primary-color",
          decoded?.web_settings?.light_color || "#FCEFEA"
        );
      }
    } catch (error) {
      console.log("Error fetching settings", error);
    }
  };

  const fetchPaymentSetting = async () => {
    try {
      const res = await api.getPaymentSetting();
      if (res && res.data) {
        dispatch(setPaymentSetting({ data: JSON.parse(atob(res.data)) }));
      }
    } catch (error) {
      console.log("Error fetching payment settings", error);
    }
  };

  return (
    <section>
      {loading ? (
        <Loader screen="full" />
      ) : setting?.setting?.web_settings?.website_mode == 1 ? (
        <MaintanceMode message={setting?.setting?.web_settings?.website_mode_remark} />
      ) : (
        <PushNotification>
          {!hideHeader && <Header />}
          <main className="min-h-[70vh] bg-stone-50">
            {children}
          </main>
          {!hideFooter && <Footer />}
          <CartDrawer />
          <AddressModal />
          <ToastContainer
            theme={theme}
            key="toastContainer"
            bodyClassName={"toast-body"}
            toastClassName="toast-container-className"
          />
        </PushNotification>
      )}
    </section>
  );
};

export default Layout;
