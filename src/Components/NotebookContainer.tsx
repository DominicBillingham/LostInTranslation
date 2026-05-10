import {useState, useEffect} from "react";
import Introduction from "@/Components/Introduction.tsx";
import StoryOptions from "@/Components/StoryOptions.tsx";
import AdventureTimeline from "@/Components/AdventureTimeline.tsx";
import LanguageSwitcher from "@/Components/LanguageButton.tsx";
import ResetButton from "@/Components/ResetButton.tsx";
import {HintManager} from "@/Managers/HintManager.ts";

export default function NotebookContainer() {
    const [introCompleted, setIntroCompleted] = useState(false);
    const [optionsCompleted, setOptionsCompleted] = useState(false);
    const [showTitle, setShowTitle] = useState(false);
    const [delayedIndicator, setDelayedIndicator] = useState(false);

    useEffect(() => {
        HintManager.loadHints();
    }, []);

    const handleIntroComplete = () => {
        setIntroCompleted(true);
        setShowTitle(true);
        setTimeout(() => {
            setDelayedIndicator(true);
        }, 2000);
    };

    return (
        <div className="font-medium custom-font text-[2.5vh] min-h-screen relative">
            <LanguageSwitcher />
            <ResetButton />
            <div className="story-column max-w-[min(94vw,92vh)] m-auto py-[2.5vh] relative z-20">
                <div className="notebook-page pt-[2vh] min-h-[95vh] flex flex-col relative">
                    <div className="mt-[1.5vh] px-[1.5vh] pb-[1.5vh] flex flex-col flex-grow">
                        
                        {!introCompleted && (
                            <>
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
