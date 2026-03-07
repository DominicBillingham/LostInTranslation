import {useEffect, useState} from "react";

interface IntroductionProps {
    onComplete: () => void;
}

export default function Introduction({onComplete}: IntroductionProps) {
    const [introStep, setIntroStep] = useState(0);
    const [displayedSentences, setDisplayedSentences] = useState<string[]>([]);
    const [showIndicator, setShowIndicator] = useState(true);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [introFadingOut, setIntroFadingOut] = useState(false);

    const introSentences = [
        "Once upon a time, in a dusty basement...",
        "You came across an old journal that seemed to take on a life of its own!",
        "Will you uncover its secrets?",
        "Or will you get..."
    ];

    useEffect(() => {
        // Show the first sentence immediately if nothing is displayed yet
        if (introStep === 0 && displayedSentences.length === 0) {
            setIntroStep(1);
            setDisplayedSentences([introSentences[0]]);
        }
    }, [introStep, displayedSentences, introSentences]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== " " || isFadingOut) return;
            event.preventDefault();

            setIntroStep(prevStep => {
                const nextStep = prevStep + 1;
                
                if (nextStep <= introSentences.length) {
                    setDisplayedSentences(introSentences.slice(0, nextStep));
                    return nextStep;
                } 
                
                if (nextStep === introSentences.length + 1) {
                    // Start fading out the intro sentences
                    setIntroFadingOut(true);
                    setShowIndicator(false);
                    setIsFadingOut(true);
                    setTimeout(() => {
                        onComplete();
                    }, 1000);
                    return nextStep;
                }
                return prevStep;
            });
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isFadingOut, introSentences, onComplete]);

    return (
        <div className={`mt-[8vh] journal-stream transition-opacity duration-1000 ${isFadingOut ? "opacity-0" : "opacity-100"}`}>
            
            <div className={`transition-opacity duration-1000 ${introFadingOut ? "opacity-0" : "opacity-100"}`}>
                {displayedSentences.map((sentence, index) => (
                    <div key={index} className="prata-regular tracking-wide text-center text-[3.5vh] px-[10vh] leading-[1.4] short-fade m-auto mb-4">
                        {sentence}
                    </div>
                ))}
            </div>
            
            {showIndicator && (
                <div className="ink-body text-[2.3vh] italic px-[0.5vh] text-center pointer-events-none fade2">
                    Press space to continue...
                </div>
            )}
        </div>
    );
}
