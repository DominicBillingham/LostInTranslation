import {useEffect, useState} from "react";

interface IntroductionProps {
    onComplete: () => void;
}

export default function Introduction({onComplete}: IntroductionProps) {
    const [introStep, setIntroStep] = useState(0);
    const [displayedSentences, setDisplayedSentences] = useState<string[]>([]);
    const [showIndicator, setShowIndicator] = useState(true);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [showTitle, setShowTitle] = useState(false);
    const [introFadingOut, setIntroFadingOut] = useState(false);
    const [delayedIndicator, setDelayedIndicator] = useState(false);

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
                    setTimeout(() => {
                        setShowTitle(true);
                        // Delay the indicator by 1s after the title appears
                        setTimeout(() => {
                            setDelayedIndicator(true);
                            setShowIndicator(true);
                        }, 1000);
                    }, 1000); // Wait for intro to fade out
                    return nextStep;
                } 
                
                if (nextStep === introSentences.length + 2) {
                    // Only allow final press if the indicator is shown (meaning delay finished)
                    if (!delayedIndicator) return prevStep;
                    
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
    }, [isFadingOut, introSentences, delayedIndicator, onComplete]);

    return (
        <div className={`journal-stream transition-opacity duration-1000 ${isFadingOut ? "opacity-0" : "opacity-100"}`}>
            
            {!showTitle && (
                <div className={`transition-opacity duration-1000 ${introFadingOut ? "opacity-0" : "opacity-100"}`}>
                    {displayedSentences.map((sentence, index) => (
                        <div key={index} className="prata-regular tracking-wide text-center text-[3.5vh] px-[10vh] leading-[1.4] short-fade m-auto mb-4">
                            {sentence}
                        </div>
                    ))}
                </div>
            )}
            
            {showTitle && (
                <div className="fly-in-bottom">
                    <div className="prata-regular tracking-wide text-center text-[8vh] font-bold mt-[6vh] leading-[1.1] uppercase">
                        <div>Lost <span className="text-[5.5vh] align-baseline">in</span></div>
                        <div>Translation</div>
                    </div>
                    <div className="border-b border-2 border-amber-800/20 w-1/2 mx-auto my-[0.2vh] mb-[2vh]"></div>
                </div>
            )}

            {showIndicator && (
                <div className={`ink-body text-[2.3vh] italic px-[0.5vh] text-center pointer-events-none ${delayedIndicator ? "fade" : "fade2"}`}>
                    Press space to continue...
                </div>
            )}
        </div>
    );
}
