import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const nextLang = i18n.language === "en" ? "ca" : "en";
        i18n.changeLanguage(nextLang);
    };

    return (
        <button 
            onClick={toggleLanguage}
            className="fixed bottom-6 right-6 z-50 p-3 bg-amber-800/80 hover:bg-amber-800 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center group"
            title={i18n.language === "en" ? "Switch to Catalan" : "Canvia a l'Anglès"}
        >
            <Globe size={24} className="group-hover:rotate-12 transition-transform duration-300" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 whitespace-nowrap text-sm font-medium">
                {i18n.language === "en" ? "EN" : "CA"}
            </span>
        </button>
    );
}