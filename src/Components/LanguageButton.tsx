import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    const isEn = i18n.language === "en";

    return (
        <div
            className="fixed bottom-[14vh] right-[calc(48%-min(47vw,59vh)-1vh)] flex flex-col gap-[1vh] z-[10] pointer-events-none">

            {/*<button*/}
            {/*    onClick={() => changeLanguage("en")}*/}
            {/*    className={`pointer-events-auto transition-all duration-300 pr-[3.5vh] pl-[3.5vh] py-[1.5vh] text-[1.8vh] font-bold uppercase tracking-wider shadow-md hover:translate-x-[0.5vh] ${*/}
            {/*        i18n.language === "en"*/}
            {/*            ? "bg-amber-800 text-white translate-x-[1vh]"*/}
            {/*            : "bg-amber-100/90 text-amber-900 hover:bg-amber-200 translate-x-[0vh]"*/}
            {/*    }`}*/}
            {/*    style={{*/}
            {/*        clipPath: "polygon(0% 0%, 100% 0%, 85% 50%, 100% 100%, 0% 100%)",*/}
            {/*    }}*/}
            {/*>English*/}
            {/*</button>*/}
            
            {/*<button*/}
            {/*    onClick={() => changeLanguage("ca")}*/}
            {/*    className={`pointer-events-auto transition-all duration-300 pr-[3.5vh] pl-[3.5vh] py-[1.5vh] text-[1.8vh] font-bold uppercase tracking-wider shadow-md hover:translate-x-[0.5vh] ${*/}
            {/*        i18n.language === "ca"*/}
            {/*            ? "bg-amber-800 text-white translate-x-[1vh]"*/}
            {/*            : "bg-amber-100/90 text-amber-900 hover:bg-amber-200 translate-x-[0vh]"*/}
            {/*    }`}*/}
            {/*    style={{*/}
            {/*        clipPath: "polygon(0% 0%, 100% 0%, 85% 50%, 100% 100%, 0% 100%)",*/}
            {/*    }}*/}
            {/*>*/}
            {/*    Catalan*/}
            {/*</button>*/}

            <button
                onClick={() => changeLanguage("frb1")}
                className={`pointer-events-auto transition-all duration-300 pr-[3.5vh] pl-[3.5vh] py-[1.5vh] text-[1.8vh] font-bold uppercase tracking-wider shadow-md hover:translate-x-[0.5vh] ${
                    i18n.language === "frb1"
                        ? "bg-amber-800 text-white translate-x-[1vh]"
                        : "bg-amber-100/90 text-amber-900 hover:bg-amber-200 translate-x-[0vh]"
                }`}
                style={{
                    clipPath: "polygon(0% 0%, 100% 0%, 85% 50%, 100% 100%, 0% 100%)",
                }}
            >
                Francès (B1)
            </button>

            <button
                onClick={() => changeLanguage("fra2")}
                className={`pointer-events-auto transition-all duration-300 pr-[3.5vh] pl-[3.5vh] py-[1.5vh] text-[1.8vh] font-bold uppercase tracking-wider shadow-md hover:translate-x-[0.5vh] ${
                    i18n.language === "fra2"
                        ? "bg-amber-800 text-white translate-x-[1vh]"
                        : "bg-amber-100/90 text-amber-900 hover:bg-amber-200 translate-x-[0vh]"
                }`}
                style={{
                    clipPath: "polygon(0% 0%, 100% 0%, 85% 50%, 100% 100%, 0% 100%)",
                }}
            >
                Francès (A2)
            </button>
            
        </div>
    );
}