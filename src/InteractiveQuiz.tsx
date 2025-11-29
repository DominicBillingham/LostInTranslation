import {useEffect, useRef, useState, type MutableRefObject, type ReactNode} from "react";
import Sound from "./SoundManager.ts";
interface Quiz {
    quizName: string;
    nextOption?: string;
    nextScene?: string;
    quizQuestion: string;
    quizAnswers: QuizOption[];
}
interface QuizOption {
    answerText: string;
    isCorrectAnswer: boolean;
    reason: string;
}

export default function InteractiveQuiz({quizRef, navigateToNode}) {


    const [refreshAnimations, setRefreshAnimations] = useState(0);
    const [areOptionsEnabled, setAreOptionsEnabled] = useState<boolean>(true);
    const [quizText, setQuizText] = useState<string>('');
    const [feedbackText, setFeedbackText] = useState<string>('');
    const [selectedIsCorrect, setSelectedIsCorrect] = useState<boolean | null>(null);

    // Initialize quiz text when quizRef changes or when a new quiz is loaded
    useEffect(() => {
        const current = quizRef?.current as (Quiz & { reasontext?: string }) | undefined;
        if (current?.quizQuestion) {
            setQuizText(current.quizQuestion);
            setAreOptionsEnabled(true);
            setFeedbackText('');
            setSelectedIsCorrect(null);
            // bump key to refresh fade-in
            setRefreshAnimations((v) => v + 1);
        }

        console.log(quizRef?.current);

    }, [quizRef]);

    function ChooseAnswer(quizAnswer: QuizOption) {
        // Ensure the click actually updates the UI
        console.log(quizAnswer.answerText);
        void Sound.playClick();
        setAreOptionsEnabled(false);
        // Do not overwrite the main quiz question; show feedback separately
        const qr = quizRef?.current as (Quiz & { reasontext?: string }) | undefined;
        setFeedbackText(quizAnswer.reason || qr?.reasontext || quizAnswer.answerText || '');
        setSelectedIsCorrect(!!quizAnswer.isCorrectAnswer);
        setRefreshAnimations((v) => v + 1);
        // Potentially navigate or handle correctness later using navigateToNode and isCorrectAnswer
    }

    function Continue() {
        void Sound.playClick();
        const current = quizRef?.current as Quiz | undefined;
        if (!current) return;
        if (current.nextOption) {
            navigateToNode(current.nextOption);
            return;
        }
        if (current.nextScene) {
            navigateToNode(current.nextScene);
            return;
        }
        // If nothing is provided, do nothing for now
    }

    return (
        <>

            {/* Primary question textbox moved further up */}
            <div
                id="storyTextBox"
                className="absolute bottom-[260px] left-[40px] right-[40px] bg-white/90 rounded-xl p-3 text-gray-800 h-[80px] shadow-md fade"
            >

                <p className="fade" key={refreshAnimations}>
                    <span className={!areOptionsEnabled ? 'text-gray-500' : ''}>{quizText}</span>
                    {!areOptionsEnabled && feedbackText && (
                        <>
                            <br/>
                            {selectedIsCorrect !== null && (
                                <>
                                    <span className={selectedIsCorrect ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                                        {selectedIsCorrect ? 'Correct - ' : 'Incorrect - '}
                                    </span>
                                    <span> </span>
                                </>
                            )}
                            <span className="text-gray-800">{feedbackText}</span>
                        </>
                    )}
                </p>

            </div>
            
            {/* Options moved further up */}
            <div className={`absolute  left-[40px] right-[40px] bottom-[140px] grid grid-cols-2 gap-2 z-10 ${!areOptionsEnabled ? 'pointer-events-none opacity-60 cursor-not-allowed' : ''}`}>
                {Array.isArray(quizRef?.current?.quizAnswers) && quizRef.current.quizAnswers.length > 0 && (
                    quizRef.current.quizAnswers.slice(0, 4).map((ans: QuizOption, i: number) => (
                        <button
                            key={ans.answerText + i}
                            type="button"
                            disabled={!areOptionsEnabled}
                            className="bg-orange-100/95 rounded-xl overflow-x-auto overflow-y-hidden whitespace-nowrap p-2 pl-3 text-gray-900 shadow-md hover:shadow-lg  border-[#FF7F50] border-3 text-left hover:cursor-pointer hover:bg-orange-200/95 fade "
                            onClick={() => ChooseAnswer(ans)}
                        >
                            {ans.answerText}
                        </button>
                    ))
                )}
            </div>

            {/* Continue button below the feedback textbox, centered */}
            {!areOptionsEnabled && (
                <div className="absolute left-[40px] right-[40px] bottom-[57px] z-10 flex justify-center">
                    <button
                        type="button"
                        className="bg-orange-200/95 rounded-xl px-32 py-2 text-gray-900 shadow-md hover:shadow-lg border-[#FF7F50] border-3 text-center hover:cursor-pointer hover:bg-orange-300/95 fade"
                        onClick={Continue}
                    >
                        Continue
                    </button>
                </div>
            )}


        </>
    )


}
