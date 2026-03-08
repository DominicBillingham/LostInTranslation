import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    const isEn = i18n.language === "en";

    return (
        <div className="fixed bottom-[4vh] right-[calc(50%-min(47vw,46vh)-2vh)] flex flex-col gap-[1vh] z-[100] pointer-events-none">
            <button
                onClick={() => changeLanguage("en")}
                className={`pointer-events-auto transition-all duration-300 pl-[3.5vh] pr-[2.5vh] py-[1vh] text-[1.8vh] font-bold uppercase tracking-wider shadow-md hover:translate-x-[0.5vh] ${
                    isEn
                        ? "bg-amber-800 text-white translate-x-[1vh]"
                        : "bg-amber-100/90 text-amber-900 hover:bg-amber-200 translate-x-[0vh]"
                }`}
                style={{
                    clipPath: "polygon(15% 0%, 100% 0%, 100% 100%, 15% 100%, 0% 50%)",
                }}
            >
                English
            </button>
            <button
                onClick={() => changeLanguage("ca")}
                className={`pointer-events-auto transition-all duration-300 pl-[3.5vh] pr-[2.5vh] py-[1vh] text-[1.8vh] font-bold uppercase tracking-wider shadow-md hover:translate-x-[0.5vh] ${
                    !isEn
                        ? "bg-amber-800 text-white translate-x-[1vh]"
                        : "bg-amber-100/90 text-amber-900 hover:bg-amber-200 translate-x-[0vh]"
                }`}
                style={{
                    clipPath: "polygon(15% 0%, 100% 0%, 100% 100%, 15% 100%, 0% 50%)",
                }}
            >
                Catalan
            </button>
        </div>
    );
}