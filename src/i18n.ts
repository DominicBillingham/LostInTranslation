import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "../public/locales/EN.json";
import translationCA from "../public/locales/CA.json";
import FRA2 from "../public/locales/FRA2.json";
import FRB1 from "../public/locales/FRB1.json";

const resources = {
    en: {
        translation: translationEN
    },
    ca: {
        translation: translationCA
    },
    fra2: {
        translation: FRA2
    },
    frb1: {
        translation: FRB1
    },

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