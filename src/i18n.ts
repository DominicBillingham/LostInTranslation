import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEN from "../public/locales/en/translation.json";
import translationCA from "../public/locales/ca/translation.json";

const resources = {
    en: {
        translation: translationEN
    },
    ca: {
        translation: translationCA
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;