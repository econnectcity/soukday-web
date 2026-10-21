import enTranslation from "./en.json";
import frTranslation from "./fr.json";
import { store } from "@/redux/store";
import { useSelector } from "react-redux";

export const t = (label) => {
    const state = store?.getState?.();
    const selectedLang = state?.Language?.selectedLanguage;
    const currentCode = (selectedLang?.code || "fr").toLowerCase();
    const langData = selectedLang?.json_data && selectedLang.json_data[label];

    // If English is explicitly selected
    if (currentCode === "en") {
        return langData || enTranslation[label] || label;
    }

    // Default: Canadian French
    return frTranslation[label] || langData || enTranslation[label] || label;
};

export const useTranslation = () => {
    const selectedLang = useSelector((state) => state?.Language?.selectedLanguage);
    const currentCode = (selectedLang?.code || "fr").toLowerCase();

    const translate = (label, fallbackEn = "", fallbackFr = "") => {
        if (currentCode === "en") {
            return selectedLang?.json_data?.[label] || enTranslation[label] || fallbackEn || label;
        }
        return frTranslation[label] || selectedLang?.json_data?.[label] || fallbackFr || enTranslation[label] || label;
    };

    return {
        t: translate,
        currentCode,
        isFrench: currentCode === "fr",
        isEnglish: currentCode === "en",
        selectedLang
    };
};