import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

interface IntroductionProps {
    onComplete: () => void;
}

export default function Introduction({onComplete}: IntroductionProps) {

    const { t } = useTranslation();

    const [introStep, setIntroStep] = useState(0);
    const [showIndicator, setShowIndicator] = useState(true);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [introFadingOut, setIntroFadingOut] = useState(false);
    const [delayedIndicator, setDelayedIndicator] = useState(false);

    const introKeys = [
        "dustyBasement",
        "oldJournal",
        "uncoverSecrets",
        "willGet",
    ];

    useEffect(() => {
        // Show the first sentence immediately if nothing is displayed yet
        if (introStep === 0) {
            setIntroStep(1);
        }
    }, [introStep]);

    const advanceStep = () => {
        if (isFadingOut) return;

        setIntroStep(prevStep => {
            const nextStep = prevStep + 1;

            if (nextStep <= introKeys.length) {
                return nextStep;
            }

            if (nextStep === introKeys.length + 1) {
                // Start fading out the intro sentences
                setIntroFadingOut(true);
                setShowIndicator(false);
                setTimeout(() => {
                    onComplete();
                }, 1000); // Wait for intro to fade out
                return nextStep;
            }

            return prevStep;
        });
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== " " || isFadingOut) return;
            event.preventDefault();

            advanceStep();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isFadingOut, introKeys.length, delayedIndicator, onComplete]);

    return (
        <div className={`mt-[6vh] journal-stream transition-opacity duration-1000`}>
            <div className={`transition-opacity duration-1000 ${introFadingOut ? "opacity-0" : "opacity-100"}`}>
                {introKeys.slice(0, introStep).map((key, index) => (
                    <div key={index} className="prata-regular tracking-wide text-center text-[3.5vh] px-[10vh] leading-[1.4] short-fade m-auto mb-4">
                        {t(key)}
                    </div>
                ))}
            </div>

            {showIndicator && !introFadingOut && (
                <button
                    type="button"
                    className="choice-btn rounded-[1vh] px-[3vh] py-[1vh] shadow-md hover:shadow-lg hover:cursor-pointer short-fade mx-auto block"
                    onClick={advanceStep}
                >
                    {t("pressSpaceToContinue")}
                </button>
            )}
        </div>
    );
}
