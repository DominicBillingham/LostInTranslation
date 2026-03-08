import {useState, useEffect} from "react";
import Introduction from "@/Components/Introduction.tsx";
import StoryOptions from "@/Components/StoryOptions.tsx";
import AdventureTimeline from "@/Components/AdventureTimeline.tsx";
import LanguageSwitcher from "@/Components/LanguageButton.tsx";

export default function NotebookContainer() {
    const [introCompleted, setIntroCompleted] = useState(false);
    const [optionsCompleted, setOptionsCompleted] = useState(false);
    const [showTitle, setShowTitle] = useState(false);
    const [delayedIndicator, setDelayedIndicator] = useState(false);

    const handleIntroComplete = () => {
        setIntroCompleted(true);
        setShowTitle(true);
        setTimeout(() => {
            setDelayedIndicator(true);
        }, 1000);
    };

    const handleTitleSpacePress = (event: KeyboardEvent) => {
        if (event.key === " " && introCompleted && !optionsCompleted && delayedIndicator) {
            // Note: StoryOptions itself handles the "Start Writing" button, 
            // so we don't strictly need space here to "complete" options, 
            // but we might want it to reveal the options menu if it's hidden.
            // Actually, StoryOptions is already rendered when delayedIndicator is true.
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", handleTitleSpacePress);
        return () => window.removeEventListener("keydown", handleTitleSpacePress);
    }, [introCompleted, optionsCompleted, delayedIndicator]);

    return (
        <div className="font-medium custom-font text-[2.5vh] min-h-screen">
            <div className="story-column max-w-[min(94vw,92vh)] m-auto py-[2.5vh]">
                <div className="notebook-page pt-[2vh] min-h-[95vh] flex flex-col">
                    <div className="mt-[1.5vh] px-[1.5vh] pb-[1.5vh]">
                        
                        {!introCompleted && (
                            <>
                                <LanguageSwitcher />
                                <Introduction onComplete={handleIntroComplete} />
                            </>
                        )}

                        {introCompleted && (
                            <>
                                {showTitle && (
                                    <div className="mt-[6vh] fly-in-bottom">
                                        <div className="prata-regular tracking-wide text-center text-[8vh] font-bold leading-[1.1] uppercase">
                                            <div>Lost <span className="text-[5.5vh] align-baseline">in</span></div>
                                            <div>Translation</div>
                                        </div>
                                        <div className="border-b border-2 border-amber-800/20 w-1/2 mx-auto my-[0.2vh] mb-[2vh]"></div>
                                    </div>
                                )}

                                {!optionsCompleted ? (
                                    <>
                                        {delayedIndicator ? (
                                            <StoryOptions onStart={() => setOptionsCompleted(true)} />
                                        ) : (
                                            <div className="ink-body text-[2.3vh] italic px-[0.5vh] text-center pointer-events-none fade2">
                                                {/* Hidden or subtle indicator if needed while title settles */}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <AdventureTimeline />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
