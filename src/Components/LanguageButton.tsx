import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    return (
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "1rem" }}>
            <button 
                onClick={() => changeLanguage("en")}
                style={{ fontWeight: i18n.language === "en" ? "bold" : "normal" }}
            >
                English
            </button>
            <button 
                onClick={() => changeLanguage("es")}
                style={{ fontWeight: i18n.language === "es" ? "bold" : "normal" }}
            >
                Español
            </button>
        </div>
    );
}