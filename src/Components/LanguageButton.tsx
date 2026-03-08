import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    const isEn = i18n.language === "en";

    return (
        <div className="fixed bottom-[14vh] right-[calc(50%-min(47vw,59vh)-1vh)] flex flex-col gap-[1vh] z-[10] pointer-events-none">
            <button
                onClick={() => changeLanguage("en")}
                className={`pointer-events-auto transition-all duration-300 pr-[3.5vh] pl-[2.5vh] py-[1vh] text-[1.8vh] font-bold uppercase tracking-wider shadow-md hover:translate-x-[0.5vh] ${
                    isEn
                        ? "bg-amber-800 text-white translate-x-[1vh]"
                        : "bg-amber-100/90 text-amber-900 hover:bg-amber-200 translate-x-[0vh]"
                }`}
                style={{
                    clipPath: "polygon(0% 0%, 85% 0%, 100% 50%, 85% 100%, 0% 100%)",
                }}
            >English
            </button>
            <button
                onClick={() => changeLanguage("ca")}
                className={`pointer-events-auto transition-all duration-300 pr-[3.5vh] pl-[2.5vh] py-[1vh] text-[1.8vh] font-bold uppercase tracking-wider shadow-md hover:translate-x-[0.5vh] ${
                    !isEn
                        ? "bg-amber-800 text-white translate-x-[1vh]"
                        : "bg-amber-100/90 text-amber-900 hover:bg-amber-200 translate-x-[0vh]"
                }`}
                style={{
                    clipPath: "polygon(0% 0%, 85% 0%, 100% 50%, 85% 100%, 0% 100%)",
                }}
            >
                Catalan
            </button>
        </div>
    );
}