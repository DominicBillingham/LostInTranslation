import {useTranslation} from "react-i18next";

export default function ResetButton() {
    const {t} = useTranslation();

    const handleReset = () => {
        window.location.reload();
    };

    return (
        <div className="fixed top-[10vh] right-[calc(48%-min(47vw,59vh)-1vh)] z-[10] pointer-events-none">
            <button
                onClick={handleReset}
                className="pointer-events-auto transition-all duration-300 pr-[3.5vh] pl-[3.5vh] py-[1.5vh] text-[1.8vh] font-bold uppercase tracking-wider shadow-md hover:translate-x-[0.5vh] bg-amber-100/90 text-amber-900 hover:bg-amber-200 translate-x-[0vh]"
                style={{
                    clipPath: "polygon(0% 0%, 100% 0%, 85% 50%, 100% 100%, 0% 100%)",
                }}
            >
                {t("resetGame")}
            </button>
        </div>
    );
}
